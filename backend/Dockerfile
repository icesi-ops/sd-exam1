FROM node:alpine as builder
WORKDIR /app
COPY ../front/package.json .
COPY ../front/yarn.lock .
RUN yarn
COPY ../front/ .
RUN yarn build

FROM node:14-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --from=builder /app/build public/
COPY package*.json ./
USER root
RUN npm install
COPY --chown=root:root . .
EXPOSE 3000
CMD [ "npm", "start" ]