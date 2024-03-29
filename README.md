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
./dcs.sh -e dev up -d
```
Start worker
```terminal
yarn s:worker
```

-- Only on fresh setup:


Prepare database
```terminal
yarn rw prisma migrate deploy
```
Prepare S3
```terminal
./dcs.sh -e dev -t up createbuckets
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

## CLI

### Upload
Upload images from a local directory to S3

`yarn upload -d ROOT_DIR -p PREFIX`
- ROOT_DIR: directory of files to upload
- PREFIX _(optional)_: Add a prefix in S3

### Scan
Scan images on S3 and add them into the app (DB, tags, miniatures)

`yarn scan`
- ROOT_DIR: directory of files to upload
- PREFIX _(optional)_: Add a prefix in S3

### Format
Used to format log output

`yarn upload -d ./data/images | yarn format`
`yarn scan | yarn format`

### Studio
Open Prisma studio to inspect the database

`yarn studio`

