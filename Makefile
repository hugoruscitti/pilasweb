compilar:
	cd pilaswebengine; node ../r.js -o name=main out=../dist/pilaswebengine.min.js baseUrl=.

docs: FORCE
	jsduck pilaswebengine/* -o docs --title=pilasweb

deploy: FORCE
	@echo "Generando pilaswebengine.min.js ..."
	@make compilar > /dev/null
	rm -r -f dist_master
	mv dist dist_master
	git checkout gh-pages
	rm -r -f dist
	mv dist_master dist
	git add dist
	@echo "Solo queda hacer commit !!!."


FORCE:
