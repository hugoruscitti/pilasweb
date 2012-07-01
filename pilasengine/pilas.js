define(['singleton', 'eventos', 'mootools', 'actores', 'camara', 'imagenes', 'singleton', 'depurador', 'utils'], function(singleton, eventos, mootools, actores, camara, imagenes, singleton, depurador, utils){

    var Pilas = new Class({

        initialize: function(id_canvas) {
            this.canvas = document.id(id_canvas)
            this.stage = new Stage(this.canvas)
            this.contexto = this.canvas.getContext("2d")
            this.lista_actores = []
            this.camara = new camara.Camara(this.canvas)
            this.eventos = new eventos.Eventos(this.canvas)

            // carga de imagenes
            this.imagenes = new imagenes.Imagenes()
            this.depurador = new depurador.Depurador(this)

            this.utils = new utils.Utils()
            //this.fisica = new Fisica()
            singleton.set(this)
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
            this.depurador.comienza_dibujado()

            for (var i=0; i<this.lista_actores.length; i++) {
                var actor = this.lista_actores[i]
                actor.actualizar();
                actor.dibujar(c)
                this.depurador.dibuja_al_actor(actor)
            }

            this.depurador.termina_dibujado()

        },

        /* Borra toda la pantalla */
        _limpiar: function(c) {
            this.stage.clear()
        },

        /* 
         * Función de respuesta que se llama 60 veces por segundo.
         */
        tick: function() {
            this._actualizar_y_dibujar_actores(this.contexto)
        },

        actores: actores,
    });


    return {
        Pilas: Pilas,
    }
})
