/// <reference path="actor.ts"/>

class Bomba extends Actor {
  paso;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("bomba.png", 2);
    super(imagen, x, y);
    this.centro_x = 36;
    this.centro_y = 31;
    this.paso = 0;
    this.aprender(pilas.habilidades.PuedeExplotar);
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)
  }
}
