# Use node.js image as the base image
FROM node:18 AS build
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install
# Install Axios
RUN npm install axios
RUN npm install koa2-cors --save-dev
# Copy the rest of the application code to the working directory
COPY . .
EXPOSE 5173
# Build the application
RUN npm run build 


# Stage 2
# Use nginx image as the base image for serving static files
FROM nginx:alpine
ADD ./config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/app/
EXPOSE 80
CMD ["nginx","-g", "daemon off;"]
