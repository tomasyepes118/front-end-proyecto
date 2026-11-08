import { validarDespacho, validarViaje } from '../../src/lib/operacion.js'
import { leerOperacion, transaccionOperacion } from './db.js'
import { comprobarImagen, ErrorOperacion, esquemas, validar } from './validacion.js'

export const catalogos = ['vehiculos', 'conductores', 'rutas']
export const registros = [...catalogos, 'viajes', 'acpm', 'incidentes']

const acciones = {
  vehiculos: 'Registró vehículo', conductores: 'Registró conductor', rutas: 'Registró ruta',
  viajes: 'Programó viaje', acpm: 'Registró abastecimiento', incidentes: 'Registró incidente',
}
const ediciones = { vehiculos: 'Editó vehículo', conductores: 'Editó conductor', rutas: 'Editó ruta' }

function siguienteId(filas, base = 0) {
  return filas.reduce((maximo, fila) => Math.max(maximo, fila.id), base) + 1
}

function validarRegistro(modulo, registro, datos) {
  if (catalogos.includes(modulo)) {
    const repetido = datos[modulo].some(fila => fila.id !== registro.id &&
      (fila.code === registro.code || (modulo === 'vehiculos' && fila.plate === registro.plate)))
    if (repetido) throw new ErrorOperacion(409, 'La placa o el código interno ya están registrados.')
  }
  if (modulo === 'vehiculos' && registro.maintenance < registro.km) {
    throw new ErrorOperacion(400, 'El próximo mantenimiento debe ser igual o mayor al kilometraje actual.')
  }
  if (modulo === 'rutas' && registro.origin.toLowerCase() === registro.destination.toLowerCase()) {
    throw new ErrorOperacion(400, 'Escribe un origen y un destino diferentes.')
  }
  if (modulo === 'viajes') {
    const error = validarViaje(registro, datos.vehiculos, datos.viajes, datos.conductores, datos.rutas)
    if (error) throw new ErrorOperacion(409, error)
  }
  if (['acpm', 'incidentes'].includes(modulo) && !datos.vehiculos.some(bus => bus.id === registro.vehiculo)) {
    throw new ErrorOperacion(400, 'Selecciona un vehículo registrado.')
  }
  if (modulo === 'incidentes') comprobarImagen(registro.evidencia)
}

export function datosParaRol(datos, rol) {
  if (rol !== 'Administrador') datos.auditoria = []
  if (rol === 'Consulta') {
    datos.controles = []
    datos.incidentes = []
    datos.acpm = datos.acpm.map(({ litros, precio }) => ({ litros, precio }))
    datos.vehiculos = datos.vehiculos.map(({ id, plate, status }) => ({ id, plate, status }))
    datos.conductores = datos.conductores.map(({ id, name }) => ({ id, name }))
    datos.rutas = datos.rutas.map(({ id, origin, destination }) => ({ id, origin, destination }))
    datos.viajes = datos.viajes.map(({ id, route, vehicle, driver, departure, passengers, status }) =>
      ({ id, route, vehicle, driver, departure, passengers, status }))
  }
  return datos
}

export function servicioOperacion(cliente, db) {
  function guardarConAuditoria(cuenta, modificar) {
    return transaccionOperacion(cliente, db, async session => {
      const datos = await leerOperacion(db, session)
      const { modulo, registro, accion, referencia } = modificar(datos)
      await db.collection(modulo).replaceOne({ id: registro.id }, registro, { upsert: true, session })
      await db.collection('auditoria').insertOne({
        id: siguienteId(datos.auditoria),
        fecha: new Date().toISOString(),
        usuario: cuenta.usuario,
        accion,
        referencia,
      }, { session })
      return datosParaRol(await leerOperacion(db, session), cuenta.rol)
    })
  }

  return {
    registrar(cuenta, modulo, entrada, id) {
      const { version, ...campos } = validar(esquemas[modulo], entrada)
      return guardarConAuditoria(cuenta, datos => {
        const actual = id ? datos[modulo].find(fila => fila.id === id) : null
        if (id && !actual) throw new ErrorOperacion(404, 'El registro no existe.')
        if (actual && version !== actual.version) {
          throw new ErrorOperacion(409, 'El registro cambió. Actualiza la página antes de editarlo.')
        }
        const base = modulo === 'viajes' ? 9000 : catalogos.includes(modulo) ? 1000 : 0
        const registro = {
          ...campos,
          id: id ?? siguienteId(datos[modulo], base),
          version: (actual?.version ?? 0) + 1,
        }
        if (modulo === 'viajes') registro.status = 'PROGRAMADO'
        validarRegistro(modulo, registro, datos)
        const referencia = registro.plate ?? registro.code ??
          (modulo === 'viajes' ? `Viaje ${registro.id}` : datos.vehiculos.find(bus => bus.id === registro.vehiculo).plate)
        return { modulo, registro, accion: actual ? ediciones[modulo] : acciones[modulo], referencia }
      })
    },

    cambiarViaje(cuenta, id, accion, entrada) {
      const control = accion === 'control' ? validar(esquemas.control, entrada) : null
      return guardarConAuditoria(cuenta, datos => {
        const viaje = datos.viajes.find(fila => fila.id === id)
        if (!viaje) throw new ErrorOperacion(404, 'El viaje no existe.')
        const referencia = `Viaje ${id}`
        const fecha = new Date().toISOString()
        if (control) {
          if (viaje.status !== 'PROGRAMADO') throw new ErrorOperacion(409, 'El viaje ya cambió de estado.')
          return {
            modulo: 'controles',
            registro: { id, ...control, usuario: cuenta.usuario, fecha },
            accion: 'Registró control de salida',
            referencia,
          }
        }
        if (accion === 'iniciar') {
          const error = validarDespacho(viaje, datos)
          if (error) throw new ErrorOperacion(409, error)
          return {
            modulo: 'viajes',
            registro: { ...viaje, status: 'EN_CURSO', inicio: fecha, operador: cuenta.usuario, version: viaje.version + 1 },
            accion: 'Inició viaje',
            referencia,
          }
        }
        if (viaje.status !== 'EN_CURSO') throw new ErrorOperacion(409, 'El viaje debe estar en curso para poder cerrarlo.')
        return {
          modulo: 'viajes',
          registro: { ...viaje, status: 'FINALIZADO', cierre: fecha, version: viaje.version + 1 },
          accion: 'Cerró viaje',
          referencia,
        }
      })
    },
  }
}
