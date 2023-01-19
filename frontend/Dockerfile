# syntax=docker/dockerfile:1

# build environment
FROM node:19-alpine as builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]