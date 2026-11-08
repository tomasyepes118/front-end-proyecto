import { useState } from 'react'

export default function Acceso({ iniciarSesion, aviso }) {
  const [error, setError] = useState('')
  const [mostrarClave, setMostrarClave] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)

    setEnviando(true)
    setError('')
    try {
      await iniciarSesion(datos.get('usuario'), datos.get('contrasena'))
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setEnviando(false)
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
          <button className="primary" type="submit" disabled={enviando}>{enviando ? 'Ingresando…' : 'Ingresar'}</button>
          {(error || aviso) && <p className="error" role="alert">{error || aviso}</p>}
          <small className="demo-access">Usuarios de demostración <strong>admin</strong>, <strong>operador</strong> y <strong>consulta</strong>. Usa la contraseña configurada en el backend.</small>
        </form>
      </div>
    </main>
  )
}
