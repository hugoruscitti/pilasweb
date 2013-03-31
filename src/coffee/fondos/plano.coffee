###
 Licencia de pilasweb.
###
define ['actores/actor'], (Actor) ->
    class Plano extends Actor
        constructor: (options, @sprite="")->
            return new Plano(options) if not (@ instanceof Plano)
            @imagen = pilas.imagenes.cargar "plano.png";

            # NOTA: no se llama al contructor de actor, porque en este
            # caso se quiere crear un sprite basado en un shape y no un
            # Bitmap.
            g = new createjs.Graphics()
            g.beginBitmapFill(@imagen.imagen)
            g.drawRect(0, 0, 600, 600)   # TODO: obtener el tamano del canvas y no 600 600
            @sprite = new createjs.Shape(g)
            pilas.agregar @

    return Plano
