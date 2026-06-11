# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code files
COPY . .

# Setup optional build arguments for API URLs (default to localhost API)
ARG REACT_APP_API_BASE_URL=http://localhost:8080/api
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the app
RUN npm run build

# Production serve stage using Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Clean the default public folder
RUN rm -rf ./*

# Copy build artifacts from previous stage
COPY --from=build /app/build .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
