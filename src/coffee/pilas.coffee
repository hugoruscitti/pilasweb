###
 Licencia de pilasweb.
###
define ['actores/actor', 'actores/aceituna', 'actores/cooperativista', 'imagenes', 'depurador', 'fisica'],
 (Actor, Aceituna, Cooperativista, Imagenes, Depurador, Fisica)->

    class Pilas
        constructor: ->
            @lista_actores = []
            @actores =
                Actor: Actor
                Aceituna: Aceituna
                Cooperativista: Cooperativista

        iniciar: (options)->
            options = {} if not options?
            options.ancho = 320 if not options.ancho?
            options.alto = 240 if not options.alto?
            options.data_path = 'data' if not options.data_path?

            @depurador = new Depurador()
            @imagenes = new Imagenes(
                ()=>
                    @onready()
                    @mainloop()
                    `void 0`
                , options.data_path)


            @canvas_element = document.getElementsByTagName "canvas"

            if not @canvas_element?
                throw new Error "No se encuentra el elemento canvas dentro de la página."

            @canvas_element = @canvas_element[0]
            @canvas_element.width = options.ancho
            @canvas_element.height = options.alto
            `void 0`

        reiniciar: ->
            @lista_actores = []
            `void 0`

        agregar: (objeto)->
            @lista_actores.push objeto
            `void 0`

        mainloop: ->
            setInterval(
                =>
                    @actualizar()
                , 100)
            `void 0`

        actualizar: ->
            painter = @canvas_element.getContext '2d'
            @_limpiar_pantalla painter
            @depurador.comienza_dibujado painter

            for actor in @lista_actores
                actor.actualizar()
                actor.dibujar painter

                @depurador.dibuja_al_actor painter, actor

            @depurador.termina_dibujado painter
            `void 0`

        _limpiar_pantalla: (painter)->
            imagen = @imagenes.cargar('plano.png').imagen
            painter.fillStyle = painter.createPattern imagen, 'repeat'
            painter.fillRect 0, 0, 640, 480
            painter.fill()

            window.painter = painter
            `void 0`

    window.pilas = new Pilas() if not window.pilas?
    return window.pilas
