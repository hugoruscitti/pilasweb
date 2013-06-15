class Actor {
  sprite;
  imagen;

  constructor(x, y, imagen) {
    this.imagen = imagen || pilas.imagenes.cargar('sin_imagen.png');
    this.sprite = new createjs.Bitmap(this.imagen.imagen);
    pilas.escena_actual().agregar_actor(this);
  }

  // TODO: convertir con un metodo de la escena, que tome
  //       en cuenta la coordenada de pantalla y la cámara.
  get x() {return this.sprite.x};
  set x(_x) {this.sprite.x = _x};

  get y() {return this.sprite.y};
  set y(_y) {return this.sprite.y = _y};

  actualizar() {
  }
}
