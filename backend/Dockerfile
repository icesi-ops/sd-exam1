FROM node:14-alpine as builder
WORKDIR /app
COPY frontend/package.json .
COPY frontend/yarn.lock .
RUN yarn
COPY frontend/ .
RUN yarn build

FROM node:14-alpine
RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app
COPY package*.json ./
USER root
RUN npm install
COPY --from=builder /app/build src/build/
COPY --chown=root:root . .
RUN rm -rf frontend
EXPOSE 3000
CMD [ "npm", "start" ]