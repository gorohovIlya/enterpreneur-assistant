# Этап 1: Сборка Angular-приложения
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Этап 2: Раздача статики через Nginx
FROM nginx:alpine
# В новых версиях Angular сборка попадает в dist/<имя-проекта>/browser
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
