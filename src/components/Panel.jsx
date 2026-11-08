import { paginas, puedeVerPagina } from '../data/demo.js'

export default function Panel({ pagina, cuenta, cerrarSesion, mensaje, children }) {
  return (
    <>
      <aside className="sidebar">
        <a className="brand" href="#panel"><span className="logo" aria-hidden="true">F</span> FloatMate</a>
        <p className="nav-label">OPERACIÓN</p>
        <nav aria-label="Navegación principal">
          {paginas.filter(({ id }) => puedeVerPagina(cuenta.rol, id)).map(({ id, nombre }) => (
            <a key={id} href={`#${id}`} aria-current={pagina === id ? 'page' : undefined}>{nombre}</a>
          ))}
        </nav>
        <div className="profile">
          <span className="avatar" aria-hidden="true">{cuenta.rol.slice(0, 2).toUpperCase()}</span>
          <div>{cuenta.nombre}<small>{cuenta.rol} · NOR</small></div>
        </div>
        <button className="logout" onClick={cerrarSesion}>Cerrar sesión</button>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>Centro de operaciones / Terminal Norte</span>
          <span className="demo">Demostración</span>
        </header>
        <main className="content">
          {mensaje && <p className="feedback" role="status">{mensaje}</p>}
          {children}
        </main>
        <footer>FloatMate · Laboratorio II de Programación Web</footer>
      </div>
    </>
  )
}
