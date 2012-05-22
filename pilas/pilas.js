(function() {
  var Pilas, pilas;

  Pilas = (function() {

    function Pilas() {}

    Pilas.prototype.iniciar = function(elemento) {
      this.canvas = document.getElementById(elemento);
      this.stage = new Stage(this.canvas);
      return this.iniciar_actores();
    };

    Pilas.prototype.iniciar_actores = function() {
      return this.actores = [];
    };

    return Pilas;

  })();

  pilas = new Pilas;

  window.pilas = pilas;

}).call(this);
