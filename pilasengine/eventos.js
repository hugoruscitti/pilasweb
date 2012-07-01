define(['mootools'], function(){
    var Evento = new Class({
        initialize: function(){
            this.suscriptores = []
        },

        conectar: function(suscriptor){
            this.suscriptores.push(suscriptor)
        },

        emitir: function(datos){
            for (var i=0; i<this.suscriptores.length; i++)
                this.suscriptores[i](datos)
        }

    });


    var Eventos = new Class({
        initialize: function(canvas){
            this.canvas = canvas
            this.click_de_mouse = new Evento()

            this.conectar_eventos()
        },

        conectar_eventos: function(){
            var eventos = this

            this.canvas.onclick = function(e) {
                eventos.click_de_mouse.emitir({x: e.clientX, y:e.clientY}) 
            }

        },


    })

    return {
        Eventos: Eventos
    }
})
