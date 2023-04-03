# syntax=docker/dockerfile:1

# build environment
FROM node:19-alpine as builder
WORKDIR /app
COPY . .
COPY .env.example .env

RUN yarn
RUN yarn build
# production environment
EXPOSE 8001