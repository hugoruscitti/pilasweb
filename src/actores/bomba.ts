/// <reference path="actor.ts"/>

class Bomba extends Actor {
  paso;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("bomba.png", 2);
    super(imagen, x, y);
    this.radio_de_colision = 25;
    this.paso = 0;
    this.aprender(pilas.habilidades.PuedeExplotar);
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)
  }
}
