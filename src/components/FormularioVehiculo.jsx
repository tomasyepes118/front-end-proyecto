import { useState } from 'react'
import { estadosVehiculo, tiposVehiculo } from '../data/demo.js'
import { Dialogo, Opciones } from './Interfaz.jsx'

export default function FormularioVehiculo({ vehiculos, actual, registrar, cerrar }) {
  const [error, setError] = useState('')

  async function enviar(evento) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const vehiculo = {
      version: actual?.version,
      plate: datos.get('placa').trim().toUpperCase(),
      code: datos.get('codigo').trim().toUpperCase(),
      type: datos.get('tipo'),
      brand: datos.get('marca').trim(),
      model: Number(datos.get('modelo')),
      capacity: Number(datos.get('capacidad')),
      km: Number(datos.get('kilometraje')),
      maintenance: Number(datos.get('mantenimiento')),
      status: datos.get('estado'),
    }

    if (!vehiculo.code || !vehiculo.brand) {
      setError('Escribe el código interno y la marca.')
    } else if (vehiculos.some(bus => bus.id !== actual?.id && (bus.plate === vehiculo.plate || bus.code.toUpperCase() === vehiculo.code))) {
      setError('La placa o el código interno ya están registrados.')
    } else if (vehiculo.maintenance < vehiculo.km) {
      setError('El próximo mantenimiento debe ser igual o mayor al kilometraje actual.')
    } else {
      setError(await registrar(vehiculo))
    }
  }

  return (
    <Dialogo titulo={actual ? 'Editar vehículo' : 'Registrar vehículo'} seccion="INVENTARIO DE FLOTA" cerrar={cerrar} guardar={enviar} error={error} accion="Guardar vehículo">
      <div className="form-grid">
        <label>Placa<input name="placa" defaultValue={actual?.plate} required pattern="[A-Za-z]{3}[0-9]{3}" maxLength={6} placeholder="ABC123" title="Tres letras seguidas de tres números" /></label>
        <label>Código interno<input name="codigo" defaultValue={actual?.code} required maxLength={15} placeholder="BUS-NOR-016" /></label>
        <label>Tipo<select name="tipo" defaultValue={actual?.type}><Opciones valores={tiposVehiculo} /></select></label>
        <label>Marca<input name="marca" defaultValue={actual?.brand} required maxLength={40} placeholder="Ej. Chevrolet" /></label>
        <label>Modelo<input name="modelo" defaultValue={actual?.model} type="number" min={2000} max={2035} required /></label>
        <label>Capacidad de pasajeros<input name="capacidad" defaultValue={actual?.capacity} type="number" min={10} max={80} required /></label>
        <label>Kilometraje actual<input name="kilometraje" defaultValue={actual?.km} type="number" min={0} step={0.01} required /></label>
        <label>Próximo mantenimiento en km<input name="mantenimiento" defaultValue={actual?.maintenance} type="number" min={0} step={0.01} required /></label>
        <label>Estado<select name="estado" defaultValue={actual?.status}><Opciones valores={estadosVehiculo} /></select></label>
      </div>
    </Dialogo>
  )
}
