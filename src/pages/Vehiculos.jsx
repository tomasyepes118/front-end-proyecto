import { useState } from 'react'
import { Encabezado, Estado, Filtros, Tabla } from '../components/Interfaz.jsx'
import { estadosVehiculo, tiposVehiculo } from '../data/demo.js'

export default function Vehiculos({ vehiculos, abrirVehiculo, editarVehiculo }) {
  const [busqueda, cambiarBusqueda] = useState('')
  const [estado, cambiarEstado] = useState('')
  const texto = busqueda.trim().toLowerCase()
  const visibles = vehiculos.filter(bus => (
    `${bus.plate} ${bus.brand}`.toLowerCase().includes(texto) && (!estado || bus.status === estado)
  ))

  return (
    <section>
      <Encabezado seccion="FLOTA" titulo="Vehículos" descripcion="Consulta el inventario y registra los buses de tu terminal." accion={abrirVehiculo && 'Registrar vehículo'} alPulsar={abrirVehiculo} />
      <article className="card">
        <Filtros etiqueta="Buscar por placa o marca" ejemplo="Ej. FTA101 o Chevrolet"
          busqueda={busqueda} cambiarBusqueda={cambiarBusqueda} estado={estado} cambiarEstado={cambiarEstado}
          estados={estadosVehiculo} cantidad={visibles.length === 1 ? '1 vehículo' : `${visibles.length} vehículos`} />
        <Tabla nombre="Inventario de vehículos" columnas={['Placa / código', 'Tipo y marca', 'Capacidad', 'Kilometraje', 'Estado', ...(editarVehiculo ? ['Acciones'] : [])]}>
          {visibles.map(bus => (
            <tr key={bus.id}>
              <td><strong>{bus.plate}</strong><small>{bus.code}</small></td>
              <td>{bus.brand} {bus.model}<small>{tiposVehiculo[bus.type]}</small></td>
              <td>{bus.capacity} pasajeros</td>
              <td>{bus.km.toLocaleString('es-CO')} km</td>
              <td><Estado valor={bus.status} /></td>
              {editarVehiculo && <td><button className="small-button" aria-label={`Editar ${bus.plate}`} onClick={() => editarVehiculo(bus)}>Editar</button></td>}
            </tr>
          ))}
          {!visibles.length && <tr><td colSpan={editarVehiculo ? 6 : 5}>No hay vehículos que coincidan con la búsqueda.</td></tr>}
        </Tabla>
      </article>
    </section>
  )
}
