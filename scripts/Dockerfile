FROM node:14-alpine

WORKDIR /app

COPY .nvmrc .
COPY package.json .
COPY yarn.lock .
COPY api/package.json api/package.json

RUN yarn install --frozen-lockfile
RUN yarn add react react-dom --ignore-workspace-root-check

COPY api api
RUN yarn rw prisma generate

COPY scripts scripts
COPY graphql.config.js .
COPY redwood.toml .

ENTRYPOINT [ "yarn", "rw", "exec", "--prisma", "false" ]
