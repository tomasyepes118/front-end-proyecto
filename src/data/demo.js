// Datos de ejemplo del prototipo HTML de FloatMate.
export const estadosVehiculo = {
  DISPONIBLE: 'Disponible',
  EN_RUTA: 'En ruta',
  MANTENIMIENTO: 'Mantenimiento',
  FUERA_SERVICIO: 'Fuera de servicio',
}

export const estadosViaje = {
  PROGRAMADO: 'Programado',
  EN_CURSO: 'En curso',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
}

export const tiposVehiculo = {
  BUS_URBANO: 'Bus urbano',
  BUS_INTERMUNICIPAL: 'Bus intermunicipal',
  MICROBUS: 'Microbús',
}

export const vehiculosIniciales = [
  { id: 1001, plate: 'FTA101', code: 'BUS-NOR-001', type: 'BUS_URBANO', brand: 'Chevrolet', model: 2013, capacity: 26, km: 46750, maintenance: 51750, status: 'DISPONIBLE' },
  { id: 1002, plate: 'FTB102', code: 'BUS-NOR-002', type: 'BUS_INTERMUNICIPAL', brand: 'Mercedes-Benz', model: 2014, capacity: 28, km: 48500, maintenance: 53500, status: 'DISPONIBLE' },
  { id: 1003, plate: 'FTC103', code: 'BUS-NOR-003', type: 'MICROBUS', brand: 'Hino', model: 2015, capacity: 30, km: 50250, maintenance: 55250, status: 'DISPONIBLE' },
  { id: 1014, plate: 'FTN114', code: 'BUS-NOR-014', type: 'BUS_INTERMUNICIPAL', brand: 'Volkswagen', model: 2026, capacity: 52, km: 69500, maintenance: 74500, status: 'MANTENIMIENTO' },
]

export const conductores = [
  { id: 1001, name: 'Andrés Ríos', status: 'DISPONIBLE' },
  { id: 1002, name: 'Beatriz Suárez', status: 'DISPONIBLE' },
  { id: 1003, name: 'Carlos Torres', status: 'DISPONIBLE' },
]

export const rutas = [
  { id: 1001, code: 'R-NOR-001', origin: 'Terminal Norte', destination: 'Bello', km: 10.85, minutes: 35 },
  { id: 1002, code: 'R-NOR-002', origin: 'Terminal Norte', destination: 'Copacabana', km: 13.2, minutes: 40 },
  { id: 1003, code: 'R-NOR-003', origin: 'Terminal Norte', destination: 'Girardota', km: 15.55, minutes: 45 },
]

export function crearViajesIniciales() {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 1)
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  const manana = `${fecha.getFullYear()}-${mes}-${dia}`

  return [
    { id: 9001, vehicle: 1001, driver: 1001, route: 1001, departure: manana + 'T07:30', passengers: 13, status: 'PROGRAMADO' },
    { id: 9002, vehicle: 1002, driver: 1002, route: 1002, departure: manana + 'T09:00', passengers: 20, status: 'PROGRAMADO' },
    { id: 1001, vehicle: 1001, driver: 1001, route: 1001, departure: '2026-09-01T05:00', passengers: 13, status: 'FINALIZADO' },
  ]
}
