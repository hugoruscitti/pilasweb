class Pingu extends Actor {
  paso;
  cuadros_correr;
  saltando;
  constructor(x=0, y=0) {
    var imagen = pilas.imagenes.cargar_grilla('pingu.png', 10);
    super(imagen, x, y);
    this._imagen.definir_cuadro(4);
    this.paso = 0;
    this.centro_y = 50;
    this.cuadros_correr = [5,6,7,8,9];
    this.saltando = false;
  }

  actualizar() {
    if (!this.saltando) {
      if (pilas.escena_actual().control.derecha) {
        this.hacer(pilas.comportamientos.CaminaDerecha);
      }
      else if (pilas.escena_actual().control.izquierda) {
        this.hacer(pilas.comportamientos.CaminaIzquierda);
      }

      if (pilas.escena_actual().control.arriba) {
        this.saltando = true;
        this.hacer(pilas.comportamientos.Saltando, {cuando_termina:this.puede_saltar});
        this._imagen.definir_cuadro(0);
      }

    }
  }

  puede_saltar() {
    this.saltando = false;
    this.detener_animacion();
  }

  mover(x,y) {
    this.x += x;
    this.animacion_correr();
  }

  animacion_correr() {
    this.paso += .3;
    if (this.paso>this.cuadros_correr.length) {
      this.paso = 0;
    }
    this._imagen.definir_cuadro(this.cuadros_correr[parseInt(this.paso)]);
  }

  detener_animacion() {
    this._imagen.definir_cuadro(4);
  }
}
