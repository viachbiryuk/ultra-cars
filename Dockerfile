FROM node:lts-alpine

EXPOSE ${API_PORT} ${API_PORT}

RUN mkdir -p /home/ultra
COPY package.json /home/ultra
WORKDIR /home/ultra
RUN npm i

COPY . /home/ultra

CMD npm run start:dev
