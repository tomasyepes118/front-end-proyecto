import { MongoClient } from 'mongodb'
import { conductoresIniciales, crearViajesIniciales, rutasIniciales, vehiculosIniciales } from '../../src/data/demo.js'

export const modulos = ['vehiculos', 'conductores', 'rutas', 'viajes', 'controles', 'acpm', 'incidentes', 'auditoria']

export async function conectar(uri, nombre) {
  const cliente = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 })
  await cliente.connect()
  return { cliente, db: cliente.db(nombre) }
}

export async function leerOperacion(db, session) {
  const datos = {}
  for (const modulo of modulos) {
    const projection = modulo === 'incidentes' ? { _id: 0, evidencia: 0 } : { _id: 0 }
    const orden = modulo === 'auditoria' ? -1 : 1
    datos[modulo] = await db.collection(modulo).find({}, { projection, session }).sort({ id: orden }).toArray()
  }
  return datos
}

export function transaccionOperacion(cliente, db, cambiar) {
  return cliente.withSession(session => session.withTransaction(async () => {
    // Un cambio de versión coordina las escrituras que comparten reglas de negocio.
    await db.collection('configuracion').updateOne({ _id: 'operacion' }, { $inc: { revision: 1 } }, { session })
    return cambiar(session)
  }))
}

export async function prepararBase(cliente, db) {
  for (const modulo of modulos) {
    await db.collection(modulo).createIndex({ id: 1 }, { unique: true })
  }
  await db.collection('sesiones').createIndex({ expira: 1 }, { expireAfterSeconds: 0 })
  await db.collection('configuracion').updateOne(
    { _id: 'operacion' }, { $setOnInsert: { revision: 0, inicializado: false } }, { upsert: true },
  )

  await transaccionOperacion(cliente, db, async session => {
    const configuracion = db.collection('configuracion')
    const meta = await configuracion.findOne({ _id: 'operacion' }, { session })
    if (meta.inicializado) return

    const ejemplos = {
      vehiculos: vehiculosIniciales,
      conductores: conductoresIniciales.map(persona => ({ ...persona, code: `COND-${persona.id}` })),
      rutas: rutasIniciales,
      viajes: crearViajesIniciales(),
    }
    for (const [modulo, filas] of Object.entries(ejemplos)) {
      await db.collection(modulo).insertMany(filas.map(fila => ({ ...fila, version: 1 })), { session })
    }
    await configuracion.updateOne({ _id: 'operacion' }, { $set: { inicializado: true } }, { session })
  })
}
