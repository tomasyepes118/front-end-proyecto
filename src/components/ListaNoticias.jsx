import { useEffect, useState } from "react"
import axios from "axios"

const URL_ARTICULOS = "https://api.spaceflightnewsapi.net/v4/articles/?limit=6"

function ListaNoticias({ seleccionado, onSeleccionar }) {
  const [articulos, setArticulos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controlador = new AbortController()
    const { signal } = controlador

    async function cargarArticulos() {
      try {
        const { data } = await axios.get(URL_ARTICULOS, { signal, timeout: 10000 })
        if (!signal.aborted) setArticulos(data.results)
      } catch {
        if (!signal.aborted) setError("No se pudieron cargar las noticias. Revisa tu conexión y recarga la página.")
      } finally {
        if (!signal.aborted) setCargando(false)
      }
    }

    cargarArticulos()
    return () => controlador.abort()
  }, [])

  return (
    <section aria-busy={cargando}>
      <h2>Artículos</h2>

      {error && <p className="aviso" role="alert">{error}</p>}
      {cargando && <p role="status">Cargando noticias...</p>}
      {!cargando && !error && articulos.length === 0 && <p>No hay noticias disponibles.</p>}

      <ul className="lista">
        {articulos.map((articulo) => {
          const activa = seleccionado?.id === articulo.id

          return (
            <li key={articulo.id}>
              <button
                type="button"
                className={activa ? "tarjeta activa" : "tarjeta"}
                aria-pressed={activa}
                onClick={() => onSeleccionar(articulo)}
              >
                {articulo.image_url && <img src={articulo.image_url} alt="" loading="lazy" />}
                <span className="medio">{articulo.news_site}</span>
                <strong>{articulo.title}</strong>
                <time className="fecha" dateTime={articulo.published_at}>
                  {formatearFecha(articulo.published_at)}
                </time>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default ListaNoticias
