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

  get centro_x() {return this.sprite.regX};
  set centro_x(_x) {this.sprite.regX = _x};

  get centro_y() {return this.sprite.regY};
  set centro_y(_y) {this.sprite.regY = _y};

  get escala_x() {return this.sprite.scaleX};
  set escala_x(_x) {this.sprite.scaleX = _x};

  get escala_y() {return this.sprite.scaleY};
  set escala_y(_y) {this.sprite.scaleY = _y};

  get rotacion() {return this.sprite.rotation};
  set rotacion(_r) {this.sprite.rotation = _r};

  get transparencia() {return (-100 * this.sprite.alpha) + 100};
  set transparencia(_t) {this.sprite.alpha = (_t - 100) / -100};

  actualizar() {
  }
}
