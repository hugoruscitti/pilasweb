/// <reference path="actores/actor.ts"/>


class Fondo extends Actor {

  constructor(imagen, x, y) {
    super(imagen, x, y);
    this.z = 1000;
  }

}


class Tarde extends Fondo {

  constructor() {
    super("fondos/tarde.jpg", 0, 0);
    this.z = 1000;
    this.y = 120;   // TODO: temporal solo para tutorial.
  }

}

class Plano extends Fondo {

  constructor() {
    super('plano.png', 0, 0);
    this.sprite.regX = 0;
    this.sprite.regY = 0;
  }

   crear_sprite() {
    var img = this._imagen.imagen;
    var s = new createjs.Shape();

    s.graphics.beginBitmapFill(img, 'repeat');
    s.graphics.drawRect(-pilas.opciones.ancho/2, -pilas.opciones.alto/2,
      pilas.opciones.ancho, pilas.opciones.alto);
    this.sprite = s;
  }

  actualizar() {
  }
}

class Pasto extends Fondo {

  constructor() {
    super('pasto.png', 0, 0);
    this.sprite.regX = 0;
    this.sprite.regY = 0;
  }

   crear_sprite() {
    var img = this._imagen.imagen;
    var s = new createjs.Shape();

    s.graphics.beginBitmapFill(img, 'repeat');
    s.graphics.drawRect(-pilas.opciones.ancho/2, -pilas.opciones.alto/2,
      pilas.opciones.ancho, pilas.opciones.alto);
    this.sprite = s;
  }

  actualizar() {
  }
}

class PastoCuadriculado extends Fondo {

  constructor() {
    super('pasto_cuadriculado.png', 0, 0);
  }

  actualizar() {
  }
}

class Laberinto1 extends Fondo {

  constructor() {
    super('fondos/laberinto1.png', 0, 0);
  }

  actualizar() {
  }
}

class Fondos {
  Plano;
  Pasto;
  PastoCuadriculado;
  Tarde;
  Laberinto1;

  constructor() {
    this.Plano = Plano;
    this.Pasto = Pasto;
    this.PastoCuadriculado = PastoCuadriculado;
    this.Tarde = Tarde;
    this.Laberinto1 = Laberinto1;
  }
}
