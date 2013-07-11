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
    modos.fisica = modos.fisica || false;

    if (modos.puntos_de_control)
      this.modos.push(new ModoPuntosDeControl());

    if (modos.fisica)
      this.modos.push(new ModoFisica());
  }

}

class ModoDepurador {
}

class ModoPuntosDeControl extends ModoDepurador {
  shape;
  container;
  text_modo;
  text_coordenada;

  constructor() {
    super();
    this.container = new createjs.Container();

    this.shape = new createjs.Shape();
    this.container.addChild(this.shape);

    this.text_modo = new createjs.Text("F12 ModoPosicion habilitado", "12px Arial", "white");
    this.container.addChild(this.text_modo);

    this.text_coordenada = new createjs.Text("Posición del mouse: x=12 y=33", "12px Arial", "white");
    this.text_coordenada.y = 220;
    this.text_coordenada.x = 120;
    this.container.addChild(this.text_coordenada);

    pilas.escena_actual().stage.addChild(this.container);
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
    this.text_coordenada.text = "Posición del mouse: x=" + pos.x + " y=" + pos.y;
  }

}


class ModoFisica extends ModoDepurador {
  shape;
  container;
  text_modo;

  constructor() {
    super();
    this.container = new createjs.Container();

    this.shape = new createjs.Shape();
    this.container.addChild(this.shape);

    this.text_modo = new createjs.Text("F11 ModoFisica habilitado", "12px Arial", "white");
    this.text_modo.y = 20;
    this.container.addChild(this.text_modo);

    pilas.escena_actual().stage.addChild(this.container);
  }

  actualizar() {
    var escena = pilas.escena_actual();
    this.shape.graphics.clear();

    pilas.fisica.dibujar_figuras_sobre_el_lienzo(this.shape.graphics)
  }

}

