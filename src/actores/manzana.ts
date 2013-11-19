/// <reference path="actor.ts"/>

class Manzana extends Actor {

  constructor(x, y) {
    var imagen = "manzana_chica.png"; // TODO: reemplazar por manzana.png
    super(imagen, x, y);
    console.log(this.ancho);
  }

}

