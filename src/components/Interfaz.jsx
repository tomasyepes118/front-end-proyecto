import { useEffect, useRef } from 'react'
import { estadosVehiculo, estadosViaje } from '../data/demo.js'

export function Encabezado({ seccion, titulo, descripcion, accion, alPulsar }) {
  return (
    <div className="heading">
      <div>
        <p className="eyebrow">FLOATMATE / {seccion}</p>
        <h1>{titulo}</h1>
        <p>{descripcion}</p>
      </div>
      {accion && <button className="primary" onClick={alPulsar}>+ {accion}</button>}
    </div>
  )
}

export function Estado({ valor }) {
  const colores = {
    MANTENIMIENTO: 'warn',
    EN_RUTA: 'move',
    EN_CURSO: 'move',
    PROGRAMADO: 'move',
    FUERA_SERVICIO: 'off',
    CANCELADO: 'off',
  }
  const etiqueta = estadosVehiculo[valor] ?? estadosViaje[valor]
  return <span className={`badge ${colores[valor] ?? ''}`}>{etiqueta}</span>
}

export function Opciones({ valores }) {
  return Object.entries(valores).map(([clave, nombre]) => (
    <option value={clave} key={clave}>{nombre}</option>
  ))
}

export function Filtros({ etiqueta, ejemplo, busqueda, cambiarBusqueda, estado, cambiarEstado, estados, cantidad }) {
  return (
    <div className="filters">
      <label>
        {etiqueta}
        <input type="search" placeholder={ejemplo} value={busqueda} onChange={e => cambiarBusqueda(e.target.value)} />
      </label>
      <label>
        Estado
        <select value={estado} onChange={e => cambiarEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <Opciones valores={estados} />
        </select>
      </label>
      <span aria-live="polite">{cantidad}</span>
    </div>
  )
}

export function Tabla({ nombre, columnas, children }) {
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={nombre}>
      <table aria-label={nombre}>
        <thead>
          <tr>{columnas.map(columna => <th key={columna} scope="col">{columna}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Dialogo({ titulo, seccion, cerrar, guardar, error, accion, children }) {
  const dialogo = useRef(null)

  useEffect(() => {
    const elemento = dialogo.current
    elemento.showModal()
    return () => elemento.close()
  }, [])

  return (
    <dialog ref={dialogo} aria-labelledby="titulo-dialogo" onCancel={e => { e.preventDefault(); cerrar() }}>
      <form onSubmit={guardar}>
        <div className="card-title">
          <div>
            <p className="eyebrow">{seccion}</p>
            <h2 id="titulo-dialogo">{titulo}</h2>
          </div>
          <button type="button" aria-label="Cerrar formulario" onClick={cerrar}>×</button>
        </div>
        {children}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="actions">
          <button type="button" onClick={cerrar}>Cancelar</button>
          <button className="primary" type="submit">{accion}</button>
        </div>
      </form>
    </dialog>
  )
}
