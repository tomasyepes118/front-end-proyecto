import { useState } from 'react'
import { Dialogo, Encabezado, Tabla } from '../components/Interfaz.jsx'

const pesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 })

function leerImagen(archivo) {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader()
    lector.onload = () => resolver(lector.result)
    lector.onerror = rechazar
    lector.readAsDataURL(archivo)
  })
}

export default function Registros({ tipo, registros, vehiculos, guardar }) {
  const [abierto, setAbierto] = useState(false)
  const [error, setError] = useState('')
  const [leyendo, setLeyendo] = useState(false)
  const combustible = tipo === 'acpm'
  const titulo = combustible ? 'Abastecimientos de ACPM' : 'Incidentes'
  const accion = combustible ? 'Registrar abastecimiento' : 'Registrar incidente'
  const columnas = combustible
    ? ['Fecha', 'Vehículo', 'Litros', 'Precio por litro', 'Total']
    : ['Fecha', 'Vehículo', 'Descripción', 'Evidencia']

  async function enviar(evento) {
    evento.preventDefault()
    if (leyendo) return
    const datos = new FormData(evento.currentTarget)
    const registro = {
      id: Math.max(0, ...registros.map(item => item.id)) + 1,
      fecha: datos.get('fecha'),
      vehiculo: Number(datos.get('vehiculo')),
    }

    if (combustible) {
      registro.litros = Number(datos.get('litros'))
      registro.precio = Number(datos.get('precio'))
    } else {
      const descripcion = datos.get('descripcion').trim()
      const archivo = datos.get('evidencia')
      if (!descripcion || !archivo?.size || archivo.size > 400 * 1024 || !['image/png', 'image/jpeg'].includes(archivo.type)) {
        setError('Escribe la descripción y adjunta una imagen PNG o JPG de máximo 400 KB.')
        return
      }
      setLeyendo(true)
      try {
        registro.descripcion = descripcion
        registro.evidencia = await leerImagen(archivo)
        registro.archivo = archivo.name
      } catch {
        setError('No se pudo leer la imagen. Intenta de nuevo.')
        return
      } finally {
        setLeyendo(false)
      }
    }

    guardar(registro)
    setAbierto(false)
  }

  return (
    <section>
      <Encabezado seccion="OPERACIÓN" titulo={titulo} descripcion={combustible ? 'Registra el consumo y el costo de combustible por vehículo.' : 'Registra novedades de la flota con una imagen de demostración.'} accion={accion} alPulsar={() => { setAbierto(true); setError('') }} />
      <article className="card">
        <Tabla nombre={titulo} columnas={columnas}>
          {registros.map(item => (
            <tr key={item.id}>
              <td>{item.fecha}</td>
              <td>{vehiculos.find(bus => bus.id === item.vehiculo)?.plate ?? 'Sin placa'}</td>
              {combustible ? (
                <>
                  <td>{item.litros.toLocaleString('es-CO')}</td>
                  <td>{pesos.format(item.precio)}</td>
                  <td>{pesos.format(item.litros * item.precio)}</td>
                </>
              ) : (
                <>
                  <td className="detalle-registro">{item.descripcion}</td>
                  <td><a href={item.evidencia} download={item.archivo}>Descargar evidencia</a></td>
                </>
              )}
            </tr>
          ))}
          {!registros.length && <tr><td colSpan={columnas.length}>Todavía no hay registros.</td></tr>}
        </Tabla>
      </article>
      {abierto && (
        <Dialogo titulo={accion} seccion="REGISTRO DE OPERACIÓN" cerrar={() => { if (!leyendo) setAbierto(false) }} guardar={enviar} error={error} accion={leyendo ? 'Leyendo imagen…' : 'Guardar'}>
          <div className="form-grid">
            <label>Fecha<input name="fecha" type="date" required /></label>
            <label>Vehículo
              <select name="vehiculo" defaultValue="" required>
                <option value="">Selecciona un vehículo</option>
                {vehiculos.map(bus => <option value={bus.id} key={bus.id}>{bus.plate}</option>)}
              </select>
            </label>
            {combustible && (
              <>
                <label>Litros<input name="litros" type="number" min="0.01" max="500" step="0.01" required /></label>
                <label>Precio por litro (COP)<input name="precio" type="number" min="1" max="1000000" step="0.01" required /></label>
              </>
            )}
          </div>
          {!combustible && (
            <>
              <label>Descripción<textarea name="descripcion" maxLength={250} rows={3} required /></label>
              <label>Imagen de evidencia<input name="evidencia" type="file" accept="image/png,image/jpeg" required /></label>
              <p className="hint">Formato PNG o JPG, máximo 400 KB. Usa una imagen ficticia.</p>
            </>
          )}
        </Dialogo>
      )}
    </section>
  )
}
