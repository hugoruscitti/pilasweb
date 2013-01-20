###
 Licencia de pilasweb.
###
define ['actores/actor'], (Actor) ->

    class Aceituna extends Actor
        constructor: (options)->
            super 'aceituna.png', options
            @centro_x = 18
            @centro_y = 18

    return Aceituna
