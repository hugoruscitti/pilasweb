compilar:
	cd pilasengine; node ../r.js -o name=main out=../dist/pilasengine.min.js baseUrl=.

docs: FORCE
	jsduck pilasengine/* -o docs --title=pilasweb

deploy: FORCE
	make compilar
	git checkout gh-pages
	git add dist
	git status
	@echo "Solo queda hacer commit !!!."


FORCE:
