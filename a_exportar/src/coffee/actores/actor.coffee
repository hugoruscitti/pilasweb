###
 Licencia de pilasweb.
###
define ->
    ###
    ##/**
    ## * @class actor
    ## * Clase general de la que heredan los actores. Contiene la funcionalidad común de todos los actores.
    ## * /
    ###
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

    return Actor
