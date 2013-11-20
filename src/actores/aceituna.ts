/// <reference path="actor.ts"/>

class Aceituna extends Actor {

  constructor(x, y) {
    var imagen = "aceituna.png";
    super(imagen, x, y);
    this.centro_x = 18;
    this.centro_y = 18;
    this.radio_de_colision = 20;
  }

}

