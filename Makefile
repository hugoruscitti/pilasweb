N=\x1b[0m
V=\x1b[32;01m
A=\x1b[33;01m
VERSION=`git describe --abbrev=0 --tags`

all:
	@echo ""
	@echo "$(A)Comandos disponibles - $(V)pilasweb$(N) $(A)$(VERSION):$(N)"
	@echo ""
	@echo "   $(V)iniciar$(N)         Instala todas las dependencias."
	@echo ""
	@echo "   $(V)build$(N)           Compila el archivo pilasengine.js."
	@echo "   $(V)build_live$(N)      Observa los archivos y compila solo si es necesario."
	@echo "   $(V)test$(N)            Ejecuta todos los tests de qunit."
	@echo "   $(V)test_live$(N)       Similar a build_live pero agrega ejecución de tests."
	@echo ""
	@echo "   $(V)version_patch$(N)   Incrementa, sube y publica en bower una versión patch."
	@echo "   $(V)version_minor$(N)   Incrementa, sube y publica en bower una versión minor."
	@echo "   $(V)version_major$(N)   Incrementa, sube y publica en bower una versión major."
	@echo ""
	@echo ""

iniciar:
	npm install

build:
	node_modules/grunt-cli/bin/grunt typescript
	node_modules/grunt-cli/bin/grunt generar_docs
	node_modules/grunt-cli/bin/grunt concat
	node_modules/grunt-cli/bin/grunt copy

build_live:
	node_modules/grunt-cli/bin/grunt watch:scripts

test:
	node_modules/grunt-cli/bin/grunt test

test_live:
	node_modules/grunt-cli/bin/grunt watch:test

version_patch: publicar_compilados
	npm version patch
	make sync

version_minor: publicar_compilados
	npm version minor
	make sync

version_major: publicar_compilados
	npm version major
	make sync

publicar_compilados: build
	git commit -am "Actualizando compilados para distribuir"

sync:
	git push origin master --tags
	bower info pilasweb
	@echo "$(V)Listo, se publicó la versión $(VERSION) de pilasweb $(N)"

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

.PHONY: tests
