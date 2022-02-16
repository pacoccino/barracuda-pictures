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

COPY api api
COPY scripts scripts
COPY graphql.config.js .
COPY redwood.toml .

RUN yarn rw prisma generate

FROM node:14-alpine as runner

WORKDIR /app

COPY --from=builder /app /app

ENTRYPOINT [ "yarn", "rw", "exec", "--prisma", "false" ]
