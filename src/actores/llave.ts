/// <reference path="actor.ts"/>

class Llave extends Actor {

  constructor(x, y) {
    var imagen = "llave.png";
    super(imagen, x, y);
    this.z = y;
  }

}

