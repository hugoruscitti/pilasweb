/// <reference path="actor.ts"/>

class Texto extends Actor {
  spriteCJS;
  elString;
  color;

  constructor(x, y, elString, anchoMaximo = 200, color = "black") {
    super("invisible.png", x, y);
    this.elString = elString || "Sin texto";
    this.color = color;
    this.crear_texto(anchoMaximo);
    this.transparencia = 100;
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
    this.alto = this.spriteCJS.getBounds().height;
    this.ancho = this.spriteCJS.getBounds().width;
  }

  setAnchoMaximo(ancho) {
    this.spriteCJS.lineWidth = ancho;
    this.actualizarMedidas();
  }

  setX(x){
    super.setX(x);
    this.spriteCJS.x = pilas.escena_actual().obtener_posicion_pantalla(x, 0).x;
  }

  setY(y){
    super.setY(y);
    this.spriteCJS.y = pilas.escena_actual().obtener_posicion_pantalla(0, y + (this.alto / 2)).y;
  }

  setZ(z) {
    super.setZ(z);
    this.spriteCJS.z = z;
  }  

  cantidadDeLineas(){
    return this.alto / this.spriteCJS.getMeasuredLineHeight();
  }

  setString(elString){
    this.elString = elString;
    this.spriteCJS.text = elString;
    this.actualizarMedidas();
  }
}
