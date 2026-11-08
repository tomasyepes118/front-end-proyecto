import { useEffect, useState } from 'react'
import Panel from './components/Panel.jsx'
import FormularioVehiculo from './components/FormularioVehiculo.jsx'
import FormularioViaje from './components/FormularioViaje.jsx'
import { crearViajesIniciales, vehiculosIniciales } from './data/demo.js'
import { guardarLista, guardarSesion, leerLista, leerSesion } from './lib/almacenamiento.js'
import { obtenerDetalleViajes } from './lib/operacion.js'
import Acceso from './pages/Acceso.jsx'
import Resumen from './pages/Resumen.jsx'
import Vehiculos from './pages/Vehiculos.jsx'
import Viajes from './pages/Viajes.jsx'

const claveVehiculos = 'floatmate-ppi-vehiculos'
const claveViajes = 'floatmate-ppi-viajes'

function leerPagina() {
  const ruta = window.location.hash.slice(1)
  return ['vehiculos', 'viajes'].includes(ruta) ? ruta : 'panel'
}

export default function App() {
  const [sesion, setSesion] = useState(leerSesion)
  const [pagina, setPagina] = useState(leerPagina)
  const [vehiculos, setVehiculos] = useState(() => leerLista(claveVehiculos, () => vehiculosIniciales))
  const [viajes, setViajes] = useState(() => leerLista(claveViajes, crearViajesIniciales))
  const [formulario, setFormulario] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    function cambiarPagina() {
      setPagina(leerPagina())
      setMensaje('')
      setFormulario('')
    }
    window.addEventListener('hashchange', cambiarPagina)
    return () => window.removeEventListener('hashchange', cambiarPagina)
  }, [])

  function cambiarSesion(activa) {
    guardarSesion(activa)
    setSesion(activa)
    setFormulario('')
    setMensaje('')
  }

  function registrarVehiculo(vehiculo) {
    const lista = [...vehiculos, vehiculo]
    setVehiculos(lista)
    setFormulario('')
    setMensaje(guardarLista(claveVehiculos, lista)
      ? 'Vehículo registrado correctamente.'
      : 'El vehículo se agregó durante esta visita. El navegador bloqueó el guardado local.')
  }

  function registrarViaje(viaje) {
    const lista = [...viajes, viaje]
    setViajes(lista)
    setFormulario('')
    setMensaje(guardarLista(claveViajes, lista)
      ? 'Viaje programado correctamente.'
      : 'El viaje se agregó durante esta visita. El navegador bloqueó el guardado local.')
  }

  if (!sesion) return <Acceso iniciarSesion={() => cambiarSesion(true)} />

  const detalleViajes = obtenerDetalleViajes(viajes, vehiculos)
  const abrirViaje = () => setFormulario('viaje')
  const cerrarFormulario = () => setFormulario('')

  return (
    <Panel pagina={pagina} cerrarSesion={() => cambiarSesion(false)} mensaje={mensaje}>
      {pagina === 'panel' && <Resumen vehiculos={vehiculos} viajes={detalleViajes} abrirViaje={abrirViaje} />}
      {pagina === 'vehiculos' && <Vehiculos vehiculos={vehiculos} abrirVehiculo={() => setFormulario('vehiculo')} />}
      {pagina === 'viajes' && <Viajes viajes={detalleViajes} abrirViaje={abrirViaje} />}
      {formulario === 'vehiculo' && <FormularioVehiculo vehiculos={vehiculos} registrar={registrarVehiculo} cerrar={cerrarFormulario} />}
      {formulario === 'viaje' && <FormularioViaje vehiculos={vehiculos} viajes={viajes} registrar={registrarViaje} cerrar={cerrarFormulario} />}
    </Panel>
  )
}
