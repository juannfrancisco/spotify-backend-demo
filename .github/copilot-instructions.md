# Copilot Instructions - Zenta Angular Tailwind Template

## Project Architecture Overview

This is an Angular 19 template with Tailwind CSS using standalone components, signals, and feature-based architecture.

### Core Structure
- **Core (`src/app/core/`)**: Global services, auth, guards, interceptors, and shared models
- **Features (`src/app/features/`)**: Business logic modules (private/public split)
- **Shared (`src/app/shared/`)**: Reusable components, constants, directives, and utils
- **Layout (`src/app/layout/`)**: Navigation shell with navbar, sidebar, and footer

### Key Patterns

#### Authentication & HTTP Flow
- **JWT Authentication**: Tokens stored in sessionStorage via `AuthService`
- **HTTP Interceptor Chain**: `HttpErrorInterceptor` → `AuthInterceptor` → `LoadingInterceptor`
- **Error Handling**: Centralized via `ErrorHandlerService` with standardized error format
- **Route Protection**: `AuthGuard` protects all `/private/*` routes

#### Routing Architecture
```
app.routes.ts
├── /public → PublicRoutes (no auth)
└── /private → LayoutRoutes (with AuthGuard)
    └── PrivateRoutes (lazy-loaded features)
```

**Route Constants**: Use `APP_ROUTES_PATH` and `APP_ROUTES_PATH_MENU` from `@shared/constants/app-routes.constants`

#### Component Patterns
- **Standalone Components**: All components are standalone, no NgModules
- **Signals**: Use `signal()` for reactive state management
- **Reactive Forms**: FormBuilder with validators for all forms
- **Loading States**: Use `signal(true/false)` with skeleton loaders

#### CRUD Pattern Example
```typescript
// Service extending GenericService
@Injectable({ providedIn: 'root' })
export class EntityService extends GenericService<EntityModel> {
  constructor(http: HttpClient) {
    super(http, 'entities');
  }
}

// Component with signals
export class ListEntityComponent {
  records = signal<EntityModel[]>([]);
  isLoading = signal(true);
  
  constructor(private entityService: EntityService) {}
}
```

### Development Guidelines

#### Adding New Features
1. **Create feature structure**: `features/private/[entity]/{models,services,pages,components}`
2. **Define routes**: Create `[entity].routes.ts` with lazy loading
3. **Update menu**: Add items to `shared/constants/menu.ts`
4. **Follow naming**: Use kebab-case for files, PascalCase for classes

#### Path Aliases (Critical)
Always use these aliases instead of relative imports:
- `@core/*` → `src/app/core/*`
- `@shared/*` → `src/app/shared/*`
- `@private/*` → `src/app/features/private/*`
- `@public/*` → `src/app/features/public/*`
- `@layout/*` → `src/app/layout/*`
- `@env` → `src/environments/environment`

#### Tailwind CSS Conventions
- **Form classes**: `form-control`, `btn`, `btn-primary`, `card`, `table-responsive`
- **Layout**: Use grid system `grid-cols-*`, responsive prefixes `sm:`, `md:`, `lg:`
- **Loading**: Skeleton components from `ngx-skeleton-loader`

#### HTTP & Services
- **Extend GenericService**: For CRUD operations with pagination and search
- **Error handling**: Let interceptors handle errors unless `skip-error-handling` header is set
- **Loading states**: Use `LoadingInterceptor` or component-level signals

#### Data Flow
1. **API Response**: Interceptors standardize to `{ code, status, message }` format
2. **Service Layer**: Transform data to models, handle business logic
3. **Component Layer**: Use signals for reactive UI updates
4. **Template**: Bind to signals with `()` syntax, use Tailwind classes

#### Common Components
- **TableComponent**: Configurable data table with pagination, search, actions
- **HeaderContainerComponent**: Page header with title and action buttons
- **DialogService**: For modals, confirmations, and notifications
- **LoadingService**: Global spinner control

### Quick Commands
- `npm start` - Development server with SSL (https://localhost:4200)
- `npm run build` - Production build
- `npm test` - Run unit tests (Karma/Jasmine)
- `npm run test:e2e` - E2E tests (Playwright)
- `npm run prettier` - Format code
- `npm run lint` - ESLint check

### Security Notes
- All private routes protected by `AuthGuard`
- CSRF tokens managed by `AuthService`
- JWT tokens in sessionStorage (consider httpOnly cookies for production)
- Input sanitization handled by Angular

### AI Development Tips
- Reference `IA-PROMPTS.md` for detailed feature generation prompts
- Use the existing CRUD components as templates for new entities
- Always implement proper TypeScript typing with interfaces
- Follow the signal-based reactive pattern consistently
- Maintain the three-layer architecture: Service → Component → Template

