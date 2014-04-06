/// <reference path="actor.ts"/>

class Proyectil extends Actor {
  paso;
  enemigos;

  constructor(x, y, atributos) {
    var imagen = pilas.imagenes.cargar_grilla("disparos/misil.png", 3);
    super(imagen, x, y, atributos);
    this.hacer(pilas.comportamientos.AvanzarComoProyectil);
    this.paso = 0;
    this.enemigos = [];
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)

    this.analizar_colisiones();
  }

  analizar_colisiones() {
      for (var i=0; i<this.enemigos.length; i++) {
        var enemigo = this.enemigos[i];

        if (enemigo.vivo && enemigo.colisiona_con_un_punto(this.x, this.y)) {
          enemigo.eliminar();
          this.eliminar();
        }
      }
  }
}
