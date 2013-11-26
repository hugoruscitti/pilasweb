/// <reference path="actor.ts"/>

class Pelota extends Actor {
  figura;

  constructor(x, y) {
    var imagen = "pelota.png";
    super(imagen, x, y);
    this.centro_x = 25;
    this.centro_y = 25;
    this.radio_de_colision = 25;

    this.aprender(pilas.habilidades.RebotarComoPelota);
    window['aaa'] = this;
  }

  empujar(dx, dy) {
    this.figura.empujar(dx * 100, -dy * 100);
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

