all:
	@echo "watch     Observa los archivos y compila pilas si es necesario"
	@echo "install   Actualiza dependencias"

watch:
	grunt watch

install:
	npm install

test:
	./node_modules/.bin/mocha-phantomjs test/init.html

.PHONY: test
