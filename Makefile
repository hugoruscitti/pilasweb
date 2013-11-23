

watch:
	grunt watch

crear_entorno:
	npm install

test:
	./node_modules/.bin/mocha-phantomjs test/init.html

.PHONY: test
