/// <reference path="actor.ts"/>

class Caja extends Actor {

  constructor(x, y) {
    var imagen = "caja.png";
    super(imagen, x, y);
    this.centro_x = 24;
    this.centro_y = 24;
    this.radio_de_colision = 45;
  }

  iniciar() {
    this.aprender(pilas.habilidades.RebotarComoPelota);
  }

}

