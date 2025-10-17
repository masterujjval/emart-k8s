# Stage 1: Build Angular app
FROM node:14 AS web-build
WORKDIR /usr/src/app
COPY ./ ./client
RUN cd client && npm install && npm run build --prod

# Stage 2: Serve with non-root NGINX
FROM bitnami/nginx:latest

# Copy built Angular app to NGINX public directory
COPY --from=web-build /usr/src/app/client/dist/client/ /app

# Replace default NGINX config
#COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/default.conf
COPY nginx.conf /opt/bitnami/nginx/conf/nginx.conf


EXPOSE 80
EXPOSE 4200
