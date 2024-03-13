# Use node.js image as the base image
FROM node:18 AS build
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install
# Copy the rest of the application code to the working directory
COPY . .
#EXPOSE 5173
# Build the application
RUN yarn run build 

ENV VITE_BACKEND=http://localhost:5087
#Stage 2

# Use nginx image as the base image for serving static filesdocker
FROM nginx:alpine

ADD ./config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /var/www/app/

COPY start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]