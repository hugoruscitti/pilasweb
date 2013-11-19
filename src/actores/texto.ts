/// <reference path="actor.ts"/>

class Texto extends Actor {
  s;
  container;
  texto;
  sprite_texto;

  constructor(x, y, texto) {
    var imagen = "aceituna.png";
    super(imagen, x, y);
    this.centro_x = 18;
    this.centro_y = 18;
    this.texto = texto || "Sin texto";
    this.crear_texto();
    this.transparencia = 100;
  }

  crear_texto() {
    var s = new createjs.Text(this.texto, "12px Arial", "black");
    var pos = pilas.escena_actual().obtener_posicion_pantalla(this.x, this.y);
    s.x = pos.x - this.ancho + 10;
    s.y = pos.y - (this.alto + 15);
    s.textBaseline = "bottom";
    s.textAlign = "center";

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

