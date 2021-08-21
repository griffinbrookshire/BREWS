FROM node:12.18.1

WORKDIR /brews

COPY . .

RUN npm install

WORKDIR /brews/server

RUN npm install

WORKDIR /brews/client

RUN npm install

WORKDIR /brews

CMD [ "npm", "run", "dev" ]