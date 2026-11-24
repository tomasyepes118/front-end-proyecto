import { useState } from "react"
import "./App.css"
import ListaNoticias from "./components/ListaNoticias"
import PreguntaGemini from "./components/PreguntaGemini"

function App() {
  const [seleccionado, setSeleccionado] = useState(null)

  return (
    <div className="pagina">
      <header className="encabezado">
        <img
          className="logo"
          src="https://pascualbravo.edu.co/wp-content/uploads/2023/06/cropped-Imagotipo-horizontal_acreditados.png"
          alt="Institución Universitaria Pascual Bravo"
        />
        <p className="etiqueta">Laboratorio · Consumo de APIs</p>
        <h1>Noticias Pascual Bravo</h1>
        <p>Elige una noticia y pregúntale a Gemini.</p>
      </header>

      <main className="contenido">
        <ListaNoticias
          seleccionado={seleccionado}
          onSeleccionar={setSeleccionado}
        />
        <PreguntaGemini seleccionado={seleccionado} />
      </main>
    </div>
  )
}

export default App
