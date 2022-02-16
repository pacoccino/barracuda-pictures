FROM node:14-alpine as yarner

WORKDIR /app

COPY .nvmrc .
COPY package.json .
COPY yarn.lock .
COPY web/package.json web/package.json
COPY api/package.json api/package.json

RUN yarn install --frozen-lockfile
RUN yarn cache clean

FROM node:14-alpine as builder

WORKDIR /app
COPY --from=yarner /app /app

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
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8100
