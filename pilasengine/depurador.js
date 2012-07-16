define(['mootools', 'singleton'], function(){

    /**
     * @extends ModoDepurador
     *
     * Muestra el punto de control o centro de cada uno de los actores.
     */
    var ModoPuntoDeControl = new Class({
        Extends: ModoDepurador,

        initialize: function(depurador){
            this.depurador = depurador;
            this.g = depurador.g;
            this.pilas = depurador.pilas;
        },

        dibuja_al_actor: function(actor){
            var posicion = this.pilas.camara.obtener_posicion();
            this.dibujar_cruz(this.g, posicion.x + actor.x, posicion.y - actor.y);
        },

        /**
         * @private
         */
        dibujar_cruz: function(g, x, y) {
            this.g.setStrokeStyle(1);
            this.g.beginStroke(Graphics.getRGB(255,0,0));

            g.moveTo(x-3, y-3);
            g.lineTo(x+3, y+3);

            g.moveTo(x+3, y-3);
            g.lineTo(x-3, y+3);
        }
    });

    /**
     * Representa uno de los posibles modos del depurador.
     */
    var ModoDepurador = new Class({
      /**
       * Se invoca en cada dibujado de actor.
       */
        dibuja_al_actor: function(actor){
        },
    });

    /**
     * Permite generar graficos auxiliales sobre el canvas para depurar.
     */
    var Depurador = new Class({

        initialize: function(pilas){
            this.pilas = pilas;
            this.g = new Graphics();
            this.modos = [];
        },

        definir_modos: function(opciones) {
            this.modos = [];

            if (opciones.depuracion)
                this.modos.push(new ModoPuntoDeControl(this));
        },

        comienza_dibujado: function(){
            this.g.clear();
        },

        dibuja_al_actor: function(actor){
            for (i=0; i<this.modos.length; i++)
                this.modos[i].dibuja_al_actor(actor);
        },

        termina_dibujado: function(){
            this.g.draw(this.pilas.contexto);
        }


    });

    return {
        Depurador: Depurador
    };
});
