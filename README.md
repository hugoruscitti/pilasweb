## Pilas web engine 

[![Build Status](https://travis-ci.org/hugoruscitti/pilasweb.png?branch=master)](https://travis-ci.org/hugoruscitti/pilasweb) [![Code Climate](https://codeclimate.com/github/hugoruscitti/pilasweb/badges/gpa.svg)](https://codeclimate.com/github/hugoruscitti/pilasweb)

### ¿Qué es pilas-engine web?

pilas-engine web es una biblioteca para realizar videojuegos de manera
sencilla orientada a estudiantes.

Es la versión hermana de pilas-engine (versión python: www.pilas-engine.com.ar)
pero orientada a la web, utilizando HTML5 y typescript.


### Generar

Este repositorio utiliza grunt y tiene todo lo necesario para compilar
y generar una versión distribuible de pilas-engine web.

Estos son los pasos para ejecutar las demostraciones:

1. Ejecuta el comando `make iniciar`.
2. Ejecuta `make build` para generar la versión javascript distribuible.
3. Abre el archivo dist/demos.html para ver las demos.

Opcionalmente, si estás desarrollando, podrías ejecutar `make build_live` para
habilitar la compilación continua.

Lo mismo sucede con los tests, para ejecutarlos una sola vez existe el
comando `make test` y para ejecutarlo de forma contínua el comando `make test_live`.

Por cierto, el comando 'make' sin argumentos te muestra varias opciones
disponibles.
