import { z } from 'zod'
import { estadosVehiculo, tiposVehiculo } from '../../src/data/demo.js'

const texto = maximo => z.string().trim().min(1).max(maximo)
const codigo = maximo => texto(maximo).transform(valor => valor.toUpperCase())
const entero = (minimo, maximo) => z.number().int().min(minimo).max(maximo)
const identificador = entero(1, Number.MAX_SAFE_INTEGER)
const fecha = z.iso.date()
const camposEdicion = { version: identificador.optional() }

export const esquemas = {
  vehiculos: z.object({
    ...camposEdicion, plate: codigo(6).pipe(z.string().regex(/^[A-Z]{3}\d{3}$/)),
    code: codigo(15), type: z.enum(Object.keys(tiposVehiculo)), brand: texto(40),
    model: entero(2000, 2035), capacity: entero(10, 80), km: z.number().nonnegative(),
    maintenance: z.number().nonnegative(), status: z.enum(Object.keys(estadosVehiculo)),
  }),
  conductores: z.object({
    ...camposEdicion, code: codigo(20), name: texto(70), status: z.enum(['DISPONIBLE', 'INACTIVO']),
  }),
  rutas: z.object({
    ...camposEdicion, code: codigo(20), origin: texto(60), destination: texto(60),
    km: z.number().positive(), minutes: entero(1, 1440), activa: z.boolean(),
  }),
  viajes: z.object({
    route: identificador, vehicle: identificador, driver: identificador,
    departure: z.iso.datetime({ local: true, precision: -1 }).refine(valor => valor.length === 16),
    passengers: entero(0, 80), observations: z.string().trim().max(250).default(''),
  }),
  acpm: z.object({
    fecha, vehiculo: identificador, litros: z.number().positive().max(500),
    precio: z.number().min(1).max(1_000_000),
  }),
  incidentes: z.object({
    fecha, vehiculo: identificador, descripcion: texto(250), archivo: texto(120),
    evidencia: z.string().max(546_200).regex(/^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/),
  }),
  control: z.object({ aprobado: z.boolean(), soporte: texto(80) }),
}

export const credenciales = z.object({ usuario: texto(40), clave: texto(128) })

export class ErrorOperacion extends Error {
  constructor(status, mensaje) {
    super(mensaje)
    this.status = status
  }
}

export function validar(esquema, datos) {
  const resultado = esquema.safeParse(datos)
  if (!resultado.success) {
    const campo = resultado.error.issues[0].path.join('.')
    throw new ErrorOperacion(400, campo ? `Dato inválido: ${campo}.` : 'Los datos enviados no son válidos.')
  }
  return resultado.data
}

export function comprobarImagen(evidencia) {
  const [cabecera, base64] = evidencia.split(',')
  const bytes = Buffer.from(base64, 'base64')
  const png = cabecera === 'data:image/png;base64'
  const firma = png ? '89504e470d0a1a0a' : 'ffd8ff'
  if (bytes.length > 400 * 1024 || !bytes.toString('hex', 0, firma.length / 2).startsWith(firma)) {
    throw new ErrorOperacion(400, 'Adjunta un archivo PNG o JPG válido de máximo 400 KB.')
  }
}
