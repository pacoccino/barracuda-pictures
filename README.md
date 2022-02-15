# Barracuda Photos

Yet another photo library app

## Architecture

Built on top of the amazing [RedwoodJS](https://redwoodjs.com/docs/introduction)

- Database: PostgreSQL
- Image storing: S3 via minio
- Background jobs: Faktory

## Run

### Dependencies

- Node.js _(for development)_
- docker
- docker-compose

### Development mode

#### Setup

Install dependencies and copy environment file
```terminal
yarn
cp .env.default .env
```
Adjust .env as you like

#### Run dependencies

Start docker containers
```terminal
yarn dc:dev up -d
```
Start worker
```terminal
yarn worker
```

-- Only on fresh setup:


Prepare database
```terminal
yarn rw prisma migrate deploy
```
Prepare S3
```terminal
yarn dc:dev:tasks up createbuckets
```

#### Fire it up

```terminal
yarn start
```

Now you can go on `http://localhost:8910` to see the web app.

Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/api/*`.

#### Add images

Upload images to S3
```terminal
yarn upload -d ./data/images
```

Then, go on the admin panel and click "scan" or run `yarn scan`

#### Reset

Stop docker containers, clean volumes/networks
```terminal
yarn dc:dev:clean
```

To clean DB/S3/Faktory, remove folders in ./data/dev/...


### Production mode

#### Setup

```terminal
cp .env.default .env.prod
```
Adjust .env.prod as you like

#### Start services

Start docker containers
```terminal
yarn dc:prod up -d
```

Prepare database
```terminal
yarn dc:prod up migrate
```

Setup your Minio users and policies

Upload and scan images
