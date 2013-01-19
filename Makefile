# Makefile para generar pilasweb-engine.

ayuda:
	@echo ""
	@echo "¡Estás viendo la ayuda de makefile para pilasweb-engine!"
	@echo ""
	@echo "Si quieres instalar los programas utilizados para generar la librería pilasweb-engine, escribe en la terminal:"
	@echo ""
	@echo "  make dependencias_apt-get"
	@echo ""
	@echo "Si quieres generar la librería pilasweb-engine a partir de los fuentes, escribe en la terminal:"
	@echo ""
	@echo "  make generar"
	@echo ""

dependencias_apt-get: coffee_apt-get jsduck_apt-get
	@echo "Dependencias instaladas."
nodejs: /usr/local/bin/node
	@echo "Instalando node.js..."
	if ! [ -f node-v0.8.17.tar.gz ]; then \
		wget http://nodejs.org/dist/v0.8.17/node-v0.8.17.tar.gz; \
	fi
	if ! [ -d node-v0.8.17 ]; then \
		tar xzf node-v0.8.17.tar.gz; \
	fi
	cd node-v0.8.17/ ; \
	./configure ; \
	make ; \
	make install
	rm -rf node-v0.8.17/ node-v0.8.17.tar.gz
	@echo ""
coffee_apt-get: nodejs /usr/local/bin/coffee
	@echo "Instalando CoffeeScript pre-processor..."
	apt-get install npm
	npm install -g coffee-script
	@echo ""
ruby_apt-get: /usr/bin/ruby
	@echo "Instalando Ruby..."
	apt-get install ruby irb rdoc
	@echo ""
rubygems_apt-get: ruby_apt-get /usr/bin/gem
	@echo "Instalando RubyGems..."
	apt-get install rubygems
	@echo ""
jsduck_apt-get: rubygems_apt-get
	@echo "Instalando JsDuck..."
	gem install jsduck
	@echo ""

generar: preprocesar minificar documentar-coffee documentar-js
	@echo "Librería pilasweb-engine generada."
preprocesar:
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
