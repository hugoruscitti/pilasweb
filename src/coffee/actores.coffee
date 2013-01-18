define ->
    class Actor
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
            pilas.agregar this

        actualizar: ->

        dibujar: (painter)->
            @imagen.dibujar painter,
                @x, @y, @centro_x, @centro_y,
                @escala_x, @escala_y, @rotacion, @transparencia
            `void 0`

    class Aceituna extends Actor
        constructor: (options)->
            super 'aceituna.png', options
            @centro_x = 18
            @centro_y = 18

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

    actores =
        Aceituna: Aceituna
        Cooperativista: Cooperativista
    return actores
