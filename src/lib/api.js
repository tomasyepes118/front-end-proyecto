export async function consultarApi(ruta, { metodo = 'GET', datos } = {}) {
  const opciones = { method: metodo, credentials: 'same-origin' }
  if (datos !== undefined) {
    opciones.headers = { 'Content-Type': 'application/json' }
    opciones.body = JSON.stringify(datos)
  }
  const respuesta = await fetch(`/api${ruta}`, opciones)
  if (respuesta.status === 204) return null
  const cuerpo = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const error = new Error(cuerpo.error ?? 'No se pudo conectar con FloatMate.')
    error.status = respuesta.status
    throw error
  }
  return cuerpo
}
