###
 -*- encoding: utf-8 -*-
 pilasweb engine - a video game framework.

 copyright 2013 - Hugo Ruscitti, Sergio Lindo <sergiolindo.empresa at gmail.com>
 license: lgplv3 (see http://www.gnu.org/licenses/lgpl.html)

 website - http://hugoruscitti.github.com/pilasweb
###
define ['actores/actor'], (Actor) ->
##  /**
##   * @class Pilas.fondos.Plano
##   * Fondo básico para usarlo en la escena.
##   *
##   */
    class Plano extends Actor
##      /**
##       * @constructor
##       * Constructor del fondo plano.
##       *
##       * @param {Object} opciones TODO descripción.
##       * @param {String} sprite Nombre del fichero sprite para el actor.
##       */
        constructor: (opciones, @sprite="")->
            return new Plano(opciones) if not (@ instanceof Plano)
            @imagen = pilas.imagenes.cargar "plano.png"

            # NOTA: no se llama al constructor del actor, porque en este
            # caso se quiere crear un sprite basado en un shape y no en un
            # Bitmap.
            g = new createjs.Graphics()
            g.beginBitmapFill @imagen.imagen
            g.drawRect 0, 0, 600, 600   # TODO: obtener el tamano del canvas y no 600 600
            @sprite = new createjs.Shape g
            pilas.agregar @

    return Plano
