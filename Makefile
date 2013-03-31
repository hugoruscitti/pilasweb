# Makefile para generar pilasweb-engine.

ayuda:
	@echo ""
	@echo "¡Estás viendo la ayuda de makefile para pilasweb-engine!"
	@echo ""
	@echo "Estos son algunos de los comandos que podrías ejecutar:"
	@echo ""
	@echo "  dependencias_apt-get   Instala las dependencias en un linux tipo ubuntu/debian."
	@echo "  generar                Contruye la biblioteca, genera el codigo minificado y la documentación."
	@echo "  documentacion          Genera toda la documentacion del proyecto con jsduck."
	@echo "  test                   Ejecuta todas las pruebas sobre la biblioteca."

dependencias_apt-get:
	@echo "Instalando build-essential..."
	apt-get install build-essential
	@echo ""

	@echo "Instalando node-0.8.17.js..."
	wget http://nodejs.org/dist/v0.8.17/node-v0.8.17.tar.gz
	tar xzf node-v0.8.17.tar.gz
	cd node-v0.8.17/ ;\
	./configure ;\
	make ;\
	make install
	rm -rf node-v0.8.17/ node-v0.8.17.tar.gz
	@echo ""

	@echo "Instalando CoffeeScript pre-processor..."
	apt-get install npm
	npm install -g coffee-script
	@echo ""

	@echo "Instalando Ruby..."
	apt-get install ruby irb rdoc
	@echo ""

	@echo "Instalando RubyGems..."
	apt-get install rubygems
	@echo ""

	@echo "Instalando JsDuck..."
	gem install jsduck
	@echo ""

	@echo "Dependencias instaladas."

generar:
	@echo "Preprocesando (coffee a js)..."
	coffee --compile --output src/js src/coffee
	@echo ""

	@echo "Minificando librería pilasweb-engine..."
	rm -rf build/
	node r-2.1.2.js -o r.build.js
	cp -r src/data build/data
	@echo ""
	@echo "Librería pilasweb-engine generada."

documentacion:
	@echo "Generando documentación de coffee..."
	mkdir -p doc/
	cp -r src/coffee/ doc/temp_dir/
	find doc/temp_dir/ -type f -exec \
	sed -i \
		-e 's_^_//_' \
		-e 's_^//##[^#]_   _' {} \;
	jsduck doc/temp_dir/* doc/temp_dir/actores/* -o doc/coffee/ --title="pilasweb-engine (coffee)" --categories="categories.jsduck"
	rm -rf doc/temp_dir/
	find doc/coffee/source/ -type f -exec \
	sed -i \
		-e 's_^//__' \
		-e 's_>//_>_' {} \;
	@echo ""

tests: generar
	# También se pueden ver abriendo el archivo unit-tests/run.html desde el navegador.
	mocha-phantomjs unit-tests/run.html
