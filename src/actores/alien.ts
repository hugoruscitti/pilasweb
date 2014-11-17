class Alien extends Actor {
  constructor(x=0, y=0) {
    var imagen = pilas.imagenes.cargar_grilla('alien_camina.png', 1);
    super(imagen, x, y);
    this._imagen.definir_cuadro(0);
  }
}
