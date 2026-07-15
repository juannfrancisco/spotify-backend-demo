# Etapa 1: Build de Angular
FROM node:22.13.0-alpine AS base

# Establecer variables de entorno (gestionadas por set-env)
# set-env:args:start
ARG NODE_ENV=""
ARG PRODUCTION=""
ARG BACKEND_URL=""
ARG GOOGLE_AUTH_CLIENT_ID=""
# set-env:args:end

# Crear y usar el directorio de la app
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias (incluidas dev) usando npm ci
RUN npm ci --include=dev

# Copiar el resto del código fuente
COPY . .

# Variables de entorno disponibles para la compilación (gestionadas por set-env)
# set-env:env:start
ENV NODE_ENV=${NODE_ENV}
ENV PRODUCTION=${PRODUCTION}
ENV BACKEND_URL=${BACKEND_URL}
ENV GOOGLE_AUTH_CLIENT_ID=${GOOGLE_AUTH_CLIENT_ID}
# set-env:env:end

# Compilar la app Angular para producción
RUN npm run build:production

# Etapa 2: Imagen final usando NGINX para servir los archivos
FROM nginx:1.15 AS final

# Copiar archivos compilados desde el builder
COPY --from=base /app/dist/browser/ /usr/share/nginx/html/

# Copiar configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto de NGINX
CMD ["nginx", "-g", "daemon off;"]
