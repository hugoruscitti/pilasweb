compilar:
	cd pilasengine; node ../r.js -o name=main out=../dist/pilasengine.min.js baseUrl=.

docs: FORCE
	jsduck pilasengine/* -o docs --title=pilasweb

deploy: FORCE
	make compilar > /dev/null
	@echo "Generando pilasengine.min.js ..."
	mv dist dist_master
	git checkout gh-pages
	rm -r -f dist
	mv dist_master dist
	git add dist
	@echo "Solo queda hacer commit !!!."


FORCE:
