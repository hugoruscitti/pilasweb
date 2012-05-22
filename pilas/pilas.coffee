class Pilas
    iniciar: (elemento) ->
        @canvas = document.getElementById elemento
        # TODO: lanzar excepcion si no existe elemento.
        @stage = new Stage(@canvas)
        @actores = []

    agregar_actor: (actor) ->
        @actores.push actor

    actualizar_y_dibujar_actores: (contexto) ->
        this.limpiar_pantalla contexto
        for actor in @actores
            contexto.save()
            actor.actualizar()
            actor.dibujar contexto 
            contexto.restore()
        
    limpiar_pantalla: (contexto) ->
        contexto.clearRect(0, 0, pilas.canvas.width, pilas.canvas.height)
class Actor
    constructor: (ruta_imagen, @x, @y) ->
        @imagen = new Bitmap(ruta_imagen)
        window.pilas.agregar_actor this
        
    dibujar: (contexto) ->
        contexto.translate @x, @y
        @imagen.draw contexto

    actualizar: ->
        @x = @x + 0.1

pilas = new Pilas
window.pilas = pilas
window.Actor = Actor
