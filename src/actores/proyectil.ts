/// <reference path="actor.ts"/>

class Proyectil extends Actor {
  paso;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("disparos/misil.png", 3);
    super(imagen, x, y);
    this.centro_x = 20;
    this.centro_y = 8;
    this.paso = 0;
    //this.aprender(pilas.habilidades.PuedeExplotar);
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)
    
    // TODO: Convertir en una habilidad.
    this.avanzar_respecto_del_angulo();
  }
  
  avanzar_respecto_del_angulo() {
    var velocidad = 2;
    var rotacion_en_radianes;
    var dx;
    var dy;
    
    var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.rotacion + 90 - 90);
    
    dx = Math.cos(rotacion_en_radianes) * velocidad;
    dy = Math.sin(rotacion_en_radianes) * velocidad;
    
    this.x += dx;
    this.y += dy;
  }
}
