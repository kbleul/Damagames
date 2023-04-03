# syntax=docker/dockerfile:1

# build environment
FROM node:19-alpine as builder
WORKDIR /app
COPY . .
COPY .env.example .env
#RUN if [ -z "${RELEASE_VERSION}" ]; then echo 'Environment variable RELEASE_VERSION must be specified. Exiting.'; exit 1; fi
RUN sed -i "s|v1.0.0|${RELEASE_VERSION}|g" src/components/Footer.js
RUN yarn
RUN yarn build
# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]