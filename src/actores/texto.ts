/// <reference path="actor.ts"/>

class Texto extends Actor {
  s;
  container;
  texto;
  color;
  sprite_texto;

  constructor(x, y, texto, color) {
    var imagen = "invisible.png";
    super(imagen, x, y);
    this.texto = texto || "Sin texto";
    this.color = color || "black";
    this.crear_texto();
    this.transparencia = 100;
  }

  crear_texto() {

    var s = new createjs.Text(this.texto, "12px Arial", this.color);


    this.alto=s.heightscale;
    var pos = pilas.escena_actual().obtener_posicion_pantalla(this.x, this.y);
    s.x = pos.x;
    s.y = pos.y;
    s.textBaseline = "alphabetic";
    s.textAlign = "right";
    pilas.escena_actual().stage.addChild(s);
    this.sprite_texto = s;

  }

  eliminar_texto() {
    pilas.escena_actual().stage.removeChild(this.sprite_texto);
  }

  eliminar(){
    this.eliminar_texto();
    super.eliminar();
  }


}
