DATABASE_URL := "postgresql://postgres:postgres@localhost:5433/postgres"
BIN := node_modules/.bin

infra:
	docker compose up -d --force-recreate

infra-stop:
	docker compose stop

infra-restart: infra-stop infra

reset-test-db:
	DATABASE_URL=$(DATABASE_URL) $(BIN)/prisma migrate reset --force
	DATABASE_URL=$(DATABASE_URL) $(BIN)/prisma migrate dev

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
