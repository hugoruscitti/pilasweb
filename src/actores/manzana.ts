/// <reference path="actor.ts"/>

class Manzana extends Actor {

  constructor(x, y) {
    var imagen = "manzana_chica.png"; // TODO: reemplazar por manzana.png
    super(imagen, x, y);
    this.radio_de_colision = 11;
  }

}

