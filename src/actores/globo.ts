/// <reference path="actor.ts"/>

class Globo extends Actor {
  mensaje;
  actor_texto;

  constructor(x, y, mensaje) {
    console.log(x, y, mensaje);
    super("globo.png", 0, 0);
    this.mensaje = mensaje;
    this.x = x;
    this.y = y;
    var mensaje = this.mensaje;

    this.actor_texto = new pilas.actores.Texto(x, y, mensaje);
    this.actor_texto.z = -1000;

    pilas.mundo.agregar_tarea_una_vez(3, this.eliminar, {}, this);
  }

  eliminar() {
    this.actor_texto.eliminar();
    super.eliminar();
  }
}
