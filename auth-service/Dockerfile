FROM node:12 AS Production

ENV  NODE_ENV=production

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
