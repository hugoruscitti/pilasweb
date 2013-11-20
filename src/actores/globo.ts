/// <reference path="actor.ts"/>

class Globo extends Actor {
  mensaje;
  actor_texto;

  constructor(x, y, mensaje) {
    var imagen = "globo.png";
    super(imagen, x, y);
    this.centro_x = 85;
    this.centro_y = 80;
    this.mensaje = mensaje;
    this.actor_texto = new pilas.actores.Texto(x, y, mensaje);

    // TODO: Reemplazar por tareas, como hace pilas-python.
    var _this = this;
    setTimeout(function() {
      _this.eliminar();
    }, 3000);
  }

  eliminar() {
    this.actor_texto.eliminar();
    super.eliminar();
  }

}

