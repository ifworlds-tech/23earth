build:
	docker-compose run build
run:
	docker-compose up -d api
stop:
	docker-compose stop api
clean:
	rm -rf node_modules build app/build