FROM node:16.16.0

WORKDIR /app

RUN npm install -g npm@8.16.0

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

CMD npm run start