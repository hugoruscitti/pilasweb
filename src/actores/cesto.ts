/// <reference path="actor.ts"/>

class Cesto extends Actor {
  figura1;
  figura2;

  constructor(x, y) {
    var ancho = 40;
    var imagen = "cesto.png";
    super(imagen, x, y);
    this.centro_x = ancho;
    this.centro_y = ancho;
    this.radio_de_colision = 20;

    var fisica = pilas.escena_actual().fisica;

    this.figura1 = fisica.crear_rectangulo(-ancho, 0, 10, 30, {dinamico: false});
    this.figura1 = fisica.crear_rectangulo(+ancho, 0, 10, 30, {dinamico: false});



  }

}

