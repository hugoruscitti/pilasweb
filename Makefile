compilar:
	cd pilasengine; node ../r.js -o name=main out=../dist/pilasengine.min.js baseUrl=.

docs: FORCE
	jsduck pilasengine/* -o docs --title=pilasweb

deploy: FORCE
	@echo "Generando pilasengine.min.js ..."
	@make compilar > /dev/null
	rm -r -f dist_master
	mv dist dist_master
	git checkout gh-pages
	rm -r -f dist
	mv dist_master dist
	git add dist
	@echo "Solo queda hacer commit !!!."


FORCE:
