# Reservado para el servicio 'travis' (no invocar desde consola).
test:
	npm install nodeunit
	nodeunit tests

unit:
	nodeunit tests
