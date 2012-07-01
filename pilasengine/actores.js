define(['require', 'singleton', 'actores/actor', 'mootools', 'singleton'], function(require, singleton, actor, mootools, singleton){

    var Texto = new Class({
        Extends: actor.Actor,
        initialize: function(texto, x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
            this.texto = texto
            this.imagen = new Text(this.texto, "22px arial")
            this.imagen.textBaseline = "top"
            this.inicializar(x, y, centro_x, centro_y, escala_x, escala_y, rotacion)
            pilas.agregar_actor(this)
        },

    });

    var Aceituna = new Class({
        Extends: actor.Actor,
        initialize: function(x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
            this.parent("sin_imagen.png", x, y, centro_x, centro_y, escala_x, escala_y, rotacion)
            this.imagen = this.cargar_imagen("../data/aceituna.png")
            this.centro_x = 18
            this.centro_y = 18
        },

        actualizar: function(){
            this.x += 0.1
            this._rotacion += 10
        }
    });

    return {
        Actor: actor.Actor,
        Aceituna: Aceituna,
        Texto: Texto,
    }
})
