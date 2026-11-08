import { useEffect, useState } from 'react'
import Panel from './components/Panel.jsx'
import FormularioVehiculo from './components/FormularioVehiculo.jsx'
import FormularioViaje from './components/FormularioViaje.jsx'
import AccionViaje from './components/AccionViaje.jsx'
import { cuentasDemo, paginas, puedeVerPagina } from './data/demo.js'
import { guardarOperacion, guardarSesion, leerOperacion, leerSesion } from './lib/almacenamiento.js'
import { cambiarRegistro, obtenerDetalleViajes, validarDespacho } from './lib/operacion.js'
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
  const [usuario, setUsuario] = useState(leerSesion)
  const [ruta, setRuta] = useState(leerPagina)
  const [datos, setDatos] = useState(leerOperacion)
  const [formulario, setFormulario] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const cuenta = cuentasDemo[usuario]
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

  function cambiarSesion(nuevoUsuario) {
    guardarSesion(nuevoUsuario)
    setUsuario(nuevoUsuario)
    setFormulario(null)
    setMensaje('')
  }

  function registrar(modulo, registro, accion, referencia, exito = mensajes[modulo]) {
    const editaCatalogo = ['vehiculos', 'conductores', 'rutas'].includes(modulo)
    if (!puedeOperar || (editaCatalogo && !esAdmin)) return
    const registroAuditoria = {
      id: Math.max(0, ...datos.auditoria.map(item => item.id)) + 1,
      fecha: new Date().toISOString(),
      usuario,
      accion,
      referencia,
    }
    const siguiente = {
      ...datos,
      [modulo]: cambiarRegistro(datos[modulo], registro),
      auditoria: [registroAuditoria, ...datos.auditoria],
    }
    setDatos(siguiente)
    setFormulario(null)
    setMensaje(guardarOperacion(siguiente) ? exito : 'El cambio se aplicó en esta visita. El navegador no permitió guardarlo.')
  }

  function procesarViaje(control) {
    if (!puedeOperar) return 'Tu rol no puede gestionar viajes.'
    const viaje = datos.viajes.find(viaje => viaje.id === formulario.actual.id)
    if (!viaje) return 'El viaje no está disponible.'
    const referencia = `Viaje ${viaje.id}`

    if (formulario.tipo === 'control') {
      if (viaje.status !== 'PROGRAMADO') return 'El viaje ya cambió de estado.'
      registrar('controles', { ...control, usuario, fecha: new Date().toISOString() }, 'Registró control de salida', referencia)
    } else if (formulario.tipo === 'iniciar') {
      const error = validarDespacho(viaje, datos)
      if (error) return error
      registrar('viajes', { ...viaje, status: 'EN_CURSO', inicio: new Date().toISOString(), operador: usuario }, 'Inició viaje', referencia, 'Viaje iniciado correctamente.')
    } else {
      if (viaje.status !== 'EN_CURSO') return 'El viaje debe estar en curso para poder cerrarlo.'
      registrar('viajes', { ...viaje, status: 'FINALIZADO', cierre: new Date().toISOString() }, 'Cerró viaje', referencia, 'Viaje finalizado correctamente.')
    }
  }

  if (!cuenta) return <Acceso iniciarSesion={cambiarSesion} />

  const pagina = puedeVerPagina(cuenta.rol, ruta) ? ruta : 'panel'
  const { vehiculos, viajes, conductores, rutas, controles, acpm, incidentes, auditoria } = datos
  const detalleViajes = obtenerDetalleViajes(viajes, vehiculos, conductores, rutas)
  const flota = vehiculos.map(bus => viajes.some(viaje => viaje.status === 'EN_CURSO' && viaje.vehicle === bus.id)
    ? { ...bus, status: 'EN_RUTA' } : bus)
  const abrirViaje = () => setFormulario({ tipo: 'viaje' })
  const cerrarFormulario = () => setFormulario(null)

  return (
    <Panel pagina={pagina} cuenta={cuenta} cerrarSesion={() => cambiarSesion('')} mensaje={mensaje}>
      {pagina === 'panel' && <Resumen vehiculos={flota} viajes={detalleViajes} abrirViaje={puedeOperar ? abrirViaje : null} />}
      {pagina === 'vehiculos' && (
        <Vehiculos vehiculos={flota}
          abrirVehiculo={esAdmin ? () => setFormulario({ tipo: 'vehiculo' }) : null}
          editarVehiculo={esAdmin ? bus => setFormulario({ tipo: 'vehiculo', actual: vehiculos.find(item => item.id === bus.id) }) : null} />
      )}
      {['conductores', 'rutas'].includes(pagina) && (
        <Catalogo key={pagina} tipo={pagina} lista={datos[pagina]}
          guardar={esAdmin ? item => registrar(pagina, item, pagina === 'rutas' ? 'Guardó ruta' : 'Guardó conductor', item.code) : null} />
      )}
      {pagina === 'viajes' && (
        <Viajes viajes={detalleViajes} controles={controles} abrirViaje={abrirViaje}
          abrirAccion={(tipo, actual) => setFormulario({ tipo, actual })} />
      )}
      {['acpm', 'incidentes'].includes(pagina) && (
        <Registros key={pagina} tipo={pagina} registros={pagina === 'acpm' ? acpm : incidentes} vehiculos={vehiculos}
          guardar={item => registrar(pagina, item, pagina === 'acpm' ? 'Registró abastecimiento' : 'Registró incidente',
            vehiculos.find(bus => bus.id === item.vehiculo)?.plate ?? '')} />
      )}
      {pagina === 'reportes' && <Reportes viajes={detalleViajes} acpm={acpm} />}
      {pagina === 'auditoria' && <Auditoria movimientos={auditoria} />}
      {formulario?.tipo === 'vehiculo' && (
        <FormularioVehiculo vehiculos={vehiculos} actual={formulario.actual}
          registrar={bus => registrar('vehiculos', bus, formulario.actual ? 'Editó vehículo' : 'Registró vehículo', bus.plate,
            formulario.actual ? 'Vehículo actualizado correctamente.' : mensajes.vehiculos)} cerrar={cerrarFormulario} />
      )}
      {formulario?.tipo === 'viaje' && (
        <FormularioViaje vehiculos={flota} viajes={viajes} conductores={conductores} rutas={rutas}
          registrar={viaje => registrar('viajes', viaje, 'Programó viaje', `Viaje ${viaje.id}`)} cerrar={cerrarFormulario} />
      )}
      {formulario?.actual && ['control', 'iniciar', 'cerrar'].includes(formulario.tipo) && (
        <AccionViaje accion={formulario.tipo} viaje={formulario.actual}
          control={controles.find(control => control.id === formulario.actual.id)}
          procesar={procesarViaje} cerrar={cerrarFormulario} />
      )}
    </Panel>
  )
}
