/// <reference path="actor.ts"/>

class Sombra extends Actor {

  constructor(x, y) {
    super("sombra.png", x, y);
    this.radio_de_colision = 20;
  }

}
