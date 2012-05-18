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

    https://raw.github.com/hugoruscitti/pilasweb/master/js/pilas.js

Es decir, cualquier web podría incorporar pilas en sus
juegos agregando estas lineas de código HTML a sus páginas:

.. code-block:: html

    <script language="javascript" type="text/javascript" src="https://raw.github.com/hugoruscitti/pilasweb/master/js/easeljs-0.4.2.min.js"></script>
    <script language="javascript" type="text/javascript" src="https://raw.github.com/hugoruscitti/pilasweb/master/js/pilas.js"></script>


Makefile
--------

El archivo ``Makefile`` tiene una serie de comandos para ejecutar, si
quieres ejecutar alguno de estos comandos tienes que escribir: ``make comando``.

Por ejemplo, alguno de los comandos disponibles son:

test:
    Se ejecuta automáticamente dentro de los servidores de travis para probar la aplicación.
