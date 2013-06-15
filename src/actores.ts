class Actores {
  Aceituna;

  constructor() {
    this.Aceituna = Aceituna;
  }
}

class Aceituna {
  sprite;
  imagen;

  constructor() {
    this.imagen = pilas.imagenes.cargar("aceituna.png");
    this.sprite = new createjs.Bitmap(this.imagen.imagen);

    pilas.escena_actual().agregar_actor(this);
  }

  get x() {return this.sprite.x};
  set x(_x) {this.sprite.x = _x};

  get y() {return this.sprite.y};
  set y(_y) {return this.sprite.y = _y};

  actualizar() {
  }
}

