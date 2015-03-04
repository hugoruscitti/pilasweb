N=\x1b[0m
V=\x1b[32;01m
#VERSION=`git name-rev --name-only --tags HEAD | sed 's/\^.*//'`
VERSION=`git describe --abbrev=0 --tags`

all:
	@echo ""
	@echo " $(V)test_linux$(N)   Prueba la aplicacion usando nodewebkit en linux."
	@echo " $(V)test_mac$(N)     Prueba la aplicacion usando nodewebkit en mac osx."
	@echo " $(V)watch$(N)        Observa los archivos y compila pilas si es necesario."
	@echo " $(V)install$(N)      Actualiza dependencias."
	@echo " $(V)build$(N)        Compila el archivo pilasengine.js."
	@echo " $(V)nodewekbit$(N)   Genera las versiones compiladas."
	@echo " $(V)test$(N)         Ejecuta todos los tests con mocha."
	@echo " $(V)upload$(N)       Sube los archivos generados para publicar una release."
	@echo " $(V)version$(N)      Informa el numero de version."
	@echo ""
	@echo "   nota: para activar el modo live-reload tendrías que"
	@echo "   ejecutar los comandos $(V)watch$(N), $(V)t($N)."
	@echo ""


version:
	@echo $(VERSION)

test_linux:
	./dist/node-webkit-v0.7.3-linux-ia32/nw ide

build:
	grunt clear
	grunt typescript
	grunt generar_docs
	grunt concat
	grunt copy

nodewebkit: build
	@echo "Borrando archivos de releases anteriores."
	rm -f -r webkitbuilds/releases/
	grunt nodewebkit
	
upload: nodewebkit
	@mkdir -p dist
	@echo "Limpiando el directorio dist/"
	@rm -f dist/*
	@echo "Empaquetando para windows..."
	zip -r dist/pilas-engine_$(VERSION)_windows.zip webkitbuilds/releases/pilas-engine/win/pilas-engine
	@echo ""
	@echo "Empaquetando para linux (32 bits)..."
	zip -r dist/pilas-engine_$(VERSION)_linux32.zip webkitbuilds/releases/pilas-engine/linux32/pilas-engine
	@echo ""
	@echo "Empaquetando para linux (64 bits)..."
	zip -r dist/pilas-engine_$(VERSION)_linux64.zip webkitbuilds/releases/pilas-engine/linux64/pilas-engine
	@echo ""
	@echo "Empaquetando para mac ..."
	zip -r dist/pilas-engine_$(VERSION)_mac.zip webkitbuilds/releases/pilas-engine/mac
	@echo ""
	scp dist/* digitalocean:~/dev-losersjuegos.com.ar/descargas/pilas-engine
	@echo " "
	@echo " "
	@echo "Pilas se podrá descargar desde estas URLs:"
	@echo " "
	@echo "   http://dev-losersjuegos.com.ar/pilas-engine/pilas-engine_$(VERSION)_mac.zip"
	@echo "   http://dev-losersjuegos.com.ar/pilas-engine/pilas-engine_$(VERSION)_windows.zip"
	@echo "   http://dev-losersjuegos.com.ar/pilas-engine/pilas-engine_$(VERSION)_linux32.zip"
	@echo "   http://dev-losersjuegos.com.ar/pilas-engine/pilas-engine_$(VERSION)_linux64.zip"
	@echo " "

test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app ide

watch:
	grunt watch

crear_entorno:
	npm install

test:
	./node_modules/.bin/mocha-phantomjs test/init.html

web:
	cd ../ghpages__pilasweb; git pull origin gh-pages
	cp -r -f public/* ../ghpages__pilasweb/public/
	cd ../ghpages__pilasweb; git add .; git commit -am 'deploy'; git push origin gh-pages
	@echo ""
	@echo "Los cambios se publicaron en:"
	@echo ""
	@echo "      http://hugoruscitti.github.io/pilasweb/public/test_cambio_de_imagenes.html"
	@echo ""
	@echo ""

.PHONY: test
