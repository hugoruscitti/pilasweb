/// <reference path="actor.ts"/>

class Globo extends Actor {
  mensaje;
  actor_texto;

  constructor(x, y, mensaje) {
    var imagen = "globo.png";
    super(imagen, x, y);
    this.mensaje = mensaje;
    this.actor_texto = new pilas.actores.Texto(x-20, y, mensaje);
    this.actor_texto.z = this.z - 10;

    pilas.mundo.agregar_tarea_una_vez(3, this.eliminar, {}, this);
  }

  eliminar() {
    this.actor_texto.eliminar();
    super.eliminar();
  }

}
