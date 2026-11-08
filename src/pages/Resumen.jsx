import { useState } from 'react'
import { Encabezado, Estado, Tabla } from '../components/Interfaz.jsx'
import { estadosVehiculo } from '../data/demo.js'
import { formatearSalida, instanteSalida } from '../lib/operacion.js'

export default function Resumen({ vehiculos, viajes, abrirViaje }) {
  const [horaDeConsulta] = useState(Date.now)
  const proximos = viajes.filter(viaje => viaje.status === 'PROGRAMADO' && instanteSalida(viaje.departure) > horaDeConsulta)
  const disponibilidad = Object.entries(estadosVehiculo).map(([estado, nombre]) => ({
    estado,
    nombre,
    cantidad: vehiculos.filter(bus => bus.status === estado).length,
  }))
  const disponibles = disponibilidad.find(fila => fila.estado === 'DISPONIBLE').cantidad
  const mantenimiento = disponibilidad.find(fila => fila.estado === 'MANTENIMIENTO').cantidad
  const indicadores = [
    ['Vehículos registrados', vehiculos.length, 'Inventario de la terminal'],
    ['Disponibles', disponibles, 'Listos para asignar'],
    ['Viajes programados', proximos.length, 'Salidas por realizar'],
    ['En mantenimiento', mantenimiento, 'Atención de la flota'],
  ]

  return (
    <section>
      <Encabezado seccion="RESUMEN" titulo="La operación, de un vistazo" descripcion="Disponibilidad de la flota y programación de la terminal." accion={abrirViaje && 'Programar viaje'} alPulsar={abrirViaje} />
      <div className="metrics">
        {indicadores.map(([titulo, valor, detalle]) => (
          <article className="metric" key={titulo}>
            <span>{titulo}</span><strong>{valor}</strong><small>{detalle}</small>
          </article>
        ))}
      </div>
      <div className="grid">
        <article className="card">
          <div className="card-title"><h2>Próximos viajes</h2>{abrirViaje && <a href="#viajes">Ver programación →</a>}</div>
          <Tabla nombre="Próximos viajes" columnas={['Ruta', 'Salida', 'Bus', 'Estado']}>
            {proximos.slice(0, 4).map(viaje => (
              <tr key={viaje.id}>
                <td><strong>{viaje.ruta?.destination ?? 'Sin ruta'}</strong><small>{viaje.conductor?.name}</small></td>
                <td>{formatearSalida(viaje.departure)}</td>
                <td>{viaje.bus?.plate ?? 'Sin placa'}</td>
                <td><Estado valor={viaje.status} /></td>
              </tr>
            ))}
            {!proximos.length && <tr><td colSpan={4}>No hay viajes programados.</td></tr>}
          </Tabla>
        </article>
        <article className="card">
          <h2>Disponibilidad de la flota</h2>
          {disponibilidad.map(({ nombre, cantidad }) => (
            <div className="state" key={nombre}>
              <div><span>{nombre}</span><strong>{cantidad}</strong></div>
              <div className="bar" aria-hidden="true"><span style={{ width: `${vehiculos.length ? cantidad / vehiculos.length * 100 : 0}%` }} /></div>
            </div>
          ))}
          <div className="tip">
            <strong>Antes de iniciar un viaje</strong>
            <p>Verifica la disponibilidad del bus, del conductor y el control de salida aprobado.</p>
          </div>
        </article>
      </div>
    </section>
  )
}
