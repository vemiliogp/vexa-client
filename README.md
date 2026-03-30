# Client

Aplicación frontend construida con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS 4**. Provee la interfaz de usuario para autenticación, gestión de conexiones a bases de datos, conversaciones, interacción por voz e insights generados por IA.

## Requisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (recomendado) o npm

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/vemiliogp/vexa-client.git
   cd vexa-client
   ```

2. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno (si es necesario):**

   El cliente se conecta a la API en `http://localhost:8000` por defecto. Si tu API corre en otro host o puerto, creá un archivo `.env`:

   ```bash
   VITE_API_URL=http://localhost:8000
   ```

4. **Asegurate de que la API esté corriendo:**

   El cliente depende del backend Vexa API. Consultá el [README de la API](../api/README.md) para las instrucciones de configuración.

## Ejecución

### Servidor de desarrollo

```bash
pnpm dev
```

La app estará disponible en `http://localhost:5173` con hot module replacement (HMR) habilitado.

### Build de producción

```bash
pnpm build
```

## Scripts disponibles

- **`pnpm dev`** – Iniciar el servidor de desarrollo con HMR.
- **`pnpm build`** – Verificar tipos y compilar la aplicación para producción.
- **`pnpm lint`** – Ejecutar ESLint sobre el código.
- **`pnpm preview`** – Previsualizar el build de producción localmente.

## Stack tecnológico

- **React 19** – Librería de UI
- **TypeScript 5.9** – JavaScript con tipado estático
- **Vite 7** – Herramienta de build y servidor de desarrollo
- **Tailwind CSS 4** – Framework CSS utility-first
- **React Router 7** – Enrutamiento del lado del cliente
- **TanStack Query** – Manejo de estado del servidor y data fetching
- **Zustand** – Manejo de estado del cliente
- **React Hook Form + Zod** – Manejo de formularios y validación
- **Axios** – Cliente HTTP
- **Radix UI** – Primitivos de UI accesibles
- **Lucide React** – Librería de íconos

## Estructura del proyecto

```plaintext
src/
  main.tsx                   # Punto de entrada de la aplicación
  App.tsx                    # Definición de rutas
  App.css                    # Estilos globales
  index.css                  # Imports de Tailwind CSS
  assets/                    # Archivos estáticos (imágenes, fuentes)
  components/
    ui/                      # Componentes de UI reutilizables (shadcn/ui)
  layouts/
    Auth/                    # Layout de autenticación
    Home/                    # Layout principal con navegación
  pages/
    Login/                   # Página de inicio de sesión
    Register/                # Página de registro
    Connections/             # Gestión de conexiones a bases de datos
    Conversations/           # Lista de conversaciones
    Voice/                   # Página de interacción por voz
    Insights/                # Página de insights generados por IA
  services/
    api-client.ts            # Instancia y configuración de Axios
    auth.ts                  # Llamadas a la API de autenticación
    connections.ts           # Llamadas a la API de conexiones
    conversations.ts         # Llamadas a la API de conversaciones
    insights.ts              # Llamadas a la API de insights
  store/
    auth.ts                  # Estado de autenticación (Zustand)
    insights.ts              # Estado de insights (Zustand)
  lib/
    utils.ts                 # Funciones utilitarias (helper cn)
public/                      # Archivos públicos estáticos
components.json              # Configuración de shadcn/ui
vite.config.ts               # Configuración de Vite
tsconfig.json                # Configuración de TypeScript
eslint.config.js             # Configuración de ESLint
```

## Licencia

Este proyecto está licenciado bajo los términos de la Licencia ISC.
