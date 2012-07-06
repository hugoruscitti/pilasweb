compilar:
	cd pilasengine; node ../r.js -o name=main out=../dist/pilasengine.min.js baseUrl=.

docs: FORCE
	jsduck pilasengine/* -o docs

FORCE:
