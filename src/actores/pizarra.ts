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

  limpiar() {
    this.lienzo.graphics.clear();
  }

  pintar(color) {
    this.rectangulo(this.x-320, this.y+240, this._ancho, this._alto, color, color,1);
  }

/*=================== Desde aca para sacar info de lo dibujado ======================*/

  tieneIgualDibujoQue(otraPizarra){
    return this.dibujo().equals(otraPizarra.dibujo());
  }

  dibujo(){
    var instAnterior;
    const dibujo:DibujoConSegmentos = new DibujoConSegmentos();
    this.lienzo.graphics._instructions.array.forEach(instActual => {
      if(instAnterior.f.name === "moveTo" && instActual.f.name === "lineTo") dibujo.agregar(this.nuevoSegmento(instAnterior,instActual));
      instAnterior = instActual
    });
    return 
  }

  nuevoSegmento(inst1,inst2){
    const puntoA = this.cambioCoordenadas(inst1.params);
    const puntoB = this.cambioCoordenadas(inst2.params);
    return new Segmento(new Extremo(puntoA.x,puntoA.y),new Extremo(puntoB.x,puntoB.y))
  }

  cambioCoordenadas(punto){
    return pilas.escena_actual().obtener_posicion_escenario(Math.round(punto[0]),Math.round(punto[1]));
  }  
}

class DibujoConSegmentos {
  // Están ordenados
  segmentos:Array<Segmento> = [];

  agregar(segmento:Segmento){
    const solapado:Segmento = this.segmentos.find(seg => seg.seSolapaCon(segmento));
    if(!solapado) this.agregarOrdenado(segmento);
    else {
      this.segmentos.splice(this.segmentos.indexOf(solapado),1);
      this.agregar(segmento.combinarCon(solapado));
    }
  }

  agregarOrdenado(segmento:Segmento){
    var indiceAInsertar = this.segmentos.length;
    this.segmentos.find((seg,i) => {
      indiceAInsertar = i;
      return seg.esMenorQue(segmento)});
    this.segmentos.splice(indiceAInsertar,0,segmento);
  }

  equals(dibujo:DibujoConSegmentos){
    return this.segmentos.every((seg,i) => dibujo.segmentos[i].equals(seg)) && 
      this.segmentos.length === dibujo.segmentos.length;
  }
}

class Segmento {
  // El inicio siempre es "menor" que el fin (facilita cuentas)
  inicio : Extremo;
  fin : Extremo;
  
  constructor(inicio:Extremo, fin:Extremo){
    this.inicio = inicio.min(fin);
    this.fin = inicio.max(fin);
  }

  seSolapaCon(otro):boolean{
    // Se solapan cuando tienen la misma dirección, y además se tocan en algún punto.
    return this.versor().equals(otro.versor()) && 
      (this.inicio.contieneA(otro.inicio,this.fin) || this.inicio.contieneA(otro.fin,this.fin));
  }

  combinarCon(otro):Segmento{
    if(!this.seSolapaCon(otro)) throw "No se puede combinar algo que no solape";
    return new Segmento(this.inicio.min(otro.inicio), this.fin.max(otro.fin));
  }

  versor():Extremo{
    return this.fin.restar(this.inicio).normalizado();
  }

  esMenorQue(otroSeg){
    return this.inicio.esMenorQue(otroSeg.inicio) || (this.inicio.equals(otroSeg.inicio) && this.fin.esMenorQue(otroSeg.fin));
  }

  equals(otroSeg){
    return this.inicio.equals(otroSeg.inicio) && this.fin.equals(otroSeg.fin);
  }
}

class Extremo {
  x:number;
  y:number;

  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }

  esMenorQue(otro:Extremo):boolean{
    return this.x < otro.x || (this.x === otro.x && this.y <= otro.y);
  }

  min(otro):Extremo{
    return this.esMenorQue(otro) ? this : otro;
  }

  max(otro):Extremo{
    return this.esMenorQue(otro) ? otro : this;
  }

  restar(otro){
    return new Extremo(this.x - otro.x, this.y - otro.y);
  }

  contieneA(medio,fin){
    return new Segmento(this,medio).versor().equals(new Segmento(this,fin).versor()) &&
      this.x <= medio.x && medio.x <= fin.x;
  }

  normalizado(){
    var norm = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
		return new Extremo(this.x/norm, this.y/norm);
  }

  equals(otro){
    return this.x === otro.x && this.y === this.y;
  }
}