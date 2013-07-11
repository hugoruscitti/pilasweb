/// <reference path="actor.ts"/>

class Pelota extends Actor {

  constructor(x, y) {
    var imagen = "pelota.png";
    super(imagen, x, y);
    this.centro_x = 25;
    this.centro_y = 25;
  }

}

