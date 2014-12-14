class DepuradorDeshabilitado {
  modos;
  diccionario_modos;

  constructor() {
    this.modos = [];
    this.diccionario_modos = {};
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
    modos.fisica = modos.fisica || false;
    modos.area = modos.area || false;
    modos.posiciones = modos.posiciones || false;

    this.eliminar_todos_los_modos();

    if (modos.radios_de_colision)
      this.modos.push(new ModoRadiosDeColision());

    if (modos.puntos_de_control)
      this.modos.push(new ModoPuntosDeControl());

    if (modos.fisica)
      this.modos.push(new ModoFisica());

    if (modos.area)
      this.modos.push(new ModoArea());

    if (modos.posiciones)
      this.modos.push(new ModoPosicion());

    this.diccionario_modos = modos;
  }

  eliminar_todos_los_modos() {
    for (var i=0; i<this.modos.length; i++)
      this.modos[i].eliminar();

    this.modos = [];
  }

  obtener_modos() {
    return this.diccionario_modos;
  }
}

class ModoDeDepuracion {
  shape;
  container;
  grosor_linea;

  constructor() {
    this.container = new createjs.Container();

    this.shape = new createjs.Shape();
    this.container.addChild(this.shape);

    pilas.escena_actual().stage.addChild(this.container)

    this.grosor_linea = 2;
  }

  eliminar() {
    pilas.escena_actual().stage.removeChild(this.container);
  }

  actualizar() {
    this.shape.graphics.clear();
  }
}

class ModoRadiosDeColision extends ModoDeDepuracion {
  actualizar() {
    super.actualizar()
    var escena = pilas.escena_actual()
    for (var i=0; i<escena.actores.length; i++) {
      var actor = escena.actores[i];
      var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

      this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).drawCircle(posicion.x, posicion.y, actor.radio_de_colision).endStroke();

    }
  }
}

class ModoArea extends ModoDeDepuracion {
  actualizar() {
    super.actualizar()
    var escena = pilas.escena_actual();

    for(var i=0;i<escena.actores.length;i++) {
      var actor = escena.actores[i];
      var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

      this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).drawRect(posicion.x-actor.ancho/2, posicion.y-actor.alto/2, actor.ancho, actor.alto).endStroke();
    }
  }
}

class ModoPuntosDeControl extends ModoDeDepuracion {
  actualizar() {
    super.actualizar()
    var escena = pilas.escena_actual();

    for (var i=0; i<escena.actores.length; i++) {
      var actor = escena.actores[i];
      var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
      var size = 3;

      // Dibuja una cruz negra
      size = 4;
      this.shape.graphics.beginStroke("#000").setStrokeStyle(this.grosor_linea+2).moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
      this.shape.graphics.beginStroke("#000").setStrokeStyle(this.grosor_linea+2).moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();

      // Dibuja una cruz blanca
      size = 3;
      this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
      this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();
    }
  }

}

class ModoFisica extends ModoDeDepuracion {
  actualizar() {
    super.actualizar()
    var escena = pilas.escena_actual();
    this.shape.graphics.setStrokeStyle(this.grosor_linea);
    escena.fisica.dibujar_figuras_sobre_lienzo(this.shape.graphics);
  }
}

class ModoPosicion extends ModoDeDepuracion {
  text_coordenada;
  eje;

  constructor() {
    super();
    this.text_coordenada = new createjs.Text("Posición del mouse: x=12 y=33", "12px Arial", "white");
    this.text_coordenada.y = 920/2; //TODO: Tamaño decanvas 640*480
    this.text_coordenada.x = 900/2;
    this.container.addChild(this.text_coordenada);
    this.eje = new pilas.actores.Eje();
		this.sobre_escribir_dibujado();
  }

	private sobre_escribir_dibujado() {

		var anterior_draw = this.shape.graphics.draw;
		var g = this.shape.graphics;
		this.shape.graphics.actores = [];

		this.shape.graphics.draw = function(a) {

			a.fillStyle = "white";

			for (var i=0; i<this.actores.length; i++) {
				var actor = this.escena.actores[i];
				var posicion = this.escena.obtener_posicion_pantalla(actor.x, actor.y);

				a.fillText(" (" + Math.floor(actor.x) + ", " + Math.floor(actor.y) + ")", posicion.x + 10, posicion.y + 10);
			}

			anterior_draw.call(g, a);
		}

	}

  eliminar() {
    super.eliminar();
    this.eje.eliminar();
  }

  actualizar() {
    super.actualizar();
    var escena = pilas.escena_actual();
		this.shape.graphics.actores = escena.actores;
		this.shape.graphics.escena = escena;

    for (var i=0; i<escena.actores.length; i++) {
      var actor = escena.actores[i];
      var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
      var size = 3;

      // Dibuja un punto
      this.shape.graphics.beginFill("#FFF").setStrokeStyle(this.grosor_linea).drawCircle(posicion.x, posicion.y, 2);
    }

    var pos = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
    this.text_coordenada.text = "Posición del mouse: x=" + Math.floor(pos.x) + " y=" + Math.floor(pos.y);
  }

}
