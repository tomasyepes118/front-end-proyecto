# Práctica consumo APIs

**Programación Web**

![Institución Universitaria Pascual Bravo](https://pascualbravo.edu.co/wp-content/uploads/2023/06/cropped-Imagotipo-horizontal_acreditados.png)

## Integrantes

- Tomás Yepes
- Cristian Benites
- Mateo Gallo

**No hay necesidad de usar IA. Solo hay que seguir los pasos de este laboratorio.**

## Objetivo

Consumir dos APIs en una aplicación React, cada una en su propio componente:

- `ListaNoticias`: Spaceflight News con Axios
- `PreguntaGemini`: Gemini con `@google/genai`

| Tiempo | Qué hacemos |
| --- | --- |
| 0:00 – 0:08 | Hacer fork o clonar, e instalar el proyecto |
| 0:08 – 0:15 | Revisar el JSON de Spaceflight News |
| 0:15 – 0:20 | Instalar Axios |
| 0:20 – 0:40 | Completar `ListaNoticias` |
| 0:40 – 0:48 | Crear la llave de Gemini y guardarla |
| 0:48 – 0:52 | Instalar `@google/genai` |
| 0:52 – 1:08 | Completar `PreguntaGemini` |
| 1:08 – 1:15 | Probar, escribir nombres y subir |

## Cómo está organizada la app

`src/App.jsx` ya está armado. Solo junta las piezas:

1. Guarda la noticia elegida en `seleccionado`.
2. Pasa esa noticia a `ListaNoticias` y a `PreguntaGemini`.
3. Cuando alguien hace clic en una tarjeta, `ListaNoticias` llama a `onSeleccionar`.

Tú no tocas `App.jsx`. Trabajas en estos archivos:

- Paso 3 → `src/components/ListaNoticias.jsx`
- Paso 5 → `src/components/PreguntaGemini.jsx`

Cada comentario `PASO 3` o `PASO 5` es un hueco: bórralo y pega ahí el código. Los estilos de `src/App.css` ya están listos.

## Paso 0. Traer el proyecto

Repositorio del docente: https://github.com/juliomartinezpascual/practica-consumi-apis

Para poder subir tu entrega, trabaja sobre **tu copia**.

**Fork, y luego clonar.** Es el camino para entregar.

1. Inicia sesión en https://github.com
2. Abre el repositorio del docente y pulsa **Fork**.
3. En tu copia, pulsa **Code** y copia la dirección HTTPS. Lleva tu usuario, no el del docente.
4. En tu computador:

```bash
git clone PEGA_AQUI_LA_URL_DE_TU_FORK
cd practica-consumi-apis
npm install
npm run dev
```

Si el nombre de la carpeta es otro, entra a la carpeta que se creó al clonar.

**Solo clonar.** Sirve para trabajar, pero GitHub no te deja hacer push al repositorio del docente. Si empezaste así, al final crea un repositorio vacío en tu cuenta, sin README, y cambia el destino:

```bash
git clone https://github.com/juliomartinezpascual/practica-consumi-apis.git
cd practica-consumi-apis
npm install
git remote set-url origin PEGA_AQUI_LA_URL_DE_TU_REPOSITORIO
```

Abre la app. Verás el encabezado y dos zonas vacías: artículos y pregunta a Gemini.

## Paso 1. Revisar el JSON de Spaceflight News

Spaceflight News es un API público. No pide llave. Documentación: https://api.spaceflightnewsapi.net/v4/docs/

Abre en el navegador:

https://api.spaceflightnewsapi.net/v4/articles/?limit=2

Vas a ver un JSON con esta forma:

```json
{
  "count": 36761,
  "next": "https://api.spaceflightnewsapi.net/v4/articles/?limit=2&offset=2",
  "previous": null,
  "results": [
    {
      "id": 40698,
      "title": "Título de la noticia",
      "url": "https://...",
      "image_url": "https://...",
      "news_site": "SpaceNews",
      "summary": "Resumen corto",
      "published_at": "2026-11-03T16:59:43Z"
    }
  ]
}
```

Quédate con tres ideas:

- `results` es la lista. Cada noticia es un objeto de esa lista.
- `title`, `summary`, `image_url`, `news_site`, `url` y `published_at` son los datos que vamos a mostrar.
- `limit=2` pide solo 2 noticias. En la app pediremos 6.

## Paso 2. Instalar Axios

En la terminal del proyecto:

```bash
npm install axios
```

Axios pide APIs y deja el JSON listo en `respuesta.data`. Si el API responde con error, Axios entra al `catch`.

## Paso 3. Completar `ListaNoticias` con Axios

Abre `src/components/ListaNoticias.jsx`. Este componente recibe dos props:

- `seleccionado`: la noticia que está marcada
- `onSeleccionar`: función para avisarle a `App` cuál se eligió

En cada punto, borra el comentario `PASO 3` y deja el código.

**Importa los hooks:**

```jsx
import { useEffect, useState } from "react"
```

**Importa Axios:**

```jsx
import axios from "axios"
```

**Dirección del API:**

```jsx
const URL_ARTICULOS = "https://api.spaceflightnewsapi.net/v4/articles/?limit=6"
```

**Estados**, dentro de `ListaNoticias`:

```jsx
const [articulos, setArticulos] = useState([])
const [cargando, setCargando] = useState(true)
const [error, setError] = useState("")
```

**Carga al abrir:**

```jsx
useEffect(() => {
  cargarArticulos()
}, [])
```

**Pedir las noticias con Axios:**

```jsx
async function cargarArticulos() {
  try {
    setCargando(true)
    setError("")
    const respuesta = await axios.get(URL_ARTICULOS)
    setArticulos(respuesta.data.results)
  } catch (err) {
    setError("No hubo conexión con el API de noticias. Revisa tu internet.")
    console.error(err)
  } finally {
    setCargando(false)
  }
}
```

Con Axios el JSON llega en `respuesta.data`. Por eso la lista es `respuesta.data.results`.

**Fecha**, fuera del componente:

```jsx
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
```

**Aviso de error:**

```jsx
{error && <p className="aviso">{error}</p>}
```

**Texto de carga:**

```jsx
{cargando && <p>Cargando noticias...</p>}
```

**Tarjetas**, dentro de `<ul className="lista">`:

```jsx
{articulos.map((articulo) => (
  <li key={articulo.id}>
    <button
      type="button"
      className={seleccionado?.id === articulo.id ? "tarjeta activa" : "tarjeta"}
      onClick={() => onSeleccionar(articulo)}
    >
      {articulo.image_url && <img src={articulo.image_url} alt="" />}
      <span className="medio">{articulo.news_site}</span>
      <strong>{articulo.title}</strong>
      <span className="fecha">{formatearFecha(articulo.published_at)}</span>
    </button>
  </li>
))}
```

El clic llama a `onSeleccionar(articulo)`. Así `App` guarda la noticia y se la pasa a `PreguntaGemini`.

**Comprueba antes de seguir:**

- La página muestra 6 noticias con título, medio y fecha.
- Al hacer clic, la tarjeta queda marcada.

## Paso 4. Crear la llave de Gemini

Documentación: https://aistudio.google.com/docs/api-key

1. Entra a https://aistudio.google.com/ con un correo de Gmail, puede ser el de la Universidad.
2. Abre https://aistudio.google.com/api-keys
3. Pulsa **Create API key** y copia la llave. Empieza por `AIza`.

Déjala solo en tu computador. No la pegues en el chat del curso ni en GitHub.

En la raíz del proyecto, abre `.env`. Si no existe, créalo. Una línea, sin comillas:

```
VITE_GEMINI_API_KEY=AIza_tu_llave
```

El nombre empieza por `VITE_` para que React pueda leerla. Si `npm run dev` ya estaba abierto, detenlo y vuélvelo a iniciar.

## Paso 5. Completar `PreguntaGemini` con `@google/genai`

En la terminal del proyecto:

```bash
npm install @google/genai
```

La librería se usa así, según la documentación de Google:

```js
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" })

const interaction = await ai.interactions.create({
  model: "gemini-4-hydrogen",
  input: "Explain how AI works in a few words",
})

console.log(interaction.output_text)
```

Abre `src/components/PreguntaGemini.jsx`. Este componente recibe `seleccionado`: la noticia que eligió el estudiante.

**Importa los hooks:**

```jsx
import { useEffect, useState } from "react"
```

**Importa Gemini:**

```jsx
import { GoogleGenAI } from "@google/genai"
```

**Estados:**

```jsx
const [pregunta, setPregunta] = useState("Explícame esta noticia en palabras sencillas")
const [respuesta, setRespuesta] = useState("")
const [consultando, setConsultando] = useState(false)
const [error, setError] = useState("")
```

**Limpiar al cambiar de noticia:**

```jsx
useEffect(() => {
  setRespuesta("")
  setError("")
}, [seleccionado?.id])
```

**Función `preguntar`:**

```jsx
async function preguntar(evento) {
  evento.preventDefault()

  if (!seleccionado) {
    setError("Elige una noticia antes de preguntar.")
    return
  }

  const llave = import.meta.env.VITE_GEMINI_API_KEY
  if (!llave) {
    setError("Falta la llave en el archivo .env. Agrégala y reinicia npm run dev.")
    return
  }

  const prompt = [
    "Responde en español, en un párrafo corto y claro.",
    `Título: ${seleccionado.title}`,
    `Resumen: ${seleccionado.summary}`,
    `Pregunta: ${pregunta}`,
  ].join("\n")

  try {
    setConsultando(true)
    setError("")
    setRespuesta("")

    const ai = new GoogleGenAI({ apiKey: llave })
    const interaction = await ai.interactions.create({
      model: "gemini-4-hydrogen",
      input: prompt,
    })

    const texto = interaction.output_text
    if (!texto) {
      console.log(interaction)
      throw new Error("Gemini respondió sin texto. Revisa la consola del navegador.")
    }
    setRespuesta(texto)
  } catch (err) {
    setError(err.message || "No se pudo consultar a Gemini.")
  } finally {
    setConsultando(false)
  }
}
```

**Aviso de error:**

```jsx
{error && <p className="aviso">{error}</p>}
```

**Noticia elegida:**

```jsx
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
```

**Formulario:**

```jsx
<form onSubmit={preguntar}>
  <label htmlFor="pregunta">Tu pregunta</label>
  <textarea
    id="pregunta"
    value={pregunta}
    onChange={(evento) => setPregunta(evento.target.value)}
    rows={3}
  />
  <button type="submit" disabled={consultando || !seleccionado}>
    {consultando ? "Consultando..." : "Preguntar"}
  </button>
</form>
```

**Respuesta:**

```jsx
{respuesta && (
  <div className="respuesta">
    <h3>Respuesta</h3>
    <p>{respuesta}</p>
  </div>
)}
```

## Paso 6. Probar

1. Elige una noticia.
2. Pulsa **Preguntar**.
3. Debe aparecer un párrafo sobre esa noticia.
4. Elige otra noticia: la respuesta anterior desaparece.

En F12 → **Red** quedan las dos peticiones: `articles` desde `ListaNoticias` y la llamada a Gemini desde `PreguntaGemini`.

## Paso 7. Marcar la entrega y subirla

1. Al inicio de este archivo, en **Integrantes**, escribe el nombre completo de cada estudiante del equipo.
2. El archivo `.env` no se sube. Ahí está tu llave.
3. En la terminal del proyecto:

```bash
git add .
git commit -m "ListaNoticias con Axios y PreguntaGemini con @google/genai"
git push -u origin HEAD
```

4. Abre tu repositorio en GitHub y comprueba que se vean los nombres al inicio de `LABORATORIO.md` y los cambios en `src/components/`.
5. Copia la URL de **tu** repositorio y envíala por el medio que indique el docente.

Si el `push` pide usuario y contraseña, usa tu usuario de GitHub. La contraseña de la cuenta no sirve: GitHub pide un token personal, o puedes subir desde GitHub Desktop.

## Si algo falla

| Lo que ves | Qué revisar |
| --- | --- |
| `axios is not defined` | El import en `ListaNoticias.jsx` y que `npm install axios` haya terminado. |
| `GoogleGenAI is not defined` | El import en `PreguntaGemini.jsx` y que `npm install @google/genai` haya terminado. |
| La lista nunca carga | La URL, tu internet y que uses `respuesta.data.results`. |
| Al hacer clic no pasa nada en el panel | Que el `onClick` llame a `onSeleccionar(articulo)`. |
| "Falta la llave en el archivo .env" | La variable se llama `VITE_GEMINI_API_KEY` y reiniciaste `npm run dev`. |
| `API key not valid` | La llave va completa, sin espacios ni comillas. |
| El modelo no existe | En AI Studio abre **Get code** y copia el nombre del modelo dentro de `interactions.create`. |

## Preguntas de salida

1. ¿Qué prop usa `ListaNoticias` para avisarle a `App` cuál noticia se eligió?
2. Con Axios, ¿en qué propiedad llega el JSON de las noticias?
3. ¿En qué archivo queda el consumo de Gemini?
