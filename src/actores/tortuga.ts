class Tortuga extends Actor {
    anterior_x;
    anterior_y;
  pizarra;
    lapiz_bajo;
    _color;

  constructor(x=0, y=0, dibuja=true) {
    var imagen = 'tortuga.png';
    super(imagen, x, y);

    this.pizarra = new pilas.actores.Pizarra();

    if (dibuja)
      this.bajalapiz();
    else
      this.subelapiz();

    this.color = pilas.colores.negro;
  }

  avanzar(pasos) {
    this.hacer_luego(pilas.comportamientos.Avanzar, {pasos:pasos, velocidad:2});
  }

  girarderecha(delta) {
    this.hacer_luego(pilas.comportamientos.Girar,{angulo:delta, tiempo:.5});
  }

  girarizquierda(delta) {
    this.hacer_luego(pilas.comportamientos.Girar,{angulo:-delta, tiempo:.5});
  }

  actualizar() {
    if(this.x != this.anterior_x || this.y != this.anterior_y) {
      if (this.lapiz_bajo) {
        this.pizarra.linea(this.anterior_x, this.anterior_y, this.x, this.y, this.color, 4);
      }

      this.anterior_x = this.x;
      this.anterior_y = this.y;
    }
  }

  bajalapiz() {
    this.lapiz_bajo = true;
  }

  subelapiz() {
    this.lapiz_bajo = false;
  }

  crear_poligono(lados=3, escala=100, sentido=-1) {
    var rotacion = 360 / lados;

    for(var i=0; i<lados; i++) {
      this.avanzar(escala);

      if (sentido == 1)
        this.girarderecha(rotacion);
      else
        this.girarizquierda(rotacion);
     }
  }

  crear_circulo(radio, sentido=-1) {
    for (var i=0; i<36; i++) {
      this.avanzar(radio);
      if (sentido == 1)
        this.girarderecha(10);
      else
        this.girarizquierda(10);
    }
  }

  set color(_color) {
    this._color = _color;
  }

  get color() {
    return this._color;
  }
}
