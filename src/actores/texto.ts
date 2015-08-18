/// <reference path="actor.ts"/>

class Texto extends Actor {
  spriteCJS;
  elString;
  color;

  constructor(x, y, elString, color = "black") {
    super("invisible.png", x, y);
    this.elString = elString || "Sin texto";
    this.color = color;
    this.crear_texto();
    this.transparencia = 100;
  }

  crear_texto() {

    this.spriteCJS = new createjs.Text(this.elString, "12px Arial", this.color);
    this.reubicar(this.x, this.y);
    this.spriteCJS.textBaseline = "alphabetic";
    this.spriteCJS.textAlign = "center";
    pilas.escena_actual().stage.addChild(this.spriteCJS);

    this.anchoMaximo(200);
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

  anchoMaximo(ancho){
    this.spriteCJS.lineWidth = ancho;
    this.actualizarMedidas();
  }

/*  altoMaximo(alto){ // ojo que no está probado
    this.spriteCJS.lineHeight = alto;
    this.actualizarMedidas();
  }*/

  reubicar(centro_x, centro_y){ //TODO: esto es por no poder sobreescribir los setter y getter de x e y
    var pos = pilas.escena_actual().obtener_posicion_pantalla(centro_x, centro_y);
    this.spriteCJS.x = pos.x;
    this.spriteCJS.y = pos.y;
    this.x = centro_x;
    this.y = centro_y;
  }

  cantidadDeLineas(){
    return this.alto / this.spriteCJS.getMeasuredLineHeight();
  }
}
