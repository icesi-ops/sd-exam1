# Development and Production Environment Setup Guide

This guide will help you set up and containerize the frontend of our application (Library App) using Docker. Make sure to follow each step carefully to achieve a stable development and production environment.

## Development Environment Setup

### Prerequisites

- Docker installed on your VM (or WSL)
- Docker desktop (if u have WSL)
- Visual studio code 

### Steps to Follow

1. Clone the repository https://github.com/luis486/sd-exam1.git .
2. Open a terminal and navigate to the frontend project directory.
3. To view this app in localhost:
  + Change directory to the library-app folder *cd/frontend-project/library-app*
  + npm install (to install libraries to your project)
  + npm run dev (to "deploy" locally)


### Container Configuration

1. Open the `Dockerfile` in a text editor.
2. Ensure that the Dockerfile contains the following:

// Use node.js image as the base image
FROM node:18 AS build
//Set the working directory in the container
WORKDIR /app
//Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./
//Install dependencies
RUN npm install

// Copy the rest of the application code to the working directory
COPY . .

EXPOSE 5173

// Build the application
RUN npm run build 

// Stage 2

// Use nginx image as the base image for serving static files
FROM nginx:alpine
ADD ./config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/app/
COPY consul.sh /consul.sh
RUN chmod +x /consul.sh
EXPOSE 80

CMD ["/consul.sh"]

//The Bash script is designed so that as soon as a front-end instance is launched, it updates in Consul)
   

3. Save the Dockerfile.
4. If you want to create your OWN Dockerfile, you should know that NPM is used as a library for the front-end in React. And NGINX tu create a second front.

### Building and Running the Container

1. Open a terminal in the frontend project directory.
2. Run the following command to build the container image:
   
   docker build -t image_docker .
   (if you have extension Docker in Visual Studio Code, right-click in Dockerfile and build image)

   Replace `image_name` with the name you want to give to your Docker image.

3. Once the image is successfully built, run the following command to run the container:

   docker run -d -p 5173:5173 --network network_name --name container_name image_name 
   
    Replace `container_name` with the name you want to give to your Docker container.
    Replace `image_name` with the name you want to give to your Docker image.
    Replace `network_name` with the name of your network (you need tha netwkor to connect all containers)

   This will run the container and make it accessible at `http://localhost:5173` in your web browser.

You now have the development environment set up and running on your machine.

## Production Environment Setup

### Steps to Follow

1. Follow the same container configuration steps as described in the development section.
2. Make sure to use the built image for production (`image_name`) when running the container on your production server.
