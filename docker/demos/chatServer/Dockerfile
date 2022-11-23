FROM node:19-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
ENV PORT 3000
ENV ADDRESS locahost

RUN echo "building with address ${ADDRESS}:${PORT}"
CMD [ "node", "server.js" ]