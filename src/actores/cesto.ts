/// <reference path="actor.ts"/>

class Cesto extends Actor {
  figura1;
  figura2;
  figura3;

  constructor(x=120, y=0) {
    var ancho = 40;
    var imagen = "cesto.png";
    super(imagen, x, y);
    this.centro_x = ancho;
    this.centro_y = ancho;
    this.radio_de_colision = 20;

    var fisica = pilas.escena_actual().fisica;

    this.figura1 = fisica.crear_rectangulo(x - ancho, 0, y + 10, 30, {dinamico: false});
    this.figura2 = fisica.crear_rectangulo(x + ancho -15, y+  0, 20, 20, {dinamico: false});
    this.figura3 = fisica.crear_rectangulo(x + ancho -5, y + 20, 5, 40, {dinamico: false});
  }

}

