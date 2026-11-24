import { useState } from "react"
import { GoogleGenAI } from "@google/genai"

function PreguntaGemini({ seleccionado }) {
  const [pregunta, setPregunta] = useState("Explícame esta noticia en palabras sencillas")

  return (
    <aside className="panel">
      <h2>Pregunta a Gemini</h2>

      {seleccionado ? (
        <>
          <h3>{seleccionado.title}</h3>
          <p>{seleccionado.summary}</p>
          <a href={seleccionado.url} target="_blank" rel="noreferrer">
            Leer la noticia completa
          </a>
        </>
      ) : (
        <p>Selecciona un artículo de la lista.</p>
      )}
      <FormularioGemini
        key={seleccionado?.id}
        seleccionado={seleccionado}
        pregunta={pregunta}
        setPregunta={setPregunta}
      />
    </aside>
  )
}

function FormularioGemini({ seleccionado, pregunta, setPregunta }) {
  const [respuesta, setRespuesta] = useState("")
  const [consultando, setConsultando] = useState(false)
  const [error, setError] = useState("")

  async function preguntar(evento) {
    evento.preventDefault()
    if (!seleccionado || consultando || !pregunta.trim()) return

    // La práctica usa una llave local solo en el servidor de desarrollo.
    const llave = import.meta.env.DEV ? import.meta.env.VITE_GEMINI_API_KEY?.trim() : ""
    if (!llave) {
      setError("Para consultar a Gemini, configura VITE_GEMINI_API_KEY en .env y ejecuta npm run dev.")
      return
    }

    setConsultando(true)
    setError("")
    setRespuesta("")

    const input = [
      "Responde en español, en un párrafo corto y claro, con base en la noticia.",
      `Título: ${seleccionado.title}`,
      `Resumen: ${seleccionado.summary}`,
      `Pregunta: ${pregunta.trim()}`,
    ].join("\n")

    try {
      const ai = new GoogleGenAI({ apiKey: llave })
      const interaccion = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input,
        store: false,
      })
      const texto = interaccion.output_text?.trim()

      if (texto) {
        setRespuesta(texto)
      } else {
        setError("Gemini no devolvió texto. Intenta formular la pregunta de otra manera.")
      }
    } catch (err) {
      if (err.status === 429) {
        setError("Se alcanzó el límite de Gemini. Espera un momento o revisa la cuota en Google AI Studio.")
      } else {
        setError("No se pudo consultar a Gemini. Revisa tu conexión y el acceso de tu llave al modelo.")
      }
    } finally {
      setConsultando(false)
    }
  }

  return (
    <>
      <form onSubmit={preguntar}>
        <label htmlFor="pregunta">Tu pregunta</label>
        <textarea
          id="pregunta"
          value={pregunta}
          onChange={(evento) => setPregunta(evento.target.value)}
          rows={3}
          required
        />
        <button type="submit" disabled={consultando || !seleccionado || !pregunta.trim()}>
          {consultando ? "Consultando..." : "Preguntar"}
        </button>
      </form>
      {error && <p className="aviso" role="alert">{error}</p>}
      {respuesta && (
        <div className="respuesta" role="status">
          <h3>Respuesta</h3>
          <p>{respuesta}</p>
        </div>
      )}
    </>
  )
}

export default PreguntaGemini
