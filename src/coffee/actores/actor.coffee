###
 -*- encoding: utf-8 -*-
 pilasweb engine - a video game framework.

 copyright 2013 - Hugo Ruscitti, Sergio Lindo <sergiolindo.empresa at gmail.com>
 license: lgplv3 (see http://www.gnu.org/licenses/lgpl.html)

 website - http://hugoruscitti.github.com/pilasweb
###
#
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
##       * @param {Object} opciones Contiene las propiedades que se quieren personalizar.
##       * @param {String} sprite Nombre del fichero de sprite para el actor.
##       */
        constructor: (imagen, opciones, @sprite="")->
            opciones = {} if not opciones?
            @imagen = pilas.imagenes.cargar imagen
            @sprite = new createjs.Bitmap @imagen.imagen
            @aplicar_opciones opciones
            pilas.agregar @

        aplicar_opciones: (opciones) ->
            @x = opciones.x or 0
            @y = opciones.y or 0
            @centro_x = opciones.centro_x or 0
            @centro_y = opciones.centro_y or 0
            @escala_x = opciones.escala_x or 1
            @escala_y = opciones.escala_y or 1
            @rotacion = opciones.rotacion or 0
            @transparencia = opciones.transparencia or 0
        # Sergio: No entiendo esta parte. ¿Cuándo se ejecuta defineProperties?
        Object.defineProperties @prototype,
            x:
                get: -> @sprite.x - 160
                set: (x) -> @sprite.x = x + 160
            y:
                get: -> 120 - @sprite.y
                set: (y) -> @sprite.y = 120 - y
            centro_x:
                get: -> @sprite.regX
                set: (dx) -> @sprite.regX = dx
            centro_y:
                get: -> @sprite.regY
                set: (dy) -> @sprite.regY = dy
            rotacion:
                get: -> @sprite.rotation
                set: (r) -> @sprite.rotation = r
            escala_x:
                get: -> @sprite.scaleX
                set: (x) -> @sprite.scaleX = x
            escala_y:
                get: -> @sprite.scaleY
                set: (y) -> @sprite.scaleY = y
            transparencia:
                get: -> 100 - (@sprite.alpha * 100)
                set: (a) -> @sprite.alpha = 1 - (a/100)

##      /**
##       * @method actualizar
##       * Se ejecuta en el bucle principal del juego para actualizar la lógica del actor.
##       */
        actualizar: ->

        __getattr__: (x) ->
            return @x

        __setattr__: (x, v) ->
            @[x] = v

    return Actor
