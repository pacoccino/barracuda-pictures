FROM node:14-alpine

WORKDIR /app

#ENV YARN_CACHE_FOLDER=/yarn-cache
#VOLUME /Users/paco/Library/Caches/Yarn/v6 /yarn-cache

COPY .nvmrc .
COPY package.json .
COPY yarn.lock .
COPY api/package.json api/package.json

RUN yarn install --frozen-lockfile
RUN yarn add react react-dom --ignore-workspace-root-check

COPY api api
COPY graphql.config.js .
COPY redwood.toml .

RUN yarn rw build api
RUN rm -rf ./api/src

WORKDIR /app/api

EXPOSE 8911

ENTRYPOINT [ "yarn", "rw", "serve", "api", "--port", "8911" ]
