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
	@echo " $(V)upload$(N)       Sube los archivos generados para publicar una release."
	@echo ""

test_linux:
	./dist/node-webkit-v0.7.3-linux-ia32/nw ide

build:
	grunt clear
	grunt typescript
	grunt copy
	@echo "Borrando archivos de releases anteriores."
	rm -f -r webkitbuilds/releases/
	grunt nodewebkit
	
upload: build
	@mkdir -p dist
	@echo "Empaquetando para windows..."
	zip -r dist/pilas-engine_windows.zip webkitbuilds/releases/pilas-engine/win/pilas-engine
	@echo ""
	@echo "Empaquetando para linux (32 bits)..."
	zip -r dist/pilas-engine_linux32.zip webkitbuilds/releases/pilas-engine/linux32/pilas-engine
	@echo ""
	@echo "Empaquetando para linux (64 bits)..."
	zip -r dist/pilas-engine_linux64.zip webkitbuilds/releases/pilas-engine/linux32/pilas-engine
	@echo ""
	@echo "Empaquetando para mac ..."
	zip -r dist/pilas-engine_mac.zip webkitbuilds/releases/pilas-engine/mac
	@echo ""
	scp dist/* digitalocean:~/dev-losersjuegos.com.ar/pilas-engine

test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app ide

watch:
	grunt clear
	grunt typescript
	grunt copy
	grunt watch

install:
	npm install
	cd ide; bower install

test:
	./node_modules/.bin/mocha-phantomjs test/init.html

.PHONY: test