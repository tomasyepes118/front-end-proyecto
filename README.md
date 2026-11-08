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

Abre la URL que aparezca en la terminal. Las tres cuentas de demostración usan la contraseña `floatmate123`.

| Usuario | Permisos en la interfaz |
| --- | --- |
| `admin` | Gestionar catálogos, registrar la operación y revisar los reportes y la auditoría. |
| `operador` | Consultar los catálogos, gestionar viajes, registrar ACPM e incidentes y consultar los reportes. |
| `consulta` | Ver el resumen y los reportes. |

## Recorrido

| Módulo | Qué puedes hacer |
| --- | --- |
| Resumen | Consultar los indicadores de la flota y las próximas salidas. |
| Vehículos | Buscar, filtrar, registrar y editar los buses. |
| Conductores | Consultar, registrar, editar y marcar conductores como inactivos. |
| Rutas | Consultar, registrar y editar rutas con distancia y duración estimadas. |
| Viajes | Programar, registrar un control de alcoholemia simulado, iniciar y cerrar viajes. |
| ACPM | Registrar litros y precio por litro. El sistema calcula el total. |
| Incidentes | Registrar un incidente y guardar una imagen ficticia como evidencia. |
| Reportes | Consultar el historial y descargar los viajes en CSV. |
| Auditoría | Consultar los cambios registrados y la cuenta de demostración que los hizo. |

El despacho requiere un control aprobado con ticket o referencia de evidencia y la confirmación del operador. Los registros se guardan en `localStorage`; la sesión de demostración se conserva en `sessionStorage`. La interfaz simula permisos de los tres roles. Usa exclusivamente datos ficticios. Las pantallas se navegan mediante fragmentos de URL como `#panel`, `#vehiculos` y `#viajes`.

## Organización

- `src/pages/` contiene las pantallas y los módulos.
- `src/components/` contiene el menú, los formularios y los elementos reutilizables.
- `src/data/` contiene los vehículos, rutas, conductores y viajes de ejemplo.
- `src/lib/` reúne la persistencia local y las reglas de programación.
- `src/App.jsx` coordina la navegación y comparte los datos con las pantallas.

## Verificación

```bash
npm run lint
npm run build
```

Para verificar el recorrido, registra un bus y programa un viaje con fecha futura. Intenta iniciarlo sin control para ver el bloqueo. Registra un control aprobado y un ticket ficticio, confirma el inicio y cierra el viaje. Recarga la página y verifica el resultado en Reportes y Auditoría.

## Desarrollo del laboratorio

Los módulos simulados siguen el [alcance propuesto en el análisis de factibilidad](https://github.com/tomasyepes118/Floatmate/blob/dde211aa8bed4d5f661cab0fd88969db4c0324ca/01_Analisis_de_factibilidad/FloatMate_Factibilidad.pdf).

Se reutilizó el proyecto base de React y Vite que ya estaba en el historial del repositorio. Se usó IA para apoyar la migración del prototipo y la implementación de los módulos. La guía del curso pide realizar manualmente la estructura inicial, las páginas y rutas de un módulo. Esa práctica debe quedar respaldada por el estudiante con su propio trabajo.
