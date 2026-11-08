const secciones = [
  ['panel', 'Resumen'],
  ['vehiculos', 'Vehículos'],
  ['viajes', 'Viajes'],
]

export default function Panel({ pagina, cerrarSesion, mensaje, children }) {
  return (
    <>
      <aside className="sidebar">
        <a className="brand" href="#panel"><span className="logo" aria-hidden="true">F</span> FloatMate</a>
        <p className="nav-label">OPERACIÓN</p>
        <nav aria-label="Navegación principal">
          {secciones.map(([ruta, nombre]) => (
            <a key={ruta} href={`#${ruta}`} aria-current={pagina === ruta ? 'page' : undefined}>{nombre}</a>
          ))}
        </nav>
        <div className="profile">
          <span className="avatar" aria-hidden="true">AA</span>
          <div>Ana Álvarez<small>Administradora · NOR</small></div>
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
