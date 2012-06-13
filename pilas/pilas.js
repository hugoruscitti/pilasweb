var Actor = new Class({
    initialize: function(imagen, x, y, centro_x, centro_y) {
        this.imagen = new Bitmap(imagen)
        this.x = x || 0
        this.y = y || 0
        this.centro_x = centro_x || 0
        this.centro_y = centro_y || 0

        pilas.agregar_actor(this)
    },

    actualizar: function() {
    },

    dibujar: function(contexto) {
        contexto.translate(- this.centro_x, - this.centro_y)
        contexto.rotate(0)
        contexto.translate(this.x, -this.y)
        pilas.camara.fijar_posicion(contexto)
        this.imagen.draw(contexto)
    },

    eliminar: function() {
        pilas.eliminar_actor(this)
    },
});

var Texto = new Class({
    Extends: Actor,
    initialize: function(texto) {
        this.texto = texto
        this.object = new Text(this.texto, "22px arial")
        this.object.textBaseline = "top"
        this.x = 0
        this.y = 0
        pilas.agregar_actor(this)
    },

    actualizar: function() {
    },

    dibujar: function(contexto) {
        contexto.translate(this.x, this.y)
        this.object.draw(contexto)
    },
});

var Camara = new Class({
    initialize: function(canvas) {
        this.canvas = canvas
        this.x = 0
        this.y = 0
        this.centro_x = canvas.width / 2
        this.centro_y = canvas.height / 2
    },

    fijar_posicion: function(contexto) {
        contexto.translate(this.centro_x - this.x, this.centro_y + this.y);
    },
})

var Pilas = new Class({
    initialize: function() {
    },

    iniciar: function(id_canvas) {
        this.canvas = document.id(id_canvas)
        this.stage = new Stage(this.canvas)
        this.contexto = this.canvas.getContext("2d")
        this.lista_actores = []
        this.camara = new Camara(this.canvas)

        Ticker.setFPS(60)
        Ticker.addListener(this)
    },

    /*
     * Agrega un actor a la lista de actores a dibujar y actualizar.
     */
    agregar_actor: function(actor) {
        this.lista_actores.push(actor)
    },

    eliminar_actor: function(actor) {
        this.lista_actores.erase(actor)
    },

    _actualizar_y_dibujar_actores: function(c) {

        this._limpiar(c)

        for (var i=0; i<this.lista_actores.length; i++) {
            var actor = this.lista_actores[i]

            c.save();
            actor.actualizar();
            actor.dibujar(c)
            c.restore();
        }
    },

    /* Borra toda la pantalla */
    _limpiar: function(c) {
        c.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },

    /* 
     * Función de respuesta que se llama 60 veces por segundo.
     */
    tick: function() {
        pilas._actualizar_y_dibujar_actores(this.contexto)
    },

    /* Submodulo de actores */
    actores: {
        Actor: Actor,
        Texto: Texto,
        },
});


/*
pilas.iniciar = pilas.init
pilas.actores = pilas.actors
pilas.actores.Texto = pilas.actores.Text
*/
