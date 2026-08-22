FROM node:26

RUN npm i -g npm@latest

WORKDIR /api

COPY package.json package-lock.json ./
COPY src ./src

RUN npm ci --omit=dev

CMD ["node", "src/server.ts"]

EXPOSE 3000
