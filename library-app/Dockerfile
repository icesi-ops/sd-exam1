# Use node.js image as the base image
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use nginx image as the base image for serving static files
FROM nginx:alpine

# Copy the built app from the previous stage to the nginx web root directory
COPY --from=build /app/dist /usr/sha