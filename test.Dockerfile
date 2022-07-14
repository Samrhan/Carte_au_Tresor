FROM node:16-alpine as build

WORKDIR /app
COPY yarn.lock .
COPY package.json .
COPY jest.config.ts .
COPY tsconfig.json .
COPY tsconfig.test.json .

COPY src /app

RUN yarn install --frozen-lockfile

CMD yarn jest --coverage
