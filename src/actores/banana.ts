class Banana extends Actor {
  constructor(x=0, y=0) {
    var imagen = pilas.imagenes.cargar_grilla('banana.png', 2)
    super(imagen,x,y)
    this._imagen.definir_cuadro(0)
  }

  cerrar() {
    this._imagen.definir_cuadro(0)
  }

  abrir() {
    this._imagen.definir_cuadro(1)
  }
}
