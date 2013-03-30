###
 -*- encoding: utf-8 -*-
 pilasweb engine - a video game framework.

 copyright 2013 - Hugo Ruscitti, Sergio Lindo <sergiolindo.empresa at gmail.com>
 license: lgplv3 (see http://www.gnu.org/licenses/lgpl.html)

 website - http://hugoruscitti.github.com/pilasweb
###
define ->
##  /**
##   * @class Pilas.actores.Actor
##   * Clase general de la que heredan los actores. Contiene la funcionalidad común de todos los actores.
##   */
    class Actor
##      /**
##       * Constructor de clase actor.
##       * @constructor
##       * @param {String} imagen Nombre del fichero de imagen para el actor.
##       * @param {Object} options Contiene las propiedades que se quieren personalizar.
##       */
        constructor: (imagen, options)->
            options = {} if not options?

            @x = options.x or 0;
            @y = options.y or 0;
            @centro_x = options.centro_x or 0;
            @centro_y = options.centro_y or 0;
            @escala_x = options.escala_x or 1;
            @escala_y = options.escala_y or 1;
            @rotacion = options.rotacion or 0;
            @transparencia = options.transparencia or 0;

            @imagen = pilas.imagenes.cargar imagen;
            pilas.agregar @
##      /**
##       * @method actualizar
##       * Se ejecuta en el bucle principal del juego para actualizar la lógica del actor.
##       */
        actualizar: ->
##      /**
##       * @method dibujar
##       * Se ejecuta en el bucle principal del juego para actualizar la imagen del actor en el canvas.
##       * @param {HTMLElement} painter El canvas en el que se dibujará el actor.
##       */
        dibujar: (painter)->
            @imagen.dibujar painter,
                @x, @y, @centro_x, @centro_y,
                @escala_x, @escala_y, @rotacion, @transparencia
            `void 0`

        __getattr__: (x) ->
            return @x

        __setattr__: (x, v) ->
            @[x] = v

    return Actor
