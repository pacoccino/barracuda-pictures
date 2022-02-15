FROM node:14-alpine

WORKDIR /app

COPY .nvmrc .
COPY package.json .
COPY yarn.lock .
COPY api/package.json api/package.json

RUN yarn install --frozen-lockfile
RUN yarn add react react-dom --ignore-workspace-root-check
RUN yarn cache clean

COPY api api
COPY graphql.config.js .
COPY redwood.toml .

RUN yarn rw build api
RUN rm -rf ./api/src

EXPOSE 8911

ENTRYPOINT [ "yarn", "rw", "serve", "api", "--port", "8911" ]
