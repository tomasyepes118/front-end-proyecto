import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { cuentasDemo } from '../../src/data/demo.js'
import { credenciales, ErrorOperacion, validar } from './validacion.js'

const nombreCookie = 'floatmate_sesion'
const duracion = 8 * 60 * 60 * 1000
const hash = valor => createHash('sha256').update(valor).digest()

export function auth(db, claveDemo, secure) {
  const sesiones = db.collection('sesiones')
  const cookie = { httpOnly: true, sameSite: 'lax', secure, path: '/' }
  const claveEsperada = hash(claveDemo)

  function token(req) {
    return (req.headers.cookie ?? '').match(/(?:^|;\s*)floatmate_sesion=([a-f0-9]{64})(?:;|$)/)?.[1]
  }

  return {
    async entrar(req, res) {
      const { usuario, clave } = validar(credenciales, req.body)
      const nombre = usuario.toLowerCase()
      if (!Object.hasOwn(cuentasDemo, nombre) || !timingSafeEqual(hash(clave), claveEsperada)) {
        throw new ErrorOperacion(401, 'Usuario o contraseña incorrectos.')
      }
      const anterior = token(req)
      if (anterior) await sesiones.deleteOne({ _id: hash(anterior).toString('hex') })
      const valor = randomBytes(32).toString('hex')
      await sesiones.insertOne({
        _id: hash(valor).toString('hex'), usuario: nombre, expira: new Date(Date.now() + duracion),
      })
      res.cookie(nombreCookie, valor, { ...cookie, maxAge: duracion })
      res.json({ cuenta: { usuario: nombre, ...cuentasDemo[nombre] } })
    },

    async verificar(req, _res, next) {
      const valor = token(req)
      const sesion = valor && await sesiones.findOne({ _id: hash(valor).toString('hex'), expira: { $gt: new Date() } })
      if (!sesion || !Object.hasOwn(cuentasDemo, sesion.usuario)) throw new ErrorOperacion(401, 'Inicia sesión para continuar.')
      req.cuenta = { usuario: sesion.usuario, ...cuentasDemo[sesion.usuario] }
      next()
    },

    async salir(req, res) {
      const valor = token(req)
      if (valor) await sesiones.deleteOne({ _id: hash(valor).toString('hex') })
      res.clearCookie(nombreCookie, cookie).sendStatus(204)
    },
  }
}

export function exigirRoles(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.cuenta.rol)) throw new ErrorOperacion(403, 'Tu rol no tiene permiso para realizar esta acción.')
    next()
  }
}
