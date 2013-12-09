/// <reference path="actor.ts"/>

class Proyectil extends Actor {
  paso;
  enemigos;

  constructor(x, y, atributos) {
    var imagen = pilas.imagenes.cargar_grilla("disparos/misil.png", 3);
    atributos['centro_x'] = 20;
    atributos['centro_y'] = 8;
    super(imagen, x, y, atributos);

    this.paso = 0;
    this.enemigos = [];
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)
    
    // TODO: Convertir en una habilidad.
    this.avanzar_respecto_del_angulo();
    this.analizar_colisiones();
  }
  
  analizar_colisiones() {
    for (var i=0; i<this.enemigos.lista.length; i++) {
      var enemigo = this.enemigos.lista[i];

      if (enemigo.vivo && enemigo.colisiona_con_un_punto(this.x, this.y)) {
        enemigo.eliminar();
        this.eliminar();
      }
    }
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
