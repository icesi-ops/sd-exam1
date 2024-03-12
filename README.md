# Luchops & Danilops library

### Prerequisites

- Docker installed on your VM (or WSL)
- Docker desktop (if u have WSL)
- Visual studio code

### Steps to Follow

1. Clone the repository https://github.com/luis486/sd-exam1.git .

# SAMBA AND DOCKER VOLUME

### Development and Production Environment Setup Guide

This guide will help you set up and containerize the samba connected with a docker volume of our application using Docker. Make sure to follow each step carefully to achieve a stable development and production environment.

### Container Configuration

1. Open a terminal and navigate to the samba directory.
2. Open the `Dockerfile` in a text editor.
3. Ensure that the Dockerfile contains the following:

   ```Dockerfile
    # Usa una imagen base de Samba
    FROM dperson/samba:latest

    # Copia el archivo de configuración de Samba al contenedor
    COPY smb.conf /etc/samba/smb.conf

    # Comprueba si la carpeta compartida existe antes de crearla
    RUN test -d /home/storage_data_smb || mkdir -p /home/storage_data_smb

    # Expone el puerto de Samba
    EXPOSE 139 445

    # Comando para ejecutar el servicio de Samba
    CMD ["smbd", "--foreground", "--no-process-group"]

   ```

4. Save the Dockerfile.
5. If you wish to make any changes to `smb.conf` you can change the configuration in which a specific user name is given permission and a path is given to a folder to save files for samba.

   ```smb.conf
    [centralized_storage]
    comment = Shared directory
    path = /home/storage_data_smb
    browsable = yes
    guest ok = yes
    valid users = @backend_user
    read only = no
   ```

### Building and Running the Container

1.  Open a terminal in the samba project directory.
2.  Run the following command to build the container image:

    docker build -t image_docker .

    example: docker build -t sambadb .

    (if you have extension Docker in Visual Studio Code, right-click in Dockerfile and build image)

    Replace `image_name` with the name you want to give to your Docker image.

3.  Now a Docker volume unit will be created with the following command:

        docker volume create name_volume

        example: docker volume create sambaVolume

    Replace `name_volume` with the name you want to give to your Docker Volume

4.  Once the image is successfully built, run the following command to run the container:

        docker run -dit -p 139:139 -p 445:445 --name container_name --network network_name -v name_volume:path_in_samba image_name

        docker run -dit -p 445:445 --name sambadb --network libraryapp -v sambaVolume:/home/storage_data_smb sambadb

    Replace `container_name` with the name you want to give to your Docker container.

    Replace `image_name` with the name you want to give to your Docker image.

    Replace `network_name` with the name of your network (you need tha netwkor to connect all containers)

    Replace `name_volume` with the name that you have been created in the Docker Volume

    Replace `path_in_samba` with the path that you defined in the `smb.conf` and samba Docker File

5.  Now, you need to enter into the samba container, run in cmd

        docker exec -it container_name bash

    Replace `container_name` with the name you want to give to your Docker container.

6.  Enter the next commands in the container

    ```
    bash-5.0# adduser user_name
    bash-5.0# smbpasswd -a user_name
    ```

    Replace `user_name` with the username that you defined in the smb.conf.

    In which command the system is going to ask you for a password, we recommend to you to have the same password in each one.

## Testing

If you want to test you can do the next steps

1.  You need to know what is the IP of your samba container, for that you can use

        docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name

        example: docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sambadb

    Replace `container_name` with the name you want to give to your Docker container.

2.  With the ip, you can use the next command

        smbclient //DOCKER_HOST_IP/centralized_storage -U user_name

        example: smbclient //172.20.0.2/centralized_storage -U backend_user

        If u dont have smbclient, install:
        
        sudo apt install smbclient

    Replace `user_name` with the username that you defined in the smb.conf.

    Replace `DOCKER_HOST_IP` with the ip of the samba container

3.  You need the password that you have been created in the container configuration, if is succesfull, you have access to the path of the samba and you can list or do what you want without access problems

# BACKEND

### Development and Production Environment Setup Guide

This guide will help you set up and containerize the backend of our application using Docker. Make sure to follow each step carefully to achieve a stable development and production environment.

### Container Configuration

1. Open a terminal and navigate to the backend directory.
2. Open the `Dockerfile` in a text editor.
3. Ensure that the Dockerfile contains the following:

   ```Dockerfile
    # Usa una imagen base de Python
    FROM python:3.8-slim

    # Establece el directorio de trabajo
    WORKDIR /app

    # Copia los archivos de la aplicación al contenedor
    COPY . .

    # Instala las dependencias
    RUN pip install --no-cache-dir -r requirements.txt

    # Exponer el puerto de la aplicación Flask
    EXPOSE 5000

    # Comando para ejecutar la aplicación Flask
    CMD ["python", "app.py"]
   ```

   The requirements in this case, are in a text file called requirements.txt, if you want to add more, you can modify this file:

   ```requirements.txt
    blinker==1.7.0
    click==8.1.7
    Flask==3.0.2
    Flask-Cors==4.0.0
    itsdangerous==2.1.2
    Jinja2==3.1.3
    MarkupSafe==2.1.5
    pyasn1==0.5.1
    pysmb==1.2.9.1
    tqdm==4.66.2
    Werkzeug==3.0.1
   ```

4. Save the Dockerfile.

### Building and Running the Container

1.  Open a terminal in the backend project directory.
2.  Run the following command to build the container image:

    docker build -t image_docker .
    (if you have extension Docker in Visual Studio Code, right-click in Dockerfile and build image)

    Replace `image_name` with the name you want to give to your Docker image.

3.  Once the image is successfully built, run the following command to run the container:

        docker run -dit -p 5000:5000 --name container_name --network network_name image_name

        example: docker run -d -p 5000:5000 --network libraryapp --name backendparcial backendparcial

    Replace `container_name` with the name you want to give to your Docker container.

    Replace `image_name` with the name you want to give to your Docker image.

    Replace `network_name` with the name of your network (you need tha netwkor to connect all containers)

## Testing

If you want to test, he backend has two HTTP request, POST and GET, for testing this you can:

### POST

In a cmd you can enter the next command.

     curl -X POST -F "file=enter/your/pdf/path" http://127.0.0.1:5000/upload

Replace `enter/your/pdf/path` with the path of the pdf that you want to store

### GET

In a cmd you can enter the next command.

     curl http://127.0.0.1:5000/get_pdf_list

# FRONTEND

## Development and Production Environment Setup Guide

This guide will help you set up and containerize the frontend of our application (Library App) using Docker. Make sure to follow each step carefully to achieve a stable development and production environment.

### Steps to Follow

1. Open a terminal and navigate to the frontend project directory.
2. To view this app in localhost:

- Change directory to the library-app folder _cd/frontend-project/library-app_
- npm install (to install libraries to your project)
- npm run dev (to "deploy" locally)

### Container Configuration

1. Open the `Dockerfile` in a text editor.
2. Ensure that the Dockerfile contains the following:

   ```Dockerfile
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


   ```

3. Save the Dockerfile.

### Building and Running the Container

1. Open a terminal in the frontend project directory.
2. Run the following command to build the container image:

   docker build -t image_docker .
   (if you have extension Docker in Visual Studio Code, right-click in Dockerfile and build image)

   Replace `image_name` with the name you want to give to your Docker image.

3. Once the image is successfully built, run the following command to run the container:

   docker run -d -p 5173:5173 --network network_name --name container_name image_name

   example: docker run -d -p 5173:5173 --network libraryapp --name frontendparcial frontendparcial 

   Replace `container_name` with the name you want to give to your Docker container.

   Replace `image_name` with the name you want to give to your Docker image.

   Replace `network_name` with the name of your network (you need tha netwkor to connect all containers)

   This will run the container and make it accessible at `http://localhost:5173` in your web browser.

You now have the development environment set up and running on your machine.

## Production Environment Setup

### Steps to Follow

1. Follow the same container configuration steps as described in the development section.
2. Make sure to use the built image for production (`image_name`) when running the container on your production server.
