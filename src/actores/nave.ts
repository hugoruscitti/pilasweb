/// <reference path="actor.ts"/>

class Nave extends Actor {
  paso;
  teclado_habilitado;
  enemigos;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("nave.png", 2);
    super(imagen, x, y);
    this.paso = 0;
    this.enemigos = [];
    this.teclado_habilitado = false;
    this.aprender(pilas.habilidades.PuedeExplotar);
    this.aprender(pilas.habilidades.SeMantieneEnPantalla);
  }

  habilitar_teclado() {
    if (this.teclado_habilitado === false) {
      this.aprender(pilas.habilidades.MoverseConElTecladoConRotacion);
      this.aprender(pilas.habilidades.Disparar);
      this.teclado_habilitado = true;
      return "Habilitando el teclado";
    } else {
      return "El teclado ya estaba habilitado.";
    }
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)
    var control = pilas.escena_actual().control;
  }

  disparar() {
    var disparo = new pilas.actores.Proyectil(this.x, this.y, {rotacion: this.rotacion - 90});
    disparo.enemigos = this.enemigos;
    return "Disparando ...";
  }

  avanzar(velocidad) {
    var rotacion_en_radianes;
    var dx;
    var dy;

    if (velocidad === undefined)
      velocidad = 10;

    var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.rotacion + 90);

    dx = Math.cos(rotacion_en_radianes) * velocidad;
    dy = Math.sin(rotacion_en_radianes) * velocidad;

    this.x += dx;
    this.y += dy;
  }

  definir_enemigos(enemigos) {
    this.enemigos = enemigos;
    return "Definiendo enemigos.";
  }

}
