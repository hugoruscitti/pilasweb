/// <reference path="actor.ts"/>

class Explosion extends Actor {
  paso;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("explosion.png", 7);
    super(imagen, x, y);
    this.paso = 0;
  }

  actualizar() {
    this.paso += 0.1;

    if (this.paso > 1) {
      if (! this._imagen.avanzar())
        this.eliminar();
      this.paso = 0;
    }
  }
}

