define(['mootools'], function(mootools) {
  /**
   * Permite realizar efectos de movimiento de cámara y aumentar el area de juego.
   */
  var Camara = new Class({
    initialize: function(canvas) {
      this.canvas = canvas;
      this.x = 0;
      this.y = 0;
      this.centro_x = canvas.width / 2;
      this.centro_y = canvas.height / 2;
    },

    /**
     * Aplica el cambio de posicion o vista de camara sobre un canvas.
     */
    fijar_posicion: function(contexto) {
      contexto.translate(this.centro_x - this.x, this.centro_y + this.y);
    },

    /**
     * Retorna la posición de la cámara.
     */
    obtener_posicion: function() {
      return {x: this.centro_x - this.x, 
              y: this.centro_y + this.y};
    },

    convertir_de_posicion_relativa_a_fisica: function(x, y) {
      var centro = this.obtener_posicion();
      return {x: centro.x + x,
              y: centro.y - y}
    },

    convertir_de_posicion_fisica_a_relativa: function(x, y) {
      var centro = this.obtener_posicion();
      return {x: - centro.x + x,
              y: + centro.y - y}

    },

  });

  return {
    Camara: Camara
  };
});
