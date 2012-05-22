class Pilas
    iniciar: (elemento) ->
        @canvas = document.getElementById elemento
        # TODO: lanzar excepcion si no existe elemento.
        @stage = new Stage(@canvas)
        @iniciar_actores()

    iniciar_actores: ->
        @actores = []
        

pilas = new Pilas
window.pilas = pilas
