import { conductoresIniciales, crearViajesIniciales, cuentasDemo, rutasIniciales, vehiculosIniciales } from '../data/demo.js'

const claveDatos = 'floatmate-ppi-operacion'
const claveSesion = 'floatmate-ppi-sesion'

function leerDatosGuardados(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave))
  } catch {
    return null
  }
}

export function leerOperacion() {
  const guardados = leerDatosGuardados(claveDatos)
  const vehiculosAnteriores = leerDatosGuardados('floatmate-ppi-vehiculos')
  const viajesAnteriores = leerDatosGuardados('floatmate-ppi-viajes')

  return {
    vehiculos: guardados?.vehiculos ?? (Array.isArray(vehiculosAnteriores) ? vehiculosAnteriores : vehiculosIniciales),
    viajes: guardados?.viajes ?? (Array.isArray(viajesAnteriores) ? viajesAnteriores : crearViajesIniciales()),
    conductores: guardados?.conductores ?? conductoresIniciales,
    rutas: guardados?.rutas ?? rutasIniciales,
    controles: guardados?.controles ?? [],
    acpm: guardados?.acpm ?? [],
    incidentes: guardados?.incidentes ?? [],
    auditoria: guardados?.auditoria ?? [],
  }
}

export function guardarOperacion(datos) {
  try {
    localStorage.setItem(claveDatos, JSON.stringify(datos))
    return true
  } catch {
    return false
  }
}

export function leerSesion() {
  try {
    const usuario = sessionStorage.getItem(claveSesion)
    if (usuario === 'activa') return 'admin'
    return Object.hasOwn(cuentasDemo, usuario) ? usuario : ''
  } catch {
    return ''
  }
}

export function guardarSesion(usuario) {
  try {
    if (usuario) sessionStorage.setItem(claveSesion, usuario)
    else sessionStorage.removeItem(claveSesion)
  } catch {
    // El acceso de demostración funciona en memoria durante la visita.
  }
}
