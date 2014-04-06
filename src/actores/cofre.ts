/// <reference path="actor.ts"/>

class Cofre extends Actor {
  paso;
  esta_abierto;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("cofre.png", 4);
    super(imagen, x, y);
    this.z = y;
    this._imagen.definir_cuadro(0);
    this.paso = 0;
    this.esta_abierto = false;
  }

  abrir() {
    this.esta_abierto = true;
  }

  actualizar() {
    // TODO: temporal para el tutorial
    if (this.esta_abierto) {
      this.paso += 0.1;

      if (this.paso > 3)
        this.paso = 3;

      this._imagen.definir_cuadro(parseInt(this.paso))
    }
  }

}

