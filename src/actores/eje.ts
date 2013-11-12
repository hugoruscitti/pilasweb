/// <reference path="actor.ts"/>

class Eje extends Actor {
    
  constructor(x, y) {
    var imagen = "ejes.png";
    super(imagen, x, y);
    this.centro_x = 256;
    this.centro_y = 256;
  }

}