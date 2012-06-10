Guía para desarrolladores
=========================

Servicios
---------

En este proyecto usamos varios servicios, y todos
están vinculados con el repositorio principal.

Para acceder al código del proyecto, el repositorio
principal es:

https://github.com/hugoruscitti/pilasweb

Cada vez que hacemos ``push`` en este repositorio, hay
varios servicios configurados para actualizarse automáticamente.

Los servicios adicionales cubren:

- Publicación de la aplicación: heroku
- Pruebas de integración: travis

Estas son las direcciones web de cada uno de esos
servicios:

https://api.heroku.com/myapps
http://travis-ci.org/#!/hugoruscitti/pilasweb


Acceso desde otros servidores
-----------------------------

El ultimo build de la biblioteca se puede acceder
desde la siguiente URL:

    https://raw.github.com/hugoruscitti/pilasweb/master/pilas/pilas.js

Cada vez que quieras hacer un juego con pilas-engine deberías
incluir este archivo junto a los siguientes:

    http://mootools.net/download/get/mootools-core-1.4.5-full-nocompat-yc.js
    http://code.createjs.com/easeljs-0.4.2.min.js

Por ejemplo, el código HTML de tu página debería contener
lo siguiente dentro del elemento ``head``:

.. code-block:: html

    <script src="http://mootools.net/download/get/mootools-core-1.4.5-full-nocompat-yc.js"></script>
    <script src="http://code.createjs.com/easeljs-0.4.2.min.js"></script>

    <script src="https://raw.github.com/hugoruscitti/pilasweb/master/pilas/pilas.js"></script>


Makefile
--------

El archivo ``Makefile`` tiene una serie de comandos para ejecutar, si
quieres ejecutar alguno de estos comandos tienes que escribir: ``make comando``.

Por ejemplo, alguno de los comandos disponibles son:

unit:
    Se ejecuta automáticamente dentro de los servidores de travis para probar la aplicación.
