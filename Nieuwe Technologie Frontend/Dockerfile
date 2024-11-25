FROM node:21 AS builder

WORKDIR /app

COPY package.json .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Copy the built React app from the builder stage to Nginx's web server directory
COPY --from=builder /app/dist /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 54545 (Note: This is only for documentation purposes)
EXPOSE 50545

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]