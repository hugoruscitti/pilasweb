/// <reference path="actor.ts"/>

class Nave extends Actor {
  paso;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("nave.png", 2);
    super(imagen, x, y);
    this.centro_x = 23;
    this.centro_y = 23;
    this.paso = 0;
    this.aprender(pilas.habilidades.PuedeExplotar);
    this.aprender(pilas.habilidades.MoverseConElTecladoConRotacion);
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)
    var control = pilas.escena_actual().control;
  }
  
  disparar() {
    // TODO: convertir en una habilidad.
    var disparo = new pilas.actores.Proyectil();
    disparo.rotacion = this.rotacion - 90;
    disparo.x = this.x;
    disparo.y = this.y;
  }
  
  avanzar(velocidad) {
    var rotacion_en_radianes;
    var dx;
    var dy;
    
    var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.rotacion + 90);
    
    dx = Math.cos(rotacion_en_radianes) * velocidad;
    dy = Math.sin(rotacion_en_radianes) * velocidad;
    
    this.x += dx;
    this.y += dy;
  }
  
}
