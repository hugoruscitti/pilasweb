class Pizarra extends Actor {
	container;
	lienzo;
	constructor(x=0,y=0, ancho=null, alto=null) {
		var imagen = 'invisible.png';
		super(imagen, x, y);

		if (ancho == null && alto == null) {
			ancho, alto = pilas.opciones.ancho, pilas.opciones.alto;
		}

		//crear lienzo
		this.container = new createjs.Container();
		this.lienzo = new createjs.Shape(this.x,this.y,ancho, alto);
		this.container.addChild(this.lienzo);
		pilas.escena_actual().stage.addChild(this.container)

	}

	dibujar_punto(x, y, color=pilas.colores.negro) {
		var pos = pilas.escena_actual().obtener_posicion_pantalla(x,y);

		this.lienzo.graphics.beginStroke(color)
		this.lienzo.graphics.beginFill(color)
		this.lienzo.graphics.drawCircle(pos.x, pos.y, 3).endStroke();
	}

	linea(x, y, x2, y2, color=pilas.colores.negro, grosor=1) {
		var pos = pilas.escena_actual().obtener_posicion_pantalla(x,y);
		var pos2 = pilas.escena_actual().obtener_posicion_pantalla(x2,y2);

        this.lienzo.graphics.setStrokeStyle(grosor)
        this.lienzo.graphics.beginStroke(color)
        this.lienzo.graphics.moveTo(pos.x, pos.y)
        this.lienzo.graphics.lineTo(pos2.x, pos2.y).endStroke();	
	}

	rectangulo(x, y, ancho, alto, color=pilas.colores.negro, relleno=false, grosor=1) {
		if (!relleno) {
			var color_relleno = createjs.Graphics.getRGB(255, 255, 255,0);
		}
		else {
			var color_relleno = relleno;
		}

		var pos = pilas.escena_actual().obtener_posicion_pantalla(x, y);

      	this.lienzo.graphics.setStrokeStyle(grosor)
      	this.lienzo.graphics.beginStroke(color)
      	this.lienzo.graphics.beginFill(color_relleno)
      	this.lienzo.graphics.drawRect(pos.x, pos.y, ancho, alto).endStroke();
	}

	poligono(puntos, color=pilas.colores.negro, grosor=1) {
		for (var i=1; i<puntos.length; i++) {
			this.linea(puntos[i-1][0], puntos[i-1][1], puntos[i][0], puntos[i][1], color=color, grosor=grosor);
		}
	}

	limpiar() {
		this.lienzo.graphics.clear();
	}
}