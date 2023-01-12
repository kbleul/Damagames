FROM node:18-alpine

RUN mkdir -p /var/www/html

WORKDIR /var/www/html

EXPOSE 3000
RUN yarn
# RUN yarn start
CMD [ "yarn", "start"]