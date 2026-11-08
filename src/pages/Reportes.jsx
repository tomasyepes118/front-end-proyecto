import { Encabezado, Tabla } from '../components/Interfaz.jsx'
import { estadosViaje } from '../data/demo.js'

function exportarCsv(filas) {
  const csv = filas.map(fila => fila.map(celda => {
    let texto = String(celda)
    if (/^[\s]*[=+@-]/.test(texto)) texto = "'" + texto
    return '"' + texto.replaceAll('"', '""') + '"'
  }).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = 'floatmate-viajes.csv'
  enlace.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function Reportes({ viajes, acpm }) {
  const columnas = ['Ruta', 'Conductor', 'Vehículo', 'Salida', 'Pasajeros', 'Estado']
  const filas = viajes.map(viaje => [
    viaje.ruta?.destination ?? '', viaje.conductor?.name ?? '', viaje.bus?.plate ?? '',
    viaje.departure, viaje.passengers, estadosViaje[viaje.status],
  ])
  const costo = acpm.reduce((total, registro) => total + registro.litros * registro.precio, 0)

  return (
    <section>
      <Encabezado seccion="CONSULTA" titulo="Reportes" descripcion="Consulta el historial y descarga los datos de viajes." />
      <div className="metrics">
        <article className="metric"><span>Viajes registrados</span><strong>{viajes.length}</strong></article>
        <article className="metric"><span>Viajes finalizados</span><strong>{viajes.filter(viaje => viaje.status === 'FINALIZADO').length}</strong></article>
        <article className="metric"><span>Abastecimientos</span><strong>{acpm.length}</strong></article>
        <article className="metric"><span>Total de ACPM</span><strong>{costo.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</strong></article>
      </div>
      <article className="card">
        <div className="card-title"><h2>Historial de viajes</h2><button onClick={() => exportarCsv([columnas, ...filas])}>Descargar CSV</button></div>
        <Tabla nombre="Historial de viajes" columnas={columnas}>
          {filas.map((fila, i) => <tr key={viajes[i].id}>{fila.map((celda, j) => <td key={columnas[j]}>{celda}</td>)}</tr>)}
        </Tabla>
      </article>
    </section>
  )
}
