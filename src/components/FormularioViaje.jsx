import { useState } from 'react'
import { conductores, rutas } from '../data/demo.js'
import { validarViaje } from '../lib/operacion.js'
import { Dialogo } from './Interfaz.jsx'

export default function FormularioViaje({ vehiculos, viajes, registrar, cerrar }) {
  const [rutaElegida, setRutaElegida] = useState('')
  const [error, setError] = useState('')
  const ruta = rutas.find(ruta => ruta.id === Number(rutaElegida))
  const disponibles = vehiculos.filter(bus => bus.status === 'DISPONIBLE')

  function enviar(evento) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const viaje = {
      id: Math.max(9000, ...viajes.map(viaje => viaje.id)) + 1,
      route: Number(rutaElegida),
      vehicle: Number(datos.get('vehiculo')),
      driver: Number(datos.get('conductor')),
      departure: datos.get('salida'),
      passengers: Number(datos.get('pasajeros')),
      observations: datos.get('observaciones').trim(),
      status: 'PROGRAMADO',
    }

    const mensaje = validarViaje(viaje, vehiculos, viajes)
    if (mensaje) setError(mensaje)
    else registrar(viaje)
  }

  return (
    <Dialogo titulo="Programar viaje" seccion="PROGRAMACIÓN DE SALIDAS" cerrar={cerrar} guardar={enviar} error={error} accion="Confirmar programación">
      <label>
        Ruta activa
        <select required value={rutaElegida} onChange={e => setRutaElegida(e.target.value)}>
          <option value="">Selecciona una ruta</option>
          {rutas.map(ruta => <option key={ruta.id} value={ruta.id}>{ruta.code} · {ruta.destination}</option>)}
        </select>
      </label>
      <p className="route-detail">
        {ruta ? `${ruta.origin} → ${ruta.destination} · ${ruta.km} km · ${ruta.minutes} minutos` : 'Selecciona una ruta para consultar su recorrido.'}
      </p>
      <div className="form-grid">
        <label>
          Vehículo disponible
          <select name="vehiculo" required>
            <option value="">{disponibles.length ? 'Selecciona un vehículo' : 'No hay vehículos disponibles'}</option>
            {disponibles.map(bus => <option key={bus.id} value={bus.id}>{bus.plate} · {bus.capacity} pasajeros</option>)}
          </select>
        </label>
        <label>
          Conductor disponible
          <select name="conductor" required>
            <option value="">Selecciona un conductor</option>
            {conductores.filter(conductor => conductor.status === 'DISPONIBLE').map(conductor => (
              <option key={conductor.id} value={conductor.id}>{conductor.name}</option>
            ))}
          </select>
        </label>
        <label>Fecha y hora de salida<input name="salida" type="datetime-local" required /></label>
        <label>Pasajeros<input name="pasajeros" type="number" min={0} required /></label>
      </div>
      <label>Observaciones<textarea name="observaciones" maxLength={250} rows={2} /></label>
      <p className="hint">Se verifica la disponibilidad, la capacidad del bus y el cruce de horarios.</p>
    </Dialogo>
  )
}
