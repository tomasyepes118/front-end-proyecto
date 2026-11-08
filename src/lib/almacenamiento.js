export function leerLista(clave, datosIniciales) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave))
    if (Array.isArray(datos)) return datos
  } catch {
    // Si el navegador bloquea el almacenamiento, se usan los datos de ejemplo.
  }
  return datosIniciales()
}

export function guardarLista(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos))
    return true
  } catch {
    return false
  }
}

const claveSesion = 'floatmate-ppi-sesion'

export function leerSesion() {
  try {
    return sessionStorage.getItem(claveSesion) === 'activa'
  } catch {
    return false
  }
}

export function guardarSesion(activa) {
  try {
    if (activa) sessionStorage.setItem(claveSesion, 'activa')
    else sessionStorage.removeItem(claveSesion)
  } catch {
    // El acceso de demostración funciona en memoria durante la visita.
  }
}
