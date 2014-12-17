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
    var pos = pilas.escena_actual().obtener_posicion_pantalla(this.x, this.y);
    s.x = pos.x;
    s.y = pos.y;
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

  //TODO: hacer que pueda utilizar los metodos propios de la clase padre Actor
  get escala_x() {return this.sprite_texto.scaleX}
  set escala_x(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite_texto, 'scaleX', valor, 1000);
    else
      this.sprite_texto.scaleX = valor;
  }

  get escala_y() {return this.sprite_texto.scaleY}
  set escala_y(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite_texto, 'scaleY', valor, 1000);
    else
      this.sprite_texto.scaleY = valor;
  }

  get escala() {return this.escala_x}
  set escala(valor) {

    if (valor instanceof Array) {
      var nuevo_radio_de_colision = []
      for (var i=0; i<valor.length; i++) {
        nuevo_radio_de_colision.push((this.radio_de_colision * valor[i]) / this.escala);
      }
      pilas.interpolar(this, 'radio_de_colision', nuevo_radio_de_colision, 1000);
      this.radio_de_colision = nuevo_radio_de_colision[0];
    }
    else {
      this.radio_de_colision = (this.radio_de_colision * valor) / this.escala;
    }

    this.escala_x = valor;
    this.escala_y = valor;
  }
}
