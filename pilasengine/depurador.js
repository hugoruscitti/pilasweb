define(['mootools', 'singleton'], function(){

    var ModoPuntoDeControl = new Class({

        initialize: function(depurador){
            this.depurador = depurador
            this.g = depurador.g
            this.pilas = depurador.pilas
        },

        dibuja_al_actor: function(actor){
            var posicion = this.pilas.camara.obtener_posicion()
            this.dibujar_cruz(this.g, posicion.x + actor.x, posicion.y - actor.y)
        },

        dibujar_cruz: function(g, x, y) {
            this.g.setStrokeStyle(1);
            this.g.beginStroke(Graphics.getRGB(255,0,0));

            g.moveTo(x-3, y-3)
            g.lineTo(x+3, y+3)

            g.moveTo(x+3, y-3)
            g.lineTo(x-3, y+3)
        },
    })

    var Depurador = new Class({

        initialize: function(pilas){
            this.pilas = pilas
            this.g = new Graphics()
            this.modos = [new ModoPuntoDeControl(this)]
        },

        comienza_dibujado: function(){
            this.g.clear()
        },

        dibuja_al_actor: function(actor){
            for (i=0; i<this.modos.length; i++)
                this.modos[i].dibuja_al_actor(actor)
        },

        termina_dibujado: function(){
            this.g.draw(this.pilas.contexto)
        },


    })

    return {
        Depurador: Depurador,
    }
});
