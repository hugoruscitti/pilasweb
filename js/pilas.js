(function() {
  var Actor, Pilas, Texto, pilas;

  Pilas = (function() {

    function Pilas() {}

    Pilas.prototype.iniciar = function(elemento) {
      this.canvas = document.getElementById(elemento);
      this.stage = new Stage(this.canvas);
      return this.actores = [];
    };

    Pilas.prototype.agregar_actor = function(actor) {
      return this.actores.push(actor);
    };

    Pilas.prototype.actualizar_y_dibujar_actores = function(contexto) {
      var actor, _i, _len, _ref, _results;
      this.limpiar_pantalla(contexto);
      _ref = this.actores;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actor = _ref[_i];
        contexto.save();
        actor.actualizar();
        actor.dibujar(contexto);
        _results.push(contexto.restore());
      }
      return _results;
    };

    Pilas.prototype.limpiar_pantalla = function(contexto) {
      return contexto.clearRect(0, 0, pilas.canvas.width, pilas.canvas.height);
    };

    return Pilas;

  })();

  Actor = (function() {

    function Actor(ruta_imagen, x, y) {
      this.x = x;
      this.y = y;
      this.imagen = new Bitmap(ruta_imagen);
      window.pilas.agregar_actor(this);
    }

    Actor.prototype.dibujar = function(contexto) {
      contexto.translate(this.x, this.y);
      return this.imagen.draw(contexto);
    };

    Actor.prototype.actualizar = function() {
      return this.x = this.x + 0.1;
    };

    return Actor;

  })();

  Texto = (function() {

    function Texto(texto, x, y) {
      this.texto = texto;
      this.x = x;
      this.y = y;
      this.text = new Text(this.texto, "22px arial");
      this.text.textBaseline = "top";
      window.pilas.agregar_actor(this);
    }

    Texto.prototype.actualizar = function() {
      return "";
    };

    Texto.prototype.dibujar = function(contexto) {
      contexto.translate(this.x, this.y);
      return this.text.draw(contexto);
    };

    return Texto;

  })();

  pilas = new Pilas;

  window.pilas = pilas;

  window.Actor = Actor;

  window.Texto = Texto;

}).call(this);
