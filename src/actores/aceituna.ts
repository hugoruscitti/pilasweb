/// <reference path="actor.ts"/>

class Aceituna extends Actor {
  cuadro_normal;
  cuadro_reir;
  cuadro_burlar;
  cuadro_gritar;

  constructor(x, y) {
    this.cuadro_normal = 'aceituna.png';
    this.cuadro_reir = 'aceituna_risa.png';
    this.cuadro_burlar = 'aceituna_burla.png';
    this.cuadro_gritar = 'aceituna_grita.png';

    super(this.cuadro_normal, x, y);
    this.radio_de_colision = 20;
  }

  normal() {
    this.imagen = this.cuadro_normal;
  }

  reir() {
    this.imagen = this.cuadro_reir;
  }

  gritar() {
    this.imagen = this.cuadro_gritar
  }

  burlarse() {
    this.imagen = this.cuadro_burlar;
  }

  saltar() {
    this.hacer(pilas.comportamientos.Saltar);
  }

}
