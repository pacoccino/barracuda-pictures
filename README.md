# Barracuda Photos

Yet another photo library app


## Architecture

Build on top of the amazing [RedwoodJS](https://redwoodjs.com/docs/introduction)

- Database: PostgreSQL
- Image storing: S3 via minio

## Development

### Dependencies

- Node.js
- docker
- docker-compose

### Setup

```terminal
yarn
```

### Run dependencies

Run docker containers
```terminal
yarn dockers
```

Prepare database
```terminal
yarn migrate
```

### Fire it up

```terminal
yarn start
```

Your browser should open automatically to `http://localhost:8910` to see the web app. Lambda functions run on `http://localhost:8911` and are also proxied to `http://localhost:8910/.redwood/functions/*`.

### Add images

You need to manually add images on S3, you can do it in the Minio console at [http://localhost:9000](http://localhost:9000)

Then scan files

```terminal
yarn scan
```

### Reset

Stop docker containers, clean their volumes
```terminal
yarn stop-and-clean
```

Reset S3 server
```terminal
rm -rf ./minio_data
```

