import { useState } from 'react'
import { Encabezado, Estado, Filtros, Tabla } from '../components/Interfaz.jsx'
import { estadosViaje } from '../data/demo.js'
import { formatearSalida } from '../lib/operacion.js'

function normalizar(texto) {
  return texto.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export default function Viajes({ viajes, controles, abrirViaje, abrirAccion }) {
  const [busqueda, cambiarBusqueda] = useState('')
  const [estado, cambiarEstado] = useState('')
  const texto = normalizar(busqueda)
  const visibles = viajes.filter(viaje => {
    const datos = normalizar([viaje.ruta?.origin, viaje.ruta?.destination, viaje.conductor?.name, viaje.bus?.plate].join(' '))
    return datos.includes(texto) && (!estado || viaje.status === estado)
  })

  return (
    <section>
      <Encabezado seccion="PROGRAMACIÓN" titulo="Viajes" descripcion="Asigna una ruta, un vehículo y un conductor para cada salida." accion="Programar viaje" alPulsar={abrirViaje} />
      <article className="card">
        <Filtros etiqueta="Buscar ruta, conductor o placa" ejemplo="Ej. Bello o FTA101"
          busqueda={busqueda} cambiarBusqueda={cambiarBusqueda} estado={estado} cambiarEstado={cambiarEstado}
          estados={estadosViaje} cantidad={visibles.length === 1 ? '1 viaje' : `${visibles.length} viajes`} />
        <Tabla nombre="Programación de viajes" columnas={['Ruta', 'Conductor', 'Vehículo', 'Salida', 'Pasajeros', 'Estado', 'Control de salida', 'Acciones']}>
          {visibles.map(viaje => {
            const control = controles.find(control => control.id === viaje.id)
            return (
              <tr key={viaje.id}>
                <td>
                  <strong>{viaje.ruta ? `${viaje.ruta.origin} → ${viaje.ruta.destination}` : 'Sin ruta'}</strong>
                  <small>{viaje.ruta?.code}</small>
                </td>
                <td>{viaje.conductor?.name ?? 'Sin conductor'}</td>
                <td>{viaje.bus?.plate ?? 'Sin placa'}</td>
                <td>{formatearSalida(viaje.departure)}</td>
                <td>{viaje.passengers}</td>
                <td><Estado valor={viaje.status} /></td>
                <td>{control ? (control.aprobado ? 'Aprobado' : 'Rechazado') : 'Sin control'}</td>
                <td>
                  {viaje.status === 'PROGRAMADO' && (
                    <div className="row-actions">
                      <button className="small-button" onClick={() => abrirAccion('control', viaje)}>Control</button>
                      <button className="small-button" onClick={() => abrirAccion('iniciar', viaje)}>Iniciar</button>
                    </div>
                  )}
                  {viaje.status === 'EN_CURSO' && <button className="small-button" onClick={() => abrirAccion('cerrar', viaje)}>Cerrar</button>}
                </td>
              </tr>
            )
          })}
          {!visibles.length && <tr><td colSpan={8}>No hay viajes que coincidan con la búsqueda.</td></tr>}
        </Tabla>
      </article>
    </section>
  )
}
