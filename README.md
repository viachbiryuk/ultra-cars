# Ultra cars

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ docker-compose up
```

## Seed

```bash
$ npm run seed
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
(make sure DB postgres on localhost:9002 before run)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations
Migrations can be executed in the terminal in the following way:
```bash
# create migration
$ npm run typeorm -- migration:create -n <your_migration_name>

# run migration
$ npm run typeorm -- migration:create

# revert migration
$ npm run typeorm -- migration:revert 
```
