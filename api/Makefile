DATABASE_URL := "postgresql://postgres:postgres@localhost:5433/postgres"
PROD_DATABASE_URL := "postgresql://postgres:postgres@localhost:5433/postgres"
BIN := node_modules/.bin
.DEFAULT_GOAL := start-prod

infra:
	docker compose up -d --force-recreate

infra-stop:
	docker compose stop

infra-restart: infra-stop infra

reset-test-db:
	DATABASE_URL=$(DATABASE_URL) $(BIN)/prisma migrate reset --force
	DATABASE_URL=$(DATABASE_URL) $(BIN)/prisma migrate dev

migrate-prod-db:
	DATABASE_URL=$(PROD_DATABASE_URL) $(BIN)/prisma migrate deploy

test:
	$(BIN)/jest

test-watch: 
	$(BIN)/jest --watch

test-cov:
	$(BIN)/jest --coverage

test-debug:
	$(BIN)/node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand

test-e2e: reset-test-db
	DATABASE_URL=$(DATABASE_URL) $(BIN)/jest --config ./test/jest-e2e.json

dev:
	$(BIN)/nest start --watch

build:
	$(BIN)/nest build

format:
	$(BIN)/prettier --write \"src/**/*.ts\" \"test/**/*.ts\"

start:
	$(BIN)/nest start

start-debug:
	$(BIN)/nest start --debug --watch

start-prod:
	$(BIN)/node dist/main

lint:
	$(BIN)/eslint \"{src,apps,libs,test}/**/*.ts\" --fix

prisma-generate:
	$(BIN)/prisma generate
