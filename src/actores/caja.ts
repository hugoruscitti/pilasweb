/// <reference path="actor.ts"/>

class Caja extends Actor {

  constructor(x, y) {
    var imagen = "caja.png";
    super(imagen, x, y);
    this.radio_de_colision = 25;

    this.aprender(pilas.habilidades.RebotarComoCaja);
  }

}

