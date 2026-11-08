import { useState } from 'react'
import { Dialogo } from './Interfaz.jsx'

const textos = {
  control: ['Registrar control de salida', 'Guardar control'],
  iniciar: ['Confirmar inicio del viaje', 'Iniciar viaje'],
  cerrar: ['Cerrar viaje', 'Confirmar cierre'],
}

export default function AccionViaje({ accion, viaje, control, procesar, cerrar }) {
  const [error, setError] = useState('')
  const [titulo, boton] = textos[accion]

  function enviar(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.currentTarget)
    if (accion === 'control') {
      const soporte = campos.get('soporte').trim()
      if (!soporte) {
        setError('Escribe un número de ticket o una referencia de evidencia.')
        return
      }
      const mensaje = procesar({ id: viaje.id, aprobado: campos.get('resultado') === 'aprobado', soporte })
      if (mensaje) setError(mensaje)
    } else {
      const mensaje = procesar()
      if (mensaje) setError(mensaje)
    }
  }

  return (
    <Dialogo titulo={titulo} seccion="DESPACHO" cerrar={cerrar} guardar={enviar} error={error} accion={boton}>
      <p>{viaje.ruta?.origin} → {viaje.ruta?.destination} · {viaje.bus?.plate}</p>
      {accion === 'control' ? (
        <>
          <label>Resultado del control de alcoholemia
            <select name="resultado" defaultValue={control?.aprobado === false ? 'rechazado' : 'aprobado'}>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </label>
          <label>Ticket o referencia de evidencia<input name="soporte" required maxLength={80} defaultValue={control?.soporte} /></label>
          <p className="hint">Usa únicamente referencias ficticias para esta demostración.</p>
        </>
      ) : (
        <label className="check-label">
          <input type="checkbox" required />
          {accion === 'iniciar' ? 'Confirmo el despacho de este viaje.' : 'Confirmo que el viaje terminó.'}
        </label>
      )}
    </Dialogo>
  )
}
