import { Encabezado, Tabla } from '../components/Interfaz.jsx'
import { formatearSalida } from '../lib/operacion.js'

export default function Auditoria({ movimientos }) {
  return (
    <section>
      <Encabezado seccion="ADMINISTRACIÓN" titulo="Auditoría" descripcion="Consulta las acciones registradas durante la demostración." />
      <article className="card">
        <Tabla nombre="Historial de acciones" columnas={['Fecha y hora', 'Usuario', 'Acción', 'Referencia']}>
          {movimientos.map(item => (
            <tr key={item.id}><td>{formatearSalida(item.fecha)}</td><td>{item.usuario}</td><td>{item.accion}</td><td>{item.referencia}</td></tr>
          ))}
          {!movimientos.length && <tr><td colSpan={4}>Todavía no hay acciones registradas.</td></tr>}
        </Tabla>
      </article>
    </section>
  )
}
