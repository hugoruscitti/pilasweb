###
 Licencia de pilasweb.
###
define ['actores/actor'], (Actor) ->

    class Cooperativista extends Actor
        constructor: (options)->
            super 'aceituna.png', options
            @imagen = pilas.imagenes.cargar_grilla(
                "cooperativista/camina.png", 4, 1)
            @centro_x = 50
            @centro_y = 108

        actualizar: ->
            @imagen.avanzar()
            `void 0`

    return Cooperativista
