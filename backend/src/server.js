import express from 'express'
import { fileURLToPath } from 'node:url'
import { auth, exigirRoles } from './auth.js'
import { conectar, leerOperacion, prepararBase } from './db.js'
import { catalogos, datosParaRol, registros, servicioOperacion } from './operacion.js'
import { ErrorOperacion } from './validacion.js'

const { MONGODB_URI, MONGODB_DB = 'floatmate_ppi', PORT = '3001', DEMO_PASSWORD, COOKIE_SECURE } = process.env
const administracion = exigirRoles('Administrador')
const operacion = exigirRoles('Administrador', 'Operador')

function idDe(valor) {
  const id = Number(valor)
  if (!/^\d+$/.test(valor) || !Number.isSafeInteger(id) || id < 1) {
    throw new ErrorOperacion(400, 'El identificador no es válido.')
  }
  return id
}

function verificarOrigen(req, _res, next) {
  const origen = req.get('origin')
  if (origen && req.method !== 'GET' && req.method !== 'HEAD') {
    const host = req.get('host')
    if (![ `http://${host}`, `https://${host}` ].includes(origen)) {
      throw new ErrorOperacion(403, 'La solicitud debe venir de FloatMate.')
    }
  }
  next()
}

function crearApp(cliente, db) {
  const app = express()
  const api = express.Router()
  const sesiones = auth(db, DEMO_PASSWORD, COOKIE_SECURE === '1')
  const servicio = servicioOperacion(cliente, db)

  app.disable('x-powered-by')
  api.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next() })
  api.use(verificarOrigen, express.json({ limit: '600kb' }))
  api.get('/salud', async (_req, res) => {
    await db.command({ ping: 1 })
    res.json({ estado: 'ok', base: db.databaseName })
  })
  api.post('/sesion', sesiones.entrar)
  api.delete('/sesion', sesiones.salir)
  api.use(sesiones.verificar)
  api.get('/sesion', (req, res) => res.json({ cuenta: req.cuenta }))
  api.get('/operacion', async (req, res) => {
    const datos = await cliente.withSession(session => session.withTransaction(() => leerOperacion(db, session)))
    res.json(datosParaRol(datos, req.cuenta.rol))
  })

  for (const modulo of registros) {
    const permiso = catalogos.includes(modulo) ? administracion : operacion
    api.post(`/${modulo}`, permiso, async (req, res) => {
      res.status(201).json(await servicio.registrar(req.cuenta, modulo, req.body))
    })
    if (catalogos.includes(modulo)) {
      api.put(`/${modulo}/:id`, permiso, async (req, res) => {
        res.json(await servicio.registrar(req.cuenta, modulo, req.body, idDe(req.params.id)))
      })
    }
  }

  for (const accion of ['control', 'iniciar', 'cerrar']) {
    api.post(`/viajes/:id/${accion}`, operacion, async (req, res) => {
      res.json(await servicio.cambiarViaje(req.cuenta, idDe(req.params.id), accion, req.body))
    })
  }

  api.get('/incidentes/:id/evidencia', operacion, async (req, res) => {
    const incidente = await db.collection('incidentes').findOne({ id: idDe(req.params.id) })
    if (!incidente) throw new ErrorOperacion(404, 'La evidencia no existe.')
    const [cabecera, datos] = incidente.evidencia.split(',')
    const esPng = cabecera === 'data:image/png;base64'
    res.set('X-Content-Type-Options', 'nosniff')
    res.attachment(esPng ? 'evidencia.png' : 'evidencia.jpg').send(Buffer.from(datos, 'base64'))
  })

  api.use((_req, res) => res.status(404).json({ error: 'Ruta de API no encontrada.' }))
  app.use('/api', api)
  app.use(express.static(fileURLToPath(new URL('../../dist/', import.meta.url))))
  app.use((error, _req, res, _next) => {
    const status = error.status ?? 500
    if (status >= 500) console.error('Error de la API:', error.name)
    const mensaje = error instanceof ErrorOperacion ? error.message : {
      400: 'El cuerpo de la solicitud no es válido.',
      413: 'La solicitud es demasiado grande.',
    }[status] ?? 'El servidor no pudo completar la solicitud.'
    res.status(status).json({ error: mensaje })
  })
  return app
}

async function iniciar() {
  if (!MONGODB_URI || !DEMO_PASSWORD || DEMO_PASSWORD.length < 8) {
    throw new Error('Configura MONGODB_URI y DEMO_PASSWORD en backend/.env.')
  }

  const { cliente, db } = await conectar(MONGODB_URI, MONGODB_DB)
  try {
    await prepararBase(cliente, db)
    console.log(`MongoDB conectado. Base: ${db.databaseName}`)
    const servidor = crearApp(cliente, db).listen(Number(PORT), () => {
      console.log(`FloatMate disponible en http://localhost:${PORT}`)
    })
    servidor.on('error', async error => {
      console.error('No se pudo abrir el puerto:', error.code)
      await cliente.close()
      process.exitCode = 1
    })
    for (const señal of ['SIGINT', 'SIGTERM']) {
      process.once(señal, () => servidor.close(() => { void cliente.close() }))
    }
  } catch (error) {
    await cliente.close()
    throw error
  }
}

iniciar().catch(error => {
  const detalle = error.name === 'Error' ? error.message : (error.codeName ?? error.name)
  console.error('No se pudo iniciar FloatMate:', detalle)
  process.exitCode = 1
})
