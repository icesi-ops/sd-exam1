FROM node:hydrogen
LABEL authors="github.com/alexandersanchezjr"
LABEL description="This is a frontend container"
LABEL version="1.0"

WORKDIR /usr/src/app

# Set the environment variables
ENV BACKEND_NAME='app-backend'
ENV BACKEND_PORT=3000
ENV FRONTEND_NAME='app-frontend'
ENV FRONTEND_PORT=4000
ENV CONSUL_HOST='app-consul'

# Copy project
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Serve ssr
CMD ["npm", "run", "serve:ssr:frontend"]
