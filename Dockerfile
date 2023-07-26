# Stage 1: Build the Vite React app
FROM node:14 as build
WORKDIR /app
COPY package.json package-lock.json* yarn.lock ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create a lightweight production image from the build files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
