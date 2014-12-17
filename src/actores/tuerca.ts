/// <reference path="actor.ts"/>

class Tuerca extends Actor {
  y_original;
  contador;
  sombra;

  constructor(x, y) {
    var imagen = "tuerca.png";
    super(imagen, x, y);
    this.radio_de_colision = 11;
    this.y_original = y + 20;
    this.x = x + 10;
    this.contador = Math.random() * 3;
    this.sombra = new pilas.actores.Sombra();
    this.sombra.escala = 0.25;
  }

  actualizar() {
    this.contador += 0.025;
    this.y = this.y_original + Math.sin(this.contador) * 5;
    this.sombra.x = this.x;
    this.sombra.y = this.y_original - 20;
    this.sombra.z = this.z + 1;
  }
}
