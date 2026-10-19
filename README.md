# Laboratorio II · Programación Web

**Estudiante:** Tomas Yepes Arboleda  
**Institución:** Institución Universitaria Pascual Bravo  
**Modalidad de esta versión:** individual.

## Objetivo

Practicar Git y GitHub con un proyecto de frontend React creado con Vite.
La aplicación muestra el encabezado `Mi Proyecto Front React`. En la rama
`feature/tomas_yepes`, se agrega el nombre del estudiante dentro de un párrafo.

## Ejecutar

Requiere Node.js 22.12 o posterior compatible con Vite y npm.

```bash
npm ci
npm run dev
```

Abrir la dirección que muestre Vite en la terminal.

```bash
npm run lint
npm run build
npm run preview
```

`node_modules` y `dist` están excluidos mediante `.gitignore`.
`package-lock.json` está incluido para instalar las mismas versiones.

## Ramas y pull requests

1. `main`: proyecto base con el encabezado solicitado.
2. `stage`: creada desde `main`.
3. `develop`: creada desde `stage`.
4. `feature/tomas_yepes`: creada desde `develop`; agrega el nombre.

El cambio debe integrarse en GitHub mediante estos tres pull requests,
en este orden:

| Rama de origen (compare) | Rama destino (base) | Cambio |
| --- | --- | --- |
| `feature/tomas_yepes` | `develop` | Agregar el nombre del estudiante |
| `develop` | `stage` | Integrar el trabajo terminado |
| `stage` | `main` | Publicar la versión final |

Usar **Create a merge commit** al aceptar cada pull request. Conservar las
cuatro ramas para que el profesor pueda revisarlas.

Esta versión corresponde a un solo integrante. No representa un trabajo de
tres personas ni contiene invitaciones a compañeros. El enunciado solicita
grupos de tres; el profesor debe aceptar la modalidad individual.

## Conceptos de repaso

- **Modified (modificado):** el archivo cambió en la carpeta de trabajo.
- **Staged (preparado):** `git add` seleccionó los cambios para el siguiente commit.
- **Committed (confirmado):** `git commit` guardó esos cambios en el historial local.
- **Rama:** referencia a una línea de trabajo; permite preparar cambios por separado.
- **Push:** envía commits al repositorio remoto.
- **Pull request:** solicitud en GitHub para revisar e integrar una rama en otra.
- **Merge:** combina historiales y cambios de ramas.
- **Fetch:** descarga referencias remotas sin integrar los cambios en la rama actual.
- **Status:** muestra cambios preparados, modificados y archivos sin seguimiento.
- **Diff:** muestra las diferencias entre versiones.

## Entrega

El punto 10 solicita subir a Classroom un archivo `.txt` con los integrantes
y el enlace del repositorio público de GitHub. En esta versión se declara un
solo integrante. Antes de entregar, el repositorio debe estar publicado,
los tres pull requests deben estar fusionados y `main` debe mostrar el nombre.
