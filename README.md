# Demo Spotify — Universidad de Chile 2026

Aplicación Angular que simula una plataforma de música al estilo Spotify, desarrollada como demo para la Universidad de Chile 2026. Construida sobre el template Angular de Zenta.

## Descripción

La aplicación permite explorar artistas, canciones y playlists. Incluye autenticación con Google y una interfaz pública con listados interactivos de contenido musical.

### Funcionalidades principales

- **Explorar artistas**: listado con información de país, género musical y oyentes mensuales
- **Explorar canciones**: listado con duración, reproducciones y artista asociado
- **Playlists**: visualización y creación de playlists mediante modal
- **Autenticación con Google**: login usando Google Identity Services (GSI)
- **Tema claro/oscuro**: persistido en sesión

## Requisitos Previos

- **Node.js**: 22.x o superior
- **npm**: 10.x o superior
- **Angular CLI**: 19.x (`npm install -g @angular/cli`)

## Instalación

```bash
npm install
npm start
```

La aplicación estará disponible en `https://localhost:4200/`.

## Scripts Disponibles

| Script | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo con SSL |
| `npm run build` | Build de producción |
| `npm test` | Pruebas unitarias |
| `npm run lint` | Análisis ESLint |
| `npm run lint:css` | Análisis Stylelint |

## Estructura del Proyecto

```
src/app/
├── core/
│   ├── auth/              # Autenticación JWT
│   ├── guards/            # AuthGuard para rutas privadas
│   ├── interceptors/      # Auth, Loading, HttpError
│   ├── models/            # Artista, Cancion, Playlist, etc.
│   └── services/          # Artistas, Canciones, Playlists, Theme, Loading
├── features/
│   ├── public/
│   │   ├── home/          # Página principal con listas y modal de playlist
│   │   │   └── components/
│   │   │       ├── lista-artistas/
│   │   │       ├── lista-canciones/
│   │   │       ├── lista-playlists/
│   │   │       └── nueva-playlist-modal/
│   │   └── login/         # Login con Google
│   └── private/
│       ├── home/          # Dashboard autenticado
│       └── generic/       # CRUD de ejemplo
├── layout/                # Navbar, Sidebar, Footer, BottomNavbar
└── shared/                # Tabla, Dialog, Scorecard, Breadcrumb, etc.
```

## Modelos de Dominio

### Artista

```typescript
interface Artista {
  id: number;
  nombre: string;
  biografia: string;
  pais: string;
  generoMusical: string[];
  oyentesMensuales: number;
  tipo: string;
  verificado: boolean;
}
```

### Cancion

```typescript
interface Cancion {
  id: number;
  nombre: string;
  duracion: number;
  reproducciones: number;
  generoMusical: string[];
  artista: Artista;
  album: string;
}
```

### Playlist

Ver `src/app/core/models/playlist.model.ts`.

## Autenticación

- Login vía **Google Identity Services** (`GoogleAuthService`)
- Tokens JWT manejados por `AuthService` con `@auth0/angular-jwt`
- `AuthGuard` protege todas las rutas privadas bajo `/template-angular`

## Variables de Entorno

Definidas en `config/environment.yaml` y generadas con `set-env.js` en `src/environments/`.

```bash
# Generar archivos de entorno para desarrollo
npm run set-env -- --environment development

# Generar para producción
npm run set-env -- --environment production
```

## Docker

```bash
docker build -t demo-spotify:latest .
docker run -p 80:80 demo-spotify:latest
```

## Despliegue

El proyecto está configurado para Google Cloud Run mediante Cloud Build:

```bash
gcloud builds submit --config=cloudbuild.yaml
```

## Tecnologías

- **Angular 19** — framework principal
- **Tailwind CSS** — estilos
- **Angular Material** — componentes UI
- **ApexCharts** — gráficos
- **@auth0/angular-jwt** — manejo de JWT
- **Google Identity Services** — autenticación social
- **ngx-sonner** — notificaciones
- **ngx-spinner** — indicadores de carga

## Convenciones de Commits

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: nueva funcionalidad
- `fix`: corrección de error
- `docs`: documentación
- `refactor`: refactorización
- `test`: pruebas
- `chore`: mantenimiento
