# Build stage
FROM node:22.16.0-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN mkdir -p /var/cache/nginx /var/run/nginx \
    && chown -R appuser:appgroup /var/cache/nginx /var/run/nginx /usr/share/nginx/html

COPY --from=build /app/build /usr/share/nginx/html


EXPOSE 80

USER appuser

CMD ["nginx", "-g", "daemon off;"]
