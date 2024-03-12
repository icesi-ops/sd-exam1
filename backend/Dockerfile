FROM node:hydrogen as node
LABEL authors="alexandersanchezjr"

# Set environment variables
ENV BACKEND_NAME='app-backend'
ENV BACKEND_PORT=3000
ENV CONSUL_HOST='app-consul'
ENV FRONTEND_HOST='app-frontend'
ENV FRONTEND_PORT=4000
ENV COUCHDB_HOST='app-couchdb'
ENV COUCHDB_USER=admin
ENV COUCHDB_PASS=admin

# SMB Client
FROM node as final

RUN apt update
RUN apt install -y smbclient

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Serve the app
CMD ["node", "app"]