# Makefile para generar pilasweb-engine.

generar-pilasweb-engine: precompilar minificar documentar-coffee documentar-js
	@echo "pilasweb-engine generado."

precompilar:
	@echo "Preprocesando (coffee a js)..."
	coffee --compile --output src/js src/coffee
	@echo ""

minificar:
	@echo "Minificando librería pilasweb-engine..."
	rm -rf build/
	node r-2.1.2.js -o r.build.js
	cp -r src/data build/data
	@echo ""

documentar-coffee:
	@echo "Generando documentación de coffee..."
	#jsduck src/coffee/*.coffee -o doc/coffee --title="pilasweb-engine (coffee)"
	@echo ""

documentar-js:
	@echo "Generando documentacion de js..."
	#jsduck src/js/*.js -o doc/js --title="pilasweb-engine (js)"
	@echo ""
