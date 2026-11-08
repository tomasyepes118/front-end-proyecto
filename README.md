# FloatMate · Laboratorio III del PPI

Programación Web · Institución Universitaria Pascual Bravo

Equipo del PPI: Tomás Yepes Arboleda, Cristian Benites y Mateo Gallo.

FloatMate permite administrar la operación de una terminal. Esta rama conserva la interfaz de React y Vite del [Laboratorio II](https://github.com/tomasyepes118/front-end-proyecto/tree/laboratorio-ii-ppi) y la conecta a un backend con Node.js, Express y MongoDB. MongoDB guarda los catálogos, viajes, controles, abastecimientos, incidentes y auditoría. Las cuentas son de demostración.

## 1. Instalar

Usa Node.js 22.12 o posterior. En una terminal de VS Code:

```powershell
git clone -b laboratorio-iii-ppi https://github.com/tomasyepes118/front-end-proyecto.git
cd front-end-proyecto
npm ci
npm --prefix backend ci
Copy-Item backend/.env.example backend/.env
```

En macOS o Linux usa `cp backend/.env.example backend/.env` para el último paso.

## 2. Conectar MongoDB Atlas

1. En [MongoDB Atlas](https://cloud.mongodb.com/), abre un clúster y crea un usuario de base de datos con permiso de lectura y escritura sobre `floatmate_ppi`.
2. Agrega la IP del computador donde vas a ejecutar Node.js a la lista de acceso de red del proyecto de Atlas.
3. Desde **Connect → Drivers**, copia la URI y reemplaza `<password>` por la contraseña del usuario de base de datos. Codifica los caracteres reservados de la contraseña para una URI.
4. Abre `backend/.env` y pega la URI en `MONGODB_URI`. Conserva `MONGODB_DB=floatmate_ppi`. Al arrancar, la aplicación crea las colecciones y carga los datos de ejemplo una sola vez.

```dotenv
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=floatmate_ppi
PORT=3001
DEMO_PASSWORD=floatmate123
COOKIE_SECURE=0
```

`DEMO_PASSWORD` es la clave local de las tres cuentas de prueba. Usa una contraseña propia para el usuario de MongoDB y guarda la URI en tu `.env`. Para servir la aplicación sobre HTTPS, configura `COOKIE_SECURE=1`.

Para una prueba local con MongoDB, el servidor debe estar configurado como réplica, incluso si tiene un solo nodo. Las operaciones y la auditoría se escriben dentro de una transacción.

[Documentación oficial para conectar a un clúster](https://www.mongodb.com/es/docs/atlas/connect-to-database-deployment/)

## 3. Ejecutar

En una terminal inicia el backend:

```powershell
npm --prefix backend run dev
```

En otra terminal, desde la raíz, inicia React:

```powershell
npm run dev
```

Abre la URL que muestre Vite. Normalmente es `http://localhost:5173`. Si cambias el puerto de la API, inicia Vite con la variable de entorno `FLOATMATE_API` apuntando a esa dirección.

También puedes generar la compilación con `npm run build` y ejecutar `npm --prefix backend start`. En ese caso abre `http://localhost:3001` para ver React y la API desde el mismo servidor.

| Usuario | Permisos |
| --- | --- |
| `admin` | Gestiona catálogos, opera los viajes y consulta la auditoría. |
| `operador` | Consulta catálogos, gestiona viajes y registra abastecimientos e incidentes. |
| `consulta` | Consulta el resumen y los reportes. |

## 4. Recorrer el laboratorio

1. Abre `http://localhost:3001/api/salud` y comprueba que la respuesta incluya `"estado":"ok"` y la base `floatmate_ppi`.
2. Ingresa como `admin`, registra un vehículo y recarga la página. El registro debe seguir en el listado.
3. Programa un viaje. Intenta iniciarlo antes del control de salida para comprobar el bloqueo. Registra un control aprobado con un ticket ficticio, inicia el viaje y ciérralo.
4. Revisa Auditoría y descarga el CSV en Reportes. Inicia sesión como `consulta` para comprobar que el acceso es de lectura.

La rama empieza con el catálogo de ejemplo. Los registros de prueba que cada navegador guardaba en el Laboratorio II quedan en ese navegador.

## Organización del código

| Ruta | Responsabilidad |
| --- | --- |
| `backend/src/server.js` | Inicio de Express, rutas de la API y respuestas de error. |
| `backend/src/db.js` | Conexión, colecciones, datos de ejemplo y transacciones. |
| `backend/src/auth.js` | Inicio y cierre de sesión y permisos de los roles. |
| `backend/src/operacion.js` y `validacion.js` | Reglas de negocio y validación de datos en el servidor. |
| `src/lib/api.js` | Peticiones del frontend a la API. |
| `src/pages/` y `src/components/` | Pantallas y formularios de React del Laboratorio II. |

El laboratorio se probó con una instancia local de MongoDB. Para ejecutar la prueba en tu clúster debes configurar Atlas como se indica arriba. El código del backend se preparó con apoyo de IA. La guía del curso pide que el equipo acredite aparte la estructura inicial, un módulo, la instalación de librerías y la primera conexión hechos sin IA.
