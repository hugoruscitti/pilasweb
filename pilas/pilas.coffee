class Pilas
    iniciar: (elemento) ->
        @canvas = document.getElementById elemento
        # TODO: lanzar excepcion si no existe elemento.
        @stage = new Stage(@canvas)
        @actores = []
        @contexto = @canvas.getContext '2d'
        Ticker.setFPS 60
        #Ticker.addListener this.tick

    agregar_actor: (actor) ->
        @actores.push actor

    actualizar_y_dibujar_actores: (contexto) ->
        this.limpiar_pantalla contexto
        for actor in @actores
            contexto.save()
            actor.actualizar()
            actor.dibujar contexto 
            contexto.restore()

    tick: ->
        this.actualizar_y_dibujar_actores @contexto
        
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
        @x = @x

class Texto
    constructor: (@texto, @x, @y) ->
        @text = new Text @texto, "22px arial"
        @text.textBaseline = "top"
        window.pilas.agregar_actor this

    actualizar: ->
        ""

    dibujar: (contexto) ->
        contexto.translate @x, @y
        @text.draw contexto

pilas = new Pilas
window.Actor = Actor
#window.Texto = Texto

window.pilas = pilas
