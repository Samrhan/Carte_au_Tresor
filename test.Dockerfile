FROM node:16-alpine as build

WORKDIR /app

COPY / /app

RUN yarn install --frozen-lockfile

CMD yarn jest --coverage
