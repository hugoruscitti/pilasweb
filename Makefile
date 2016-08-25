N=\x1b[0m
V=\x1b[32;01m
#VERSION=`git name-rev --name-only --tags HEAD | sed 's/\^.*//'`
VERSION=`git describe --abbrev=0 --tags`

all:
	@echo ""
	@echo "Comandos disponibles - versión $(VERSION):"
	@echo ""
	@echo "   $(V)iniciar$(N)      Instala todas las dependencias."
	@echo ""
	@echo "   $(V)build$(N)        Compila el archivo pilasengine.js."
	@echo "   $(V)watch$(N)        Observa los archivos fuente y compila pilas si es necesario."
	@echo "   $(V)test$(N)         Ejecuta todos los tests de qunit."
	@echo ""

iniciar:
	npm install

build:
	grunt typescript
	grunt generar_docs
	grunt concat
	grunt copy

watch:
	grunt watch

test:
	grunt test 

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

.PHONY: test tests
