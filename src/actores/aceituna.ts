/// <reference path="actor.ts"/>

class Aceituna extends Actor {

  constructor() {
    var imagen = pilas.imagenes.cargar("aceituna.png");
    super(0, 0, imagen);
    this.centro_x = 18;
    this.centro_y = 18;
  }

}

