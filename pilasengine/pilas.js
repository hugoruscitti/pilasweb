define(['singleton', 'mootools', 'actores', 'camara', 'imagenes', 'singleton'], function(singleton, mootools, actores, camara, imagenes, singleton){
    //var _instancia = null;  // almacena la unica instancia de pilas (singleton).
    //exports.instancia = _instancia;

    var Pilas = new Class({

        initialize: function(id_canvas) {
            this.canvas = document.id(id_canvas)
            this.stage = new Stage(this.canvas)
            this.contexto = this.canvas.getContext("2d")
            this.lista_actores = []
            this.camara = new camara.Camara(this.canvas)
            this.imagenes = new imagenes.Imagenes()
            //this.utils = new Utils()
            //this.fisica = new Fisica()
            singleton.set(this)
            Ticker.setFPS(60)
            Ticker.addListener(this)
            //_instancia = this;
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
                actor.actualizar();
                actor.dibujar(c)
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
            this._actualizar_y_dibujar_actores(this.contexto)
        },

        /* Submodulo de actores */
        actores: actores,

        //habilidades: {
        //    Girar: Girar,
        //    RebotarComoPelota: RebotarComoPelota,
        //},
    });


    return {
        Pilas: Pilas,
    }
})
