all:
	@echo "test_linux   Prueba la aplicacion usando nodewebkit en linux."
	@echo "test_mac     Prueba la aplicacion usando nodewebkit en mac osx."
	@echo "watch        Observa los archivos y compila pilas si es necesario"
	@echo "install      Actualiza dependencias"
	@echo "build        Genera las versiones compiladas."

test_linux:
	./dist/node-webkit-v0.7.3-linux-ia32/nw ide

build:
	rm -f -r webkitbuilds/releases/
	grunt nodewebkit

test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app ide

watch:
	grunt watch

install:
	npm install

test:
	./node_modules/.bin/mocha-phantomjs test/init.html

.PHONY: test
