N=\x1b[0m
V=\x1b[32;01m
#VERSION=`git name-rev --name-only --tags HEAD | sed 's/\^.*//'`
VERSION=`git describe --abbrev=0 --tags`

all:
	@echo ""
	@echo "Comandos disponibles - versión $(VERSION):"
	@echo ""
	@echo "   $(V)iniciar$(N)         Instala todas las dependencias."
	@echo ""
	@echo "   $(V)build$(N)           Compila el archivo pilasengine.js."
	@echo "   $(V)watch$(N)           Observa los archivos fuente y compila pilas si es necesario."
	@echo "   $(V)test$(N)            Ejecuta todos los tests de qunit."
	@echo ""
	@echo "   $(V)version_patch$(N)   Incrementa, sube y publica en bower una versión patch."
	@echo "   $(V)version_minor$(N)   Incrementa, sube y publica en bower una versión minor."
	@echo "   $(V)version_major$(N)   Incrementa, sube y publica en bower una versión major."
	@echo ""
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

version_patch:
	npm version patch
	make sync

version_minor:
	npm version minor
	make sync

version_major:
	npm version major
	make sync

sync:
	git push origin master --tags
	bower info pilasweb

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
