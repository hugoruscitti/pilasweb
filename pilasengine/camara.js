define(['mootools'], function(mootools) {
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

    return {
        Camara: Camara,
    }
})
