FROM node:22.16.0-alpine

# Create and switch to a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm install 

# Copy remaining app files
COPY . .

# Expose backend port
EXPOSE 5000

USER appuser

CMD ["npm", "start"]
