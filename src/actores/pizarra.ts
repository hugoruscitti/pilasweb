type punto = { x: number, y: number };
type segmento = { inicio: punto, fin: punto };



class Pizarra extends Actor {
  container;
  lienzo;
  _ancho;
  _alto

  constructor(x=0,y=0) {
    var imagen = 'invisible.png';
    super(imagen, x, y);

    this._ancho = pilas.opciones.ancho;
    this._alto = pilas.opciones.alto;

    //crear lienzo
    this.container = new createjs.Container();
    this.lienzo = new createjs.Shape(this.x, this.y); // TODO: Permitir que acepte ancho y alto de la pizarra
    this.container.addChild(this.lienzo);
    pilas.escena_actual().stage.addChild(this.container)

    this.setX(x);
    this.setY(y);
  }

  setX(x){
    super.setX(x);
    this.lienzo.set({x: x});
  }

  setY(y){
    super.setY(y);
    this.lienzo.set({y: y});
  }

  dibujar_punto(x, y, color=pilas.colores.negro, grosor?) {
    var pos = pilas.escena_actual().obtener_posicion_pantalla(x,y);
    
    if (grosor) {
      this.lienzo.graphics.setStrokeStyle(grosor)
    }
    this.lienzo.graphics.beginStroke(color)
    this.lienzo.graphics.beginFill(color)
    this.lienzo.graphics.drawCircle(pos.x, pos.y, 3).endFill().endStroke();
  }

  linea(x, y, x2, y2, color=pilas.colores.negro, grosor=1) {
    var pos = pilas.escena_actual().obtener_posicion_pantalla(x,y);
    var pos2 = pilas.escena_actual().obtener_posicion_pantalla(x2,y2);

    this.lienzo.graphics.setStrokeStyle(grosor)
    this.lienzo.graphics.beginStroke(color)
    this.lienzo.graphics.moveTo(pos.x, pos.y)
    this.lienzo.graphics.lineTo(pos2.x, pos2.y).endStroke();
  }

  rectangulo(x, y, ancho, alto, color=pilas.colores.negro, relleno:any=false, grosor=1) {
    if (!relleno)
      var color_relleno = createjs.Graphics.getRGB(255, 255, 255,0);
    else
      var color_relleno = relleno;

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

  circulo(x, y, radio, color=pilas.colores.negro, grosor=1) {
    var pos = pilas.escena_actual().obtener_posicion_pantalla(x,y);
    this.lienzo.graphics.setStrokeStyle(grosor)
    this.lienzo.graphics.beginStroke(color)
    this.lienzo.graphics.drawCircle(pos.x, pos.y,radio).endStroke();
  }

  arco(x, y, radio, anguloInicial, anguloFinal, color=pilas.colores.negro, grosor=1) {
    var pos = pilas.escena_actual().obtener_posicion_pantalla(x,y);
    this.lienzo.graphics.setStrokeStyle(grosor)
    this.lienzo.graphics.beginStroke(color)
    this.lienzo.graphics.arc(pos.x, pos.y,radio,anguloInicial, anguloFinal).endStroke();
  }

  limpiar() {
    this.lienzo.graphics.clear();
  }

  pintar(color) {
    this.rectangulo(this.x-320, this.y+240, this._ancho, this._alto, color, color,1);
  }

/*=================== Desde aca para sacar info de lo dibujado ======================*/

  segmentosDeDibujoLineal() : segmento[] {
    var instruccionesInicio = this.lienzo.graphics._instructions.filter(instruccion => instruccion.f.name === "moveTo");
    var instruccionesFin = this.lienzo.graphics._instructions.filter(instruccion => instruccion.f.name === "lineTo");
    var segmentos: segmento[] = [];
    for (let i = 0; i < instruccionesInicio.length; i++) {
      let inicio: punto = this.cambioCoordenadas(instruccionesInicio[i].params);
      let fin: punto = this.cambioCoordenadas(instruccionesFin[i].params);
      segmentos.push({inicio: inicio, fin: fin});
    }
    return segmentos;
  }

  cambioCoordenadas(punto){
    return pilas.escena_actual().obtener_posicion_escenario(Math.round(punto[0]),Math.round(punto[1]));
  }

}
