# Prompts para IA - Template Angular Tailwind CSS

Este documento contiene prompts optimizados para usar este template Angular con Tailwind CSS de manera eficiente con asistentes de IA como GitHub Copilot, ChatGPT, Claude, etc.

## 📋 Tabla de Contenidos

- [Prompts Generales](#prompts-generales)
- [Creación de Módulos CRUD](#creación-de-módulos-crud)
- [Generación de Formularios](#generación-de-formularios)
- [Creación de Listas y Tablas](#creación-de-listas-y-tablas)
- [Interceptors HTTP](#interceptors-http)
- [Alertas y Notificaciones](#alertas-y-notificaciones)
- [Servicios y API](#servicios-y-api)
- [Rutas y Navegación](#rutas-y-navegación)
- [Componentes UI](#componentes-ui)
- [Guards y Seguridad](#guards-y-seguridad)


---

## Prompts Generales

### 🔄 Analizar Estructura del Proyecto

**Prompt para copiar:**

> Analiza la estructura de este template Angular con Tailwind CSS y explica:
>
> 1. La arquitectura de carpetas (core, features, shared, layout)
> 2. Los componentes reutilizables disponibles (CreateComponent, EditComponent, DetailComponent, ListComponent)
> 3. Los servicios core vs feature services (GenericService, AuthService, etc.)
> 4. El sistema de rutas lazy loading con standalone components
> 5. La configuración de Tailwind CSS y el sistema de estilos
>
> Context: Este es un template Angular 19 con Tailwind CSS que usa standalone components, signals, reactive forms y arquitectura modular.

### 🧩 Entender Componentes Existentes

**Prompt para copiar:**

> Revisa los siguientes componentes del template y explica cómo usarlos:
>
> - GenericService (servicio base para operaciones CRUD)
> - CreateComponent, EditComponent, DetailComponent, ListComponent (componentes base)
> - AuthService y AuthGuard (sistema de autenticación)
> - LoadingInterceptor y AuthInterceptor (interceptors HTTP)
> - MenuService (navegación dinámica)
>
> Incluye ejemplos de implementación en nuevos componentes y explica las interfaces ICreate, IEdit, IDetail, IList.

---

## Creación de Módulos CRUD

### 📝 Crear Módulo Completo desde JSON

**Prompt para copiar:**

> Basándome en este template Angular con Tailwind CSS, crea un módulo CRUD completo para [NOMBRE_ENTIDAD] usando esta respuesta JSON como referencia:
>
> **JSON de ejemplo:**
>
> ```json
> [TU_JSON_RESPONSE_AQUÍ]
> ```
>
> **Necesito:**
>
> 1. Model interface en `src/app/features/private/[entidad]/models/`
> 2. Service extendiendo GenericService en `src/app/features/private/[entidad]/services/`
> 3. Componente lista implementando IList en `src/app/features/private/[entidad]/components/[entidad]-list/`
> 4. Componente crear implementando ICreate en `src/app/features/private/[entidad]/components/[entidad]-create/`
> 5. Componente editar implementando IEdit en `src/app/features/private/[entidad]/components/[entidad]-edit/`
> 6. Componente detalle implementando IDetail en `src/app/features/private/[entidad]/components/[entidad]-detail/`
> 7. Archivo de rutas `[entidad].routes.ts` con lazy loading
> 8. Actualización del menú en `menu.service.ts`
>
> Usa signals para reactividad, reactive forms, Tailwind CSS para estilos y sigue las convenciones del template.

### 🔨 Generar Solo el Modelo

**Prompt para copiar:**

> Basándome en esta respuesta JSON de API, genera el modelo TypeScript para la entidad [NOMBRE_ENTIDAD]:
>
> **JSON de ejemplo:**
>
> ```json
> [TU_JSON_RESPONSE_AQUÍ]
> ```
>
> El archivo debe ir en `src/app/features/private/[entidad]/models/[entidad].model.ts` y seguir las convenciones del template. Incluye:
>
> 1. Interface principal con propiedades tipadas
> 2. Interfaces para Create, Update, List si son diferentes
> 3. Enums para valores fijos
> 4. Validaciones de tipos estrictas
> 5. Documentación JSDoc

---

## Generación de Formularios

### 📝 Formulario Reactivo desde Modelo

**Prompt para copiar:**

> Usando el modelo [NOMBRE_MODELO] existente y siguiendo el patrón de CreateComponent/EditComponent, crea un componente formulario reactivo que incluya:
>
> **Características requeridas:**
>
> 1. FormBuilder con FormGroup y validaciones apropiadas
> 2. Template HTML con Tailwind CSS classes (form-control, btn, card, etc.)
> 3. Manejo de errores y validaciones reactivas
> 4. Loading states con signals
> 5. Integración con GenericService
> 6. Navegación después de guardar
> 7. Confirmación antes de salir si hay cambios
>
> El formulario debe manejar: [LISTAR_CAMPOS_ESPECÍFICOS]
>
> **Ubicación:** `src/app/features/private/[entidad]/components/[entidad]-form/`

### 🔍 Validaciones Personalizadas

**Prompt para copiar:**

> Crea validaciones personalizadas para el formulario [NOMBRE_FORMULARIO]:
>
> **Validadores a implementar:**
>
> 1. Validador de email personalizado con dominio específico
> 2. Validador de fecha que no permita fechas futuras
> 3. Validador de campo numérico con rango específico
> 4. Validador de campo obligatorio condicional
> 5. Validador async para verificar unicidad
>
> **Ubicación:** `src/app/shared/validators/`
>
> Implementa siguiendo el patrón de reactive forms del template y usa signals para reactividad.

---

## Creación de Listas y Tablas

### 📊 Lista con Tabla Responsiva

**Prompt para copiar:**

> Basándome en el ListComponent, crea un componente lista para [NOMBRE_ENTIDAD] que incluya:
>
> **Características requeridas:**
>
> 1. Tabla responsiva con Tailwind CSS
> 2. Columnas: [ESPECIFICAR_COLUMNAS]
> 3. Paginación server-side
> 4. Búsqueda en tiempo real con debounce
> 5. Filtros avanzados
> 6. Ordenamiento por columnas
> 7. Loading skeleton con Tailwind
> 8. Acciones: ver, editar, eliminar
> 9. Confirmación para eliminación
> 10. Manejo de errores con signals
>
> La tabla debe ser responsive y usar el patrón del template existente.
>
> **Ubicación:** `src/app/features/private/[entidad]/components/[entidad]-list/`

### 🔍 Filtros Avanzados

**Prompt para copiar:**

> Extiende el componente lista [NOMBRE_COMPONENTE] para incluir filtros avanzados:
>
> **Filtros a implementar:**
>
> 1. Filtro por rango de fechas (date picker)
> 2. Filtro por estado (select dropdown)
> 3. Filtro por categoría (multi-select)
> 4. Búsqueda en tiempo real con debounce
> 5. Reset de filtros
> 6. Guardado de filtros en localStorage
>
> Usa signals para el estado reactivo, reactive forms para los filtros y Tailwind CSS para styling.

---

## Interceptors HTTP

### 🚀 Interceptor Específico

**Prompt para copiar:**

> Basándome en los interceptors existentes del template (auth.interceptor.ts, loading.interceptor.ts), crea un nuevo interceptor para:
>
> **Configuración:**
>
> - Propósito: [DESCRIBIR_PROPÓSITO]
> - Endpoints afectados: [LISTAR_ENDPOINTS]
>
> **El interceptor debe:**
>
> 1. Seguir el patrón HttpInterceptorFn (función)
> 2. Incluir manejo de errores específicos
> 3. Log de requests/responses para debugging
> 4. Integración con LoadingService
> 5. Manejo de retry automático
> 6. Headers personalizados si es necesario
>
> **Ubicación:** `src/app/core/interceptors/[nombre].interceptor.ts`
>
> ⚠️ No olvides agregarlo al app.config.ts en provideHttpClient

### 📡 Interceptor de Cache

**Prompt para copiar:**

> Crea un interceptor de cache HTTP que:
>
> **Funcionalidades:**
>
> 1. Cache responses GET por tiempo configurable
> 2. Invalide cache en operaciones POST/PUT/DELETE
> 3. Excluya endpoints específicos del cache
> 4. Use Map para almacenamiento en memoria
> 5. Implemente TTL (Time To Live)
> 6. Headers de cache control
>
> Integra con el sistema de interceptors existente del template siguiendo el patrón functional.

---

## Alertas y Notificaciones

### 🔔 Sistema de Notificaciones Toast

**Prompt para copiar:**

> Crea un sistema de notificaciones toast para el template:
>
> **Características requeridas:**
>
> 1. Service para gestionar notificaciones
> 2. Componente visual con Tailwind CSS
> 3. Tipos: success, error, warning, info
> 4. Auto-dismiss configurable
> 5. Queue de notificaciones
> 6. Posicionamiento configurable (top-right, top-left, etc.)
> 7. Animaciones de entrada/salida
> 8. Integración con interceptors para notificaciones automáticas
>
> **Ubicación:** `src/app/shared/components/toast/`
>
> Usa signals para reactividad y mantén consistencia con el design system.

### ⚡ Modales de Confirmación

**Prompt para copiar:**

> Extiende el sistema para incluir modales de confirmación:
>
> **Tipos a implementar:**
>
> 1. Modal de confirmación simple (Sí/No)
> 2. Modal de confirmación con input de texto
> 3. Modal de confirmación con countdown
> 4. Modal de información con iconos personalizados
> 5. Modal de progreso para operaciones largas
>
> Usa Tailwind CSS para styling, signals para estado y mantén la accesibilidad (ARIA).

---

## Servicios y API

### 🌐 Service HTTP Especializado

**Prompt para copiar:**

> Basándome en el GenericService, crea un service para [NOMBRE_ENTIDAD] que incluya:
>
> **Métodos requeridos:**
>
> 1. Métodos CRUD básicos extendidos de GenericService
> 2. Métodos de búsqueda y filtrado específicos
> 3. Manejo de paginación con PagedResult
> 4. Upload de archivos si es necesario
> 5. Export de datos (CSV, Excel, PDF)
> 6. Métodos específicos del dominio: [LISTAR_MÉTODOS_ESPECÍFICOS]
>
> **Endpoints:**
>
> - GET /api/[entidad] (con filtros y paginación)
> - GET /api/[entidad]/:id
> - POST /api/[entidad]
> - PUT /api/[entidad]/:id
> - DELETE /api/[entidad]/:id
> - [ENDPOINTS_ESPECÍFICOS]
>
> **Ubicación:** `src/app/features/private/[entidad]/services/[entidad].service.ts`

### 🔧 Service con Cache Local

**Prompt para copiar:**

> Extiende el service [NOMBRE_SERVICE] para incluir:
>
> **Características de cache:**
>
> 1. Cache en memoria con Map
> 2. TTL (Time To Live) configurable
> 3. Invalidación automática de cache
> 4. Refresh manual de datos
> 5. Estado de loading con signals
> 6. Optimistic updates para mejor UX
> 7. Sincronización con servidor
>
> Mantén la compatibilidad con el patrón GenericService del template.

---

## Rutas y Navegación

### 🛣️ Nuevas Rutas Lazy Loading

**Prompt para copiar:**

> Agrega rutas lazy loading para el módulo [NOMBRE_MÓDULO]:
>
> **Tareas requeridas:**
>
> 1. Crea archivo `[modulo].routes.ts` con rutas específicas
> 2. Configura lazy loading en `app.routes.ts`
> 3. Implementa AuthGuard para protección
> 4. Agrega títulos de página dinámicos
> 5. Actualiza menú en `menu.service.ts`
> 6. Configura breadcrumbs si es necesario
>
> **Rutas requeridas:**
>
> - /[modulo] (redirect a lista)
> - /[modulo]/list (lista)
> - /[modulo]/create (crear)
> - /[modulo]/edit/:id (editar)
> - /[modulo]/detail/:id (detalle)
>
> Sigue el patrón de standalone components y lazy loading del template.

### 🧭 Navegación Dinámica

**Prompt para copiar:**

> Extiende el MenuService para incluir navegación dinámica:
>
> **Funcionalidades:**
>
> 1. Menús basados en permisos de usuario
> 2. Badges de notificación en elementos del menú
> 3. Submenús colapsables
> 4. Iconos dinámicos con Heroicons/Tabler
> 5. Breadcrumbs automáticos
> 6. Estados activos inteligentes
>
> Mantén la integración con el AuthService y usa signals para reactividad.

---

## Componentes UI

### 🎨 Componente Reutilizable

**Prompt para copiar:**

> Basándome en los componentes shared del template, crea un componente [NOMBRE_COMPONENTE] que:
>
> **Especificaciones:**
>
> - Funcionalidad: [DESCRIBIR_FUNCIONALIDAD]
> - Props: [LISTAR_PROPS]
> - Eventos: [LISTAR_EVENTOS]
>
> **Características técnicas:**
>
> 1. Sea standalone component
> 2. Use signals para reactividad
> 3. Tenga inputs/outputs tipados
> 4. Incluya documentación JSDoc
> 5. Use Tailwind CSS para styling
> 6. Sea responsive y accesible
> 7. Incluya estados de loading y error
>
> **Ubicación:** `src/app/shared/components/[nombre]/`

### 🔍 Componente de Búsqueda Avanzada

**Prompt para copiar:**

> Crea un componente de búsqueda reutilizable que incluya:
>
> **Características:**
>
> 1. Input de texto con debounce usando signals
> 2. Filtros dropdown configurables
> 3. Selector de rango de fechas
> 4. Tags de filtros aplicados
> 5. Reset de filtros con un click
> 6. Output con filtros aplicados en tiempo real
> 7. Estados de loading con skeleton
> 8. Guardado de filtros en localStorage
>
> Debe integrarse fácilmente con los ListComponents y usar Tailwind CSS para styling.

---

## Guards y Seguridad

### 🔒 Guard de Permisos

**Prompt para copiar:**

> Crea un guard de permisos basado en el AuthGuard existente:
>
> **Funcionalidades:**
>
> 1. Verificación de permisos específicos por ruta
> 2. Verificación de roles de usuario
> 3. Guard para operaciones CRUD específicas
> 4. Redirección a página de acceso denegado
> 5. Integración con el AuthService
> 6. Cache de permisos para performance
>
> **Ubicación:** `src/app/core/guards/permission.guard.ts`
>
> El guard debe verificar: [LISTAR_PERMISOS_ESPECÍFICOS]

### 🚪 Guard de Salida con Cambios

**Prompt para copiar:**

> Implementa un guard CanDeactivate para formularios:
>
> **Características:**
>
> 1. Detecta cambios no guardados en formularios
> 2. Muestra modal de confirmación antes de salir
> 3. Integración con reactive forms
> 4. Manejo de rutas y refresh del navegador
> 5. Estados personalizables
>
> Debe funcionar con los componentes CreateComponent y EditComponent del template.

---

## 💡 Tips para usar estos Prompts

### ✅ Mejores Prácticas

1. **Reemplaza las variables**: Cambia `[NOMBRE_ENTIDAD]`, `[TU_JSON_RESPONSE_AQUÍ]`, etc. con valores reales
2. **Proporciona contexto**: Incluye información específica de tu proyecto
3. **Sé específico**: Detalla requirements particulares para mejores resultados
4. **Itera**: Usa los resultados como base para refinamientos adicionales
5. **Mantén consistencia**: Siempre referencia el patrón del template existente
6. **Usa TypeScript estricto**: Aprovecha el tipo checking del template
7. **Implementa signals**: Usa la reactividad moderna de Angular

### 📝 Variables Comunes a Reemplazar

- `[NOMBRE_ENTIDAD]`: Nombre de la entidad (ej: "usuario", "producto", "pedido")
- `[NOMBRE_MÓDULO]`: Nombre del módulo (ej: "usuarios", "productos", "pedidos")
- `[NOMBRE_COMPONENTE]`: Nombre del componente específico
- `[TU_JSON_RESPONSE_AQUÍ]`: Respuesta JSON real de tu API
- `[DESCRIBIR_PROPÓSITO]`: Descripción específica del propósito
- `[LISTAR_CAMPOS_ESPECÍFICOS]`: Lista de campos del formulario
- `[ESPECIFICAR_COLUMNAS]`: Columnas específicas de la tabla
- `[LISTAR_ENDPOINTS]`: Lista de endpoints afectados

## 📚 Recursos Adicionales

### 🔍 Referencias del Template

- **Generic Components**: `/src/app/shared/components/generic/` - Componentes base CRUD
- **Core Services**: `/src/app/core/services/` - GenericService, AuthService, etc.
- **Shared Components**: `/src/app/shared/components/` - Componentes reutilizables
- **Layout**: `/src/app/layout/` - Estructura y navegación
- **Interceptors**: `/src/app/core/interceptors/` - Interceptors HTTP
- **Guards**: `/src/app/core/guards/` - Guards de autenticación

### 📖 Documentación Angular

- [Angular 19 Signals](https://angular.io/guide/signals)
- [Standalone Components](https://angular.io/guide/standalone-components)
- [Reactive Forms](https://angular.io/guide/reactive-forms)
- [HTTP Interceptors](https://angular.io/guide/http-interceptor-use-cases)
- [Functional Guards](https://angular.io/guide/router-tutorial-toh#milestone-5-route-guards)

### 🎨 Documentación Tailwind CSS

- [Tailwind CSS Components](https://tailwindcss.com/docs)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Form Styling](https://tailwindcss.com/docs/forms)

---

> **Nota**: Estos prompts están optimizados para este template específico Angular 19 + Tailwind CSS. Adapta según las necesidades de tu proyecto manteniendo las convenciones establecidas de standalone components, signals y reactive forms.