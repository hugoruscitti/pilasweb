class DepuradorDeshabilitado {
  modos;

  constructor() {
    this.modos = [];
  }

  actualizar() {
    for (var i=0; i<this.modos.length; i++) {
      this.modos[i].actualizar();
    }
  }

  definir_modos(modos) {
    modos = modos || {};
    modos.puntos_de_control = modos.puntos_de_control || false;
    modos.radios_de_colision = modos.radios_de_colision || false;

    if (modos.puntos_de_control)
      this.modos.push(new ModoPuntosDeControl());

    if (modos.puntos_de_control == false) {
      for (var i=0; i<this.modos.length; i++) {
        this.modos[i].eliminar();
      }
      this.modos = [];
    }

    if (modos.radios_de_colision) {
      this.modos.push(new ModoRadiosDeColision());
    }

  }

}


class ModoRadiosDeColision {
  shape;
  container;
  text_modo;

  constructor() {
    this.container = new createjs.Container();

    this.shape = new createjs.Shape();
    this.container.addChild(this.shape);

    this.text_modo = new createjs.Text("F9 ModoRadiosDeColision habilitado", "12px Arial", "white");
    this.container.addChild(this.text_modo);

    pilas.escena_actual().stage.addChild(this.container)
  }

  eliminar() {
    pilas.escena_actual().stage.removeChild(this.container);
  }

  actualizar() {
    var escena = pilas.escena_actual();
    this.shape.graphics.clear();

    for (var i=0; i<escena.actores.length; i++) {
      var actor = escena.actores[i];
      var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

      this.shape.graphics.beginStroke("#FFF").drawCircle(posicion.x, posicion.y, actor.radio_de_colision).endStroke();

    }
  }
}

class ModoPuntosDeControl {
  shape;
  container;
  text_modo;
  text_coordenada;
  eje;

  constructor() {
    this.container = new createjs.Container();

    this.shape = new createjs.Shape();
    this.container.addChild(this.shape);

    this.text_modo = new createjs.Text("F12 ModoPosición habilitado", "12px Arial", "white");
    this.container.addChild(this.text_modo);

    this.text_coordenada = new createjs.Text("Posición del mouse: x=12 y=33", "12px Arial", "white");
    this.text_coordenada.y = 220;
    this.text_coordenada.x = 120;
    this.container.addChild(this.text_coordenada);
    this.eje = new pilas.actores.Eje();

    pilas.escena_actual().stage.addChild(this.container);
  }

  eliminar() {
    pilas.escena_actual().stage.removeChild(this.container);
    this.eje.eliminar();
  }

  actualizar() {
    var escena = pilas.escena_actual();
    this.shape.graphics.clear();

    for (var i=0; i<escena.actores.length; i++) {
      var actor = escena.actores[i];
      var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
      var size = 3;

      // Dibuja una cruz
      this.shape.graphics.beginStroke("#ffffff").moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
      this.shape.graphics.beginStroke("#ffffff").moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();
    }

    var pos = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
    this.text_coordenada.text = "Posición del mouse: x=" + Math.floor(pos.x) + " y=" + Math.floor(pos.y);
  }

}
