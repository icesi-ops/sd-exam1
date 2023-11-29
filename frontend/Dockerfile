FROM node:16 AS build

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . /app

RUN npm run build

FROM nginx:stable-alpine

ENV BACKEND_ADDRESS=http://backend:8005

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
