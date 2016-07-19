/// <reference path="actor.ts"/>

class Texto extends Actor {
  spriteCJS;
  elString;
  color;
  margen;

  constructor(x, y, elString, argumentos:any = {}) {
    super(argumentos.imagenFondo || "invisible.png", x, y);
    this.elString = elString || "Sin texto";
    this.color = argumentos.color || "black";
    this.margen = argumentos.margen || 0;
    this.crear_texto(argumentos.anchoMaximo || 200);
    if (!argumentos.imagenFondo) this.transparencia = 100;
  }

  crear_texto(anchoMaximo) {
    this.spriteCJS = new createjs.Text(this.elString, "14px sans-serif", this.color);
    this.setAnchoMaximo(anchoMaximo);
    this.setX(this.x);
    this.setY(this.y);
    this.spriteCJS.textBaseline = "top";
    this.spriteCJS.textAlign = "center";
    pilas.escena_actual().stage.addChild(this.spriteCJS);
  }

  eliminar_texto() {
    pilas.escena_actual().stage.removeChild(this.spriteCJS);
  }

  eliminar(){
    this.eliminar_texto();
    super.eliminar();
  }

  actualizarMedidas(){
    this.alto = this.spriteCJS.getBounds().height + (this.margen * 2);
    this.ancho = this.spriteCJS.getBounds().width + (this.margen * 2);
  }

  anchoString(){
    return this.ancho - (this.margen * 2);
  }

  altoString(){
    return this.alto - (this.margen * 2);
  }

  setAnchoMaximo(anchoMax) {
    this.spriteCJS.lineWidth = anchoMax - (this.margen * 2);
    this.actualizarMedidas();
  }

  setX(x){
    super.setX(x);
    this.spriteCJS.x = pilas.escena_actual().obtener_posicion_pantalla(x, this.y).x;
  }

  setY(y){
    super.setY(y);
    this.spriteCJS.y = pilas.escena_actual().obtener_posicion_pantalla(this.x, y + (this.altoString() / 2)).y;
  }

  setZ(z) {
    super.setZ(z);
    this.spriteCJS.z = z - 1;
  }

  cantidadDeLineas(){
    return this.altoString() / this.spriteCJS.getMeasuredLineHeight();
  }

  setString(elString){
    this.elString = elString;
    this.spriteCJS.text = elString;
    this.actualizarMedidas();
  }
}
