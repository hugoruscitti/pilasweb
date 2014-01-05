N=\x1b[0m
V=\x1b[32;01m

all:
	@echo ""
	@echo " $(V)test_linux$(N)   Prueba la aplicacion usando nodewebkit en linux."
	@echo " $(V)test_mac$(N)     Prueba la aplicacion usando nodewebkit en mac osx."
	@echo " $(V)watch$(N)        Observa los archivos y compila pilas si es necesario."
	@echo " $(V)install$(N)      Actualiza dependencias."
	@echo " $(V)build$(N)        Genera las versiones compiladas."
	@echo " $(V)test$(N)         Ejecuta todos los tests con mocha."
	@echo ""

test_linux:
	./dist/node-webkit-v0.7.3-linux-ia32/nw ide

build:
	rm -f -r webkitbuilds/releases/
	grunt nodewebkit

test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app ide

watch:
	grunt typescript
	grunt watch

install:
	npm install
	cd ide; bower install

test:
	./node_modules/.bin/mocha-phantomjs test/init.html

.PHONY: test
