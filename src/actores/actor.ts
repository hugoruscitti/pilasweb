class Actor {
  sprite;
  _imagen;

  constructor(x, y, imagen) {
    this.imagen = imagen || 'sin_imagen.png';
    this.crear_sprite();
    this.x = x || 0;
    this.y = y || 0;
    this.centro_x = this.ancho / 2;
    this.centro_y = this.alto / 2;
    pilas.escena_actual().agregar_actor(this);
  }

  private crear_sprite() {
    this.sprite = new createjs.Bitmap(this._imagen.imagen);
  }

  // TODO: convertir con un metodo de la escena, que tome
  //       en cuenta la coordenada de pantalla y la cámara.
  get x() {
    var pos = pilas.escena_actual().obtener_posicion_escenario(this.sprite.x, 0);
    return pos.x;
  }

  set x(_x) {

    if (_x instanceof Array) {
      var step = 1000 / _x.length;
      var tween = createjs.Tween.get(this);
      
      for (var i=0; i<_x.length; i++)
        tween = tween.to({'x': _x[i]}, step)

    } else {
      var pos = pilas.escena_actual().obtener_posicion_pantalla(_x, 0);
      this.sprite.x = pos.x;
    }
  };

  get y() {return this.sprite.y};
  set y(_y) {
    var pos = pilas.escena_actual().obtener_posicion_pantalla(0, _y);
    this.sprite.y = pos.y;
  };

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

  get ancho() {return this._imagen.ancho};
  get alto() {return this._imagen.alto};

  set imagen(_i) {
    if (_i.substring)
      this._imagen = pilas.imagenes.cargar(_i)
    else
      this._imagen = _i;
  }

  actualizar() {
  }
}
