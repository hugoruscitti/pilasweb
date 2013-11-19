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
  }

}

