/// <reference path="actores/actor.ts"/>


class Fondo extends Actor {

  constructor(imagen, x, y) {
    super(imagen, x, y);
    this.z = 1000;
  }

}

class Plano extends Fondo {

  constructor() {
    super('plano.png', 0, 0);
    this.centro_x = 0;
    this.centro_y = 0;
  }

   crear_sprite() {
    var img = this._imagen.imagen;
    var s = new createjs.Shape();

    s.graphics.beginBitmapFill(img, 'repeat');
    s.graphics.drawRect(-160, -120, 320, 240); // TODO: detectar el area visible de pantalla.
    this.sprite = s;
  }

  actualizar() {
  }
}

class Pasto extends Fondo {

  constructor() {
    super('pasto.png', 0, 0);
    this.centro_x = 0;
    this.centro_y = 0;
  }

   crear_sprite() {
    var img = this._imagen.imagen;
    var s = new createjs.Shape();

    s.graphics.beginBitmapFill(img, 'repeat');
    s.graphics.drawRect(-160, -120, 320, 240); // TODO: detectar el area visible de pantalla.
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

class Fondos {
  Plano;
  Pasto;
  PastoCuadriculado;

  constructor() {
    this.Plano = Plano;
    this.Pasto = Pasto;
    this.PastoCuadriculado = PastoCuadriculado;
  }
}
