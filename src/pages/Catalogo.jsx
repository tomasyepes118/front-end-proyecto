import { useState } from 'react'
import { Dialogo, Encabezado, Tabla } from '../components/Interfaz.jsx'

const catalogos = {
  conductores: {
    titulo: 'Conductores', singular: 'conductor', descripcion: 'Consulta y actualiza los conductores de la terminal.',
    columnas: ['Código', 'Nombre', 'Estado'],
    celdas: item => [item.code ?? `COND-${item.id}`, item.name, item.status === 'DISPONIBLE' ? 'Disponible' : 'Inactivo'],
  },
  rutas: {
    titulo: 'Rutas', singular: 'ruta', descripcion: 'Consulta el recorrido, la distancia y la duración estimada de cada ruta.',
    columnas: ['Código', 'Recorrido', 'Distancia', 'Duración', 'Estado'],
    celdas: item => [item.code, `${item.origin} → ${item.destination}`, `${item.km} km`, `${item.minutes} min`, item.activa ? 'Activa' : 'Inactiva'],
  },
}

export default function Catalogo({ tipo, lista, guardar }) {
  const { titulo, singular, descripcion, columnas, celdas } = catalogos[tipo]
  const [actual, setActual] = useState(null)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const visibles = lista.filter(item => celdas(item).join(' ').toLowerCase().includes(busqueda.trim().toLowerCase()))
  const esRuta = tipo === 'rutas'

  function editar(item) {
    setActual(item)
    setError('')
  }

  function enviar(evento) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const codigo = datos.get('codigo').trim().toUpperCase()
    if (!codigo || lista.some(item => (item.code ?? `COND-${item.id}`) === codigo && item.id !== actual.id)) {
      setError('Escribe un código que no esté en uso.')
      return
    }

    const registro = {
      id: actual.id ?? Math.max(1000, ...lista.map(item => item.id)) + 1,
      code: codigo,
    }

    if (esRuta) {
      const origen = datos.get('origen').trim()
      const destino = datos.get('destino').trim()
      if (!origen || !destino || origen.toLowerCase() === destino.toLowerCase()) {
        setError('Escribe un origen y un destino diferentes.')
        return
      }
      Object.assign(registro, {
        origin: origen, destination: destino, km: Number(datos.get('km')),
        minutes: Number(datos.get('minutos')), activa: datos.get('estado') === 'activo',
      })
    } else {
      registro.name = datos.get('nombre').trim()
      if (!registro.name) {
        setError('Escribe el nombre del conductor.')
        return
      }
      registro.status = datos.get('estado') === 'activo' ? 'DISPONIBLE' : 'INACTIVO'
    }

    guardar(registro)
    setActual(null)
  }

  return (
    <section>
      <Encabezado seccion="CATÁLOGOS" titulo={titulo} descripcion={descripcion} accion={guardar && `Registrar ${singular}`} alPulsar={() => editar({})} />
      <article className="card">
        <label>Buscar en {titulo.toLowerCase()}<input type="search" value={busqueda} onChange={e => setBusqueda(e.target.value)} /></label>
        <Tabla nombre={titulo} columnas={guardar ? [...columnas, 'Acciones'] : columnas}>
          {visibles.map(item => (
            <tr key={item.id}>
              {celdas(item).map((valor, i) => <td key={columnas[i]}>{valor}</td>)}
              {guardar && <td><button className="small-button" aria-label={`Editar ${celdas(item)[0]}`} onClick={() => editar(item)}>Editar</button></td>}
            </tr>
          ))}
          {!visibles.length && <tr><td colSpan={columnas.length + Number(Boolean(guardar))}>No hay resultados.</td></tr>}
        </Tabla>
      </article>
      {actual && (
        <Dialogo titulo={`${actual.id ? 'Editar' : 'Registrar'} ${singular}`} seccion="CATÁLOGOS" cerrar={() => setActual(null)} guardar={enviar} error={error} accion="Guardar">
          <div className="form-grid">
            <label>Código<input name="codigo" maxLength={20} required defaultValue={actual.code ?? (actual.id ? `COND-${actual.id}` : '')} /></label>
            {esRuta ? (
              <>
                <label>Origen<input name="origen" maxLength={60} required defaultValue={actual.origin} /></label>
                <label>Destino<input name="destino" maxLength={60} required defaultValue={actual.destination} /></label>
                <label>Distancia (km)<input name="km" type="number" min="0.01" step="0.01" required defaultValue={actual.km} /></label>
                <label>Duración (min)<input name="minutos" type="number" min="1" max="1440" required defaultValue={actual.minutes} /></label>
              </>
            ) : <label>Nombre<input name="nombre" maxLength={70} required defaultValue={actual.name} /></label>}
            <label>Estado
              <select name="estado" defaultValue={actual.activa === false || actual.status === 'INACTIVO' ? 'inactivo' : 'activo'}>
                <option value="activo">{esRuta ? 'Activa' : 'Disponible'}</option>
                <option value="inactivo">{esRuta ? 'Inactiva' : 'Inactivo'}</option>
              </select>
            </label>
          </div>
        </Dialogo>
      )}
    </section>
  )
}
