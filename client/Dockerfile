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

COPY --from=build /app/build /usr/share/nginx/html


EXPOSE 80

# Set permissions and switch to non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html
USER appuser

CMD ["nginx", "-g", "daemon off;"]
