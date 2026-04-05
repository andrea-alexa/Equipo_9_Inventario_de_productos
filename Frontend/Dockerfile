# Etapa 1: Build Angular
FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine

# Copiar build al servidor web
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]