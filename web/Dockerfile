FROM node:14-alpine as builder

WORKDIR /app

COPY .nvmrc .
COPY package.json .
COPY yarn.lock .
COPY web/package.json web/package.json

RUN yarn install --frozen-lockfile

COPY web web
COPY graphql.config.js .
COPY redwood.toml .

ARG PHOTOS_URL
ARG MINIATURES_URL
ARG GMAPS_API_KEY

RUN yarn rw build web
RUN rm -rf ./web/src

FROM nginx as runner

COPY --from=builder /app/web/dist /usr/share/nginx/html
COPY ./web/nginx.conf /etc/nginx/conf.d/default.conf

RUN ls -lA /usr/share/nginx/html

EXPOSE 8910
