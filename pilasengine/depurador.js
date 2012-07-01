define(['mootools', 'singleton'], function(){
    var Depurador = new Class({

        initialize: function(pilas){
            this.pilas = pilas
            this.g = new Graphics()
        },

        comienza_dibujado: function(){
            this.g.clear()
        },

        dibuja_al_actor: function(actor){
            this.g.setStrokeStyle(1);
            this.g.beginStroke(Graphics.getRGB(255,0,0));

            var posicion = this.pilas.camara.obtener_posicion()
            this.dibujar_cruz(this.g, posicion.x + actor.x, posicion.y - actor.y)
        },

        termina_dibujado: function(){
            this.g.draw(this.pilas.contexto)
        },

        dibujar_cruz: function(g, x, y) {
            g.moveTo(x-3, y-3)
            g.lineTo(x+3, y+3)

            g.moveTo(x+3, y-3)
            g.lineTo(x-3, y+3)
        },
    })

    return {
        Depurador: Depurador,
    }
});
