/// <reference path="actor.ts"/>

class Bloque extends Actor {

  constructor(x, y, nombre_imagen) {
    var imagen = nombre_imagen || "bloque.png";
    super(imagen, x, y);
    this.z = y;
  }

}

