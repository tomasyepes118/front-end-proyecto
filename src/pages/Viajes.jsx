import { useState } from 'react'
import { Encabezado, Estado, Filtros, Tabla } from '../components/Interfaz.jsx'
import { estadosViaje } from '../data/demo.js'
import { formatearSalida } from '../lib/operacion.js'

function normalizar(texto) {
  return texto.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export default function Viajes({ viajes, abrirViaje }) {
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
        <Tabla nombre="Programación de viajes" columnas={['Ruta', 'Conductor', 'Vehículo', 'Salida', 'Pasajeros', 'Estado']}>
          {visibles.map(viaje => (
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
            </tr>
          ))}
          {!visibles.length && <tr><td colSpan={6}>No hay viajes que coincidan con la búsqueda.</td></tr>}
        </Tabla>
      </article>
    </section>
  )
}
