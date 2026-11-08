import { useEffect, useState } from 'react'
import Panel from './components/Panel.jsx'
import FormularioVehiculo from './components/FormularioVehiculo.jsx'
import FormularioViaje from './components/FormularioViaje.jsx'
import AccionViaje from './components/AccionViaje.jsx'
import { paginas, puedeVerPagina } from './data/demo.js'
import { consultarApi } from './lib/api.js'
import { obtenerDetalleViajes } from './lib/operacion.js'
import Acceso from './pages/Acceso.jsx'
import Resumen from './pages/Resumen.jsx'
import Vehiculos from './pages/Vehiculos.jsx'
import Viajes from './pages/Viajes.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Registros from './pages/Registros.jsx'
import Reportes from './pages/Reportes.jsx'
import Auditoria from './pages/Auditoria.jsx'

const mensajes = {
  vehiculos: 'Vehículo registrado correctamente.',
  viajes: 'Viaje programado correctamente.',
  conductores: 'Conductor guardado correctamente.',
  rutas: 'Ruta guardada correctamente.',
  controles: 'Control de salida guardado.',
  acpm: 'Abastecimiento registrado correctamente.',
  incidentes: 'Incidente registrado correctamente.',
}

function leerPagina() {
  const ruta = window.location.hash.slice(1)
  return paginas.some(pagina => pagina.id === ruta) ? ruta : 'panel'
}

export default function App() {
  const [cuenta, setCuenta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [ruta, setRuta] = useState(leerPagina)
  const [datos, setDatos] = useState(null)
  const [formulario, setFormulario] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const esAdmin = cuenta?.rol === 'Administrador'
  const puedeOperar = Boolean(cuenta && cuenta.rol !== 'Consulta')

  useEffect(() => {
    function cambiarPagina() {
      setRuta(leerPagina())
      setMensaje('')
      setFormulario(null)
    }
    window.addEventListener('hashchange', cambiarPagina)
    return () => window.removeEventListener('hashchange', cambiarPagina)
  }, [])

  useEffect(() => {
    let activo = true

    async function recuperarSesion() {
      try {
        const sesion = await consultarApi('/sesion')
        const operacion = await consultarApi('/operacion')
        if (activo) {
          setDatos(operacion)
          setCuenta(sesion.cuenta)
        }
      } catch (error) {
        if (activo && error.status !== 401) setMensaje('No se pudo conectar con el servidor de FloatMate.')
      } finally {
        if (activo) setCargando(false)
      }
    }

    void recuperarSesion()
    return () => { activo = false }
  }, [])

  async function iniciarSesion(usuario, clave) {
    const sesion = await consultarApi('/sesion', { metodo: 'POST', datos: { usuario, clave } })
    const operacion = await consultarApi('/operacion')
    setDatos(operacion)
    setCuenta(sesion.cuenta)
    setMensaje('')
  }

  async function cerrarSesion() {
    try {
      await consultarApi('/sesion', { metodo: 'DELETE' })
      setCuenta(null)
      setDatos(null)
      setFormulario(null)
      setMensaje('')
    } catch {
      setMensaje('No se pudo cerrar la sesión. Inténtalo de nuevo.')
    }
  }

  async function guardar(rutaApi, metodo, registro, exito) {
    try {
      const siguiente = await consultarApi(rutaApi, { metodo, datos: registro })
      setDatos(siguiente)
      setFormulario(null)
      setMensaje(exito)
      return ''
    } catch (error) {
      if (error.status === 401) {
        setCuenta(null)
        setDatos(null)
        setFormulario(null)
        setMensaje(error.message)
      }
      return error.message
    }
  }

  function registrar(modulo, registro, id, exito = mensajes[modulo]) {
    return guardar(id ? `/${modulo}/${id}` : `/${modulo}`, id ? 'PUT' : 'POST', registro, exito)
  }

  function procesarViaje(control) {
    const { tipo, actual } = formulario
    const exito = {
      control: 'Control de salida guardado.',
      iniciar: 'Viaje iniciado correctamente.',
      cerrar: 'Viaje finalizado correctamente.',
    }[tipo]
    return guardar(`/viajes/${actual.id}/${tipo}`, 'POST', control, exito)
  }

  if (cargando) return <main className="content"><p role="status">Cargando FloatMate…</p></main>
  if (!cuenta) return <Acceso iniciarSesion={iniciarSesion} aviso={mensaje} />

  const pagina = puedeVerPagina(cuenta.rol, ruta) ? ruta : 'panel'
  const { vehiculos, viajes, conductores, rutas, controles, acpm, incidentes, auditoria } = datos
  const detalleViajes = obtenerDetalleViajes(viajes, vehiculos, conductores, rutas)
  const flota = vehiculos.map(bus => viajes.some(viaje => viaje.status === 'EN_CURSO' && viaje.vehicle === bus.id)
    ? { ...bus, status: 'EN_RUTA' } : bus)
  const abrirViaje = () => setFormulario({ tipo: 'viaje' })
  const cerrarFormulario = () => setFormulario(null)

  return (
    <Panel pagina={pagina} cuenta={cuenta} cerrarSesion={cerrarSesion} mensaje={mensaje}>
      {pagina === 'panel' && <Resumen vehiculos={flota} viajes={detalleViajes} abrirViaje={puedeOperar ? abrirViaje : null} />}
      {pagina === 'vehiculos' && (
        <Vehiculos vehiculos={flota}
          abrirVehiculo={esAdmin ? () => setFormulario({ tipo: 'vehiculo' }) : null}
          editarVehiculo={esAdmin ? bus => setFormulario({ tipo: 'vehiculo', actual: vehiculos.find(item => item.id === bus.id) }) : null} />
      )}
      {['conductores', 'rutas'].includes(pagina) && (
        <Catalogo key={pagina} tipo={pagina} lista={datos[pagina]}
          guardar={esAdmin ? (item, id) => registrar(pagina, item, id) : null} />
      )}
      {pagina === 'viajes' && (
        <Viajes viajes={detalleViajes} controles={controles} abrirViaje={abrirViaje}
          abrirAccion={(tipo, actual) => setFormulario({ tipo, actual })} />
      )}
      {['acpm', 'incidentes'].includes(pagina) && (
        <Registros key={pagina} tipo={pagina} registros={pagina === 'acpm' ? acpm : incidentes} vehiculos={vehiculos}
          guardar={item => registrar(pagina, item)} />
      )}
      {pagina === 'reportes' && <Reportes viajes={detalleViajes} acpm={acpm} />}
      {pagina === 'auditoria' && <Auditoria movimientos={auditoria} />}
      {formulario?.tipo === 'vehiculo' && (
        <FormularioVehiculo vehiculos={vehiculos} actual={formulario.actual}
          registrar={bus => registrar('vehiculos', bus, formulario.actual?.id,
            formulario.actual ? 'Vehículo actualizado correctamente.' : mensajes.vehiculos)} cerrar={cerrarFormulario} />
      )}
      {formulario?.tipo === 'viaje' && (
        <FormularioViaje vehiculos={flota} viajes={viajes} conductores={conductores} rutas={rutas}
          registrar={viaje => registrar('viajes', viaje)} cerrar={cerrarFormulario} />
      )}
      {formulario?.actual && ['control', 'iniciar', 'cerrar'].includes(formulario.tipo) && (
        <AccionViaje accion={formulario.tipo} viaje={formulario.actual}
          control={controles.find(control => control.id === formulario.actual.id)}
          procesar={procesarViaje} cerrar={cerrarFormulario} />
      )}
    </Panel>
  )
}
