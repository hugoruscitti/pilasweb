/// <reference path="actor.ts"/>

class Pelota extends Actor {
  figura;

  constructor(x, y) {
    var imagen = "pelota.png";
    super(imagen, x, y);
    this.radio_de_colision = 25;

    this.aprender(pilas.habilidades.RebotarComoPelota);
  }

  empujar(dx, dy) {
    this.figura.empujar(dx * 100, -dy * 100);
    return "empujando hacia (" + dx + ", " + dy + ") ...";
  }

  posicion(x, y) {
    if (this.figura !== undefined) {
      this.figura.definir_posicion(x, y);
    } else {
      this.x = x;
      this.y = y;
    }
  }

}

