// <reference path="comportamientos.ts />

class AlienMarron extends Actor {
  sombra;
  limitar_movimientos;
  sonido_blabla;
  cuando_busca_recoger;

  constructor(x=0, y=0) {
    var imagen = pilas.imagenes.cargar_animacion('alien_marron.png', 14);
    super(imagen, x, y);

    window['alien'] = this;

    imagen.definir_animacion("parado", [11, 11], 5);
    imagen.definir_animacion("hablar", [12, 13, 11, 12, 11, 13], 15);
    imagen.definir_animacion("recoger", [12, 10, 10, 10, 10, 12], 5);
    imagen.definir_animacion("camina", [0, 1, 2, 3, 4, 3, 2, 1], 15);
    imagen.cargar_animacion("parado");

    this.sonido_blabla = pilas.sonidos.cargar('blabla.wav');
    this.cuando_busca_recoger = undefined;
  }

  iniciar() {
    this.sombra = new pilas.actores.Sombra();
    this.sombra.escala = 0.5;
    this.limitar_movimientos = true;

    this.centro_y = 'abajo';
    this.centro_y -= 10;
  }

  decir(mensaje) {
    //this.hacer_luego(Hablar, {mensaje: mensaje, tiempo: 1});
  }

  super_decir(mensaje) {
    super.decir(mensaje);
    this.sonido_blabla.reproducir();
  }

  actualizar() {
    this.z = this.y;

    this.sombra.x = this.x;
    this.sombra.y = this.y;
    this.sombra.z = this.z + 1;
  }

  avanzar_animacion() {
    return this._imagen.avanzar();
  }


  ir_derecha() {
    //this.hacer_luego(MoverHaciaDerecha, {cantidad: 68, tiempo: 1});
  }

  ir_izquierda() {
    //this.hacer_luego(MoverHaciaIzquierda, {cantidad: 68, tiempo: 1});
  }

  ir_arriba() {
    //this.hacer_luego(MoverHaciaArriba, {cantidad: 80, tiempo: 1});
  }

  ir_abajo() {
    //this.hacer_luego(MoverHaciaAbajo, {cantidad: 80, tiempo: 1});
  }

  esperar(tiempo=2) {
    //this.hacer_luego(Esperar, {tiempo: tiempo});
  }

  detener() {
    //this.esperar(0);
  }

  recoger() {
    //this.hacer_luego(Recoger, {tiempo: 1});
  }

}
