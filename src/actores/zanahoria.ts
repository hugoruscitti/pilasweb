/// <reference path="actor.ts"/>

class Zanahoria extends Actor {
  cuadro_normal;
  cuadro_sonrie;

  constructor(x, y) {
    this.cuadro_normal = "zanahoria_normal.png";
    this.cuadro_sonrie = "zanahoria_sonrie.png";
    super(this.cuadro_normal, x, y);
    this.radio_de_colision = 25;
  }

  normal() {
    this.imagen = this.cuadro_normal;
  }

  sonreir() {
    this.imagen = this.cuadro_sonrie;
  }

  saltar() {
    this.sonreir();
    this.hacer(pilas.comportamientos.Saltar,{cuando_termina:this.normal});
  }

  decir() {
    this.sonreir();
    super.decir("hola");
    pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
  }
}
