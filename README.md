# FloatMate | Laboratorio II del PPI

Proyecto de Programación Web de Tomás Yepes Arboleda, cuarto semestre de Desarrollo de Software en la Institución Universitaria Pascual Bravo.

Esta entrega migra a React el [frontend HTML de FloatMate](https://github.com/tomasyepes118/Floatmate/tree/f5b999c/06_Material_adicional/Codigo_y_bases_de_datos/01_Codigo_web/FloatMate_Web) y toma los estilos y catálogos del [prototipo navegable de la Parte I](https://github.com/tomasyepes118/Floatmate/tree/dde211aa8bed4d5f661cab0fd88969db4c0324ca/05_Tareas_adicionales/2026-10-13_Diagramas_y_mockup/Mockup/01_Parte_I/01_Prototipo_navegable). Conserva la pantalla de acceso, el resumen, el inventario de vehículos y la programación de viajes. Todo funciona en el navegador con JavaScript, JSX, Vite y CSS.

## Cómo ejecutarlo

Usa Node.js 22.12 o una versión posterior compatible con Vite.

```bash
git clone -b laboratorio-ii-ppi https://github.com/tomasyepes118/front-end-proyecto.git
cd front-end-proyecto
npm ci
npm run dev
```

Abre la URL que aparezca en la terminal. El usuario de demostración es `admin` y la contraseña es `floatmate123`. Son datos ficticios para probar el formulario.

## Recorrido

| Vista | Qué puedes hacer |
| --- | --- |
| Acceso | Probar las credenciales de ejemplo y cerrar sesión desde el panel. |
| Resumen | Consultar los indicadores, el estado de la flota y las próximas salidas. |
| Vehículos | Buscar por placa o marca, filtrar por estado y registrar un bus. |
| Viajes | Buscar por ruta, conductor o placa, filtrar y programar un viaje. El formulario valida fecha futura, disponibilidad, capacidad y cruce de horarios. |

Los registros nuevos quedan en `localStorage` del navegador y se pueden consultar después de recargar. El acceso simulado se conserva en `sessionStorage` durante la sesión de la pestaña. Usa el mismo navegador y la misma URL para ver tus datos. Las pantallas del panel se identifican con las rutas `#panel`, `#vehiculos` y `#viajes`.

## Organización

- `src/pages/` contiene las cuatro pantallas.
- `src/components/` contiene el menú, los formularios y los elementos reutilizables.
- `src/data/` contiene los vehículos, rutas, conductores y viajes de ejemplo.
- `src/lib/` reúne la persistencia local y las reglas de programación.
- `src/App.jsx` coordina la navegación y comparte los datos con las pantallas.

## Verificación

```bash
npm run lint
npm run build
```

Para verificar el guardado en el navegador, registra un bus con una placa nueva y programa un viaje con ese bus. Escoge una fecha futura y un conductor libre. Recarga la página y busca ambos registros por placa.

## Desarrollo del laboratorio

Se reutilizó el proyecto base de React y Vite que ya estaba en el historial del repositorio. Se usó IA para apoyar la migración del prototipo y la implementación de los módulos. La guía del curso pide realizar manualmente la estructura inicial, las páginas y rutas de un módulo. Esa práctica debe quedar respaldada por el estudiante con su propio trabajo.
