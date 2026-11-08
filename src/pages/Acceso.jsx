import { useState } from 'react'

export default function Acceso({ iniciarSesion }) {
  const [error, setError] = useState('')
  const [mostrarClave, setMostrarClave] = useState(false)

  function enviar(evento) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)

    if (datos.get('usuario').trim() === 'admin' && datos.get('contrasena') === 'floatmate123') {
      iniciarSesion()
    } else {
      setError('Usuario o contraseña incorrectos. Inténtalo de nuevo.')
    }
  }

  return (
    <main className="login">
      <section className="intro" aria-label="FloatMate">
        <div><span className="logo" aria-hidden="true">F</span><h1>FloatMate</h1></div>
        <p>Todo listo para<br />la próxima salida.</p>
        <small>Gestión de flotas · Terminal Norte</small>
        <div className="road" aria-hidden="true" />
      </section>
      <div className="login-content">
        <form onSubmit={enviar}>
          <p className="eyebrow">BIENVENIDO A FLOATMATE</p>
          <h2>Ingresa a tu operación</h2>
          <p>Consulta tu flota y organiza los viajes de la terminal.</p>
          <label>Usuario<input name="usuario" autoComplete="username" required /></label>
          <label htmlFor="clave">Contraseña</label>
          <div className="password-field">
            <input id="clave" name="contrasena" type={mostrarClave ? 'text' : 'password'} autoComplete="current-password" required />
            <button type="button" onClick={() => setMostrarClave(!mostrarClave)} aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {mostrarClave ? 'Ocultar' : 'Ver'}
            </button>
          </div>
          <button className="primary" type="submit">Ingresar</button>
          {error && <p className="error" role="alert">{error}</p>}
          <small className="demo-access">Acceso de demostración <strong>admin</strong> / <strong>floatmate123</strong></small>
        </form>
      </div>
    </main>
  )
}
