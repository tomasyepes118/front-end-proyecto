export function obtenerDetalleViajes(viajes, vehiculos, conductores, rutas) {
  return viajes.map(viaje => ({
    ...viaje,
    ruta: rutas.find(ruta => ruta.id === viaje.route),
    conductor: conductores.find(conductor => conductor.id === viaje.driver),
    bus: vehiculos.find(vehiculo => vehiculo.id === viaje.vehicle),
  })).sort((a, b) => a.departure.localeCompare(b.departure))
}

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
})

export function formatearSalida(fecha) {
  return formatoFecha.format(new Date(fecha))
}

export function validarViaje(viaje, vehiculos, viajes, conductores, rutas) {
  const bus = vehiculos.find(vehiculo => vehiculo.id === viaje.vehicle)
  const conductor = conductores.find(conductor => conductor.id === viaje.driver)
  const ruta = rutas.find(ruta => ruta.id === viaje.route)
  if (!ruta?.activa || bus?.status !== 'DISPONIBLE' || conductor?.status !== 'DISPONIBLE') {
    return 'Selecciona una ruta, un vehículo y un conductor disponibles.'
  }

  const inicio = new Date(viaje.departure).getTime()
  if (!Number.isFinite(inicio) || inicio <= Date.now()) {
    return 'Selecciona una fecha y hora futuras.'
  }
  if (viaje.passengers > bus.capacity) {
    return 'Los pasajeros superan la capacidad del vehículo.'
  }

  const fin = inicio + ruta.minutes * 60000
  const hayCruce = viajes.some(otro => {
    if (otro.status !== 'PROGRAMADO' && otro.status !== 'EN_CURSO') return false
    if (otro.vehicle !== viaje.vehicle && otro.driver !== viaje.driver) return false

    const otroInicio = new Date(otro.departure).getTime()
    const otraRuta = rutas.find(ruta => ruta.id === otro.route)
    const otroFin = otroInicio + (otraRuta?.minutes ?? 0) * 60000
    return inicio < otroFin && otroInicio < fin
  })
  if (hayCruce) return 'El vehículo o el conductor ya tienen un viaje durante ese horario.'
  return ''
}

export function cambiarRegistro(lista, registro) {
  if (lista.some(item => item.id === registro.id)) {
    return lista.map(item => item.id === registro.id ? registro : item)
  }
  return [...lista, registro]
}

export function validarDespacho(viaje, operacion) {
  if (viaje.status !== 'PROGRAMADO') return 'El viaje ya cambió de estado.'
  const control = operacion.controles.find(control => control.id === viaje.id)
  if (!control?.aprobado || !control.soporte) return 'Primero registra un control aprobado con ticket o referencia de evidencia.'
  const bus = operacion.vehiculos.find(bus => bus.id === viaje.vehicle)
  const conductor = operacion.conductores.find(conductor => conductor.id === viaje.driver)
  const ruta = operacion.rutas.find(ruta => ruta.id === viaje.route)
  if (bus?.status !== 'DISPONIBLE' || conductor?.status !== 'DISPONIBLE' || !ruta?.activa) {
    return 'El vehículo, el conductor y la ruta deben estar disponibles para despachar.'
  }
  if (viaje.passengers > bus.capacity) return 'Los pasajeros superan la capacidad actual del vehículo.'
  const enUso = operacion.viajes.some(otro => (
    otro.status === 'EN_CURSO' && (otro.vehicle === viaje.vehicle || otro.driver === viaje.driver)
  ))
  if (enUso) return 'El vehículo o el conductor ya están en un viaje en curso.'
  return ''
}
