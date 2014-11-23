// <reference path="comportamientos.ts />

class Alien extends Actor {
  constructor(x=0, y=0) {
    var imagen = pilas.imagenes.cargar_grilla('alien_camina.png', 11);
    super(imagen, x, y);
    this._imagen.definir_cuadro(0);
    
    this.hacer_luego(MoverHaciaDerecha,{cantidad: 100, tiempo: 2});
    this.hacer_luego(MoverHaciaIzquierda,{cantidad: 100, tiempo: 2});
    this.hacer_luego(MoverHaciaArriba,{cantidad: 100, tiempo: 2});
    this.hacer_luego(MoverHaciaAbajo,{cantidad: 100, tiempo: 2});
  }
}

class Movimiento {
  receptor;
  argumentos;

  tiempo;
  cantidad;
  _contador_de_tiempo;
  _velocidad;

  constructor(argumentos) {
    this.argumentos = argumentos;
  }

  iniciar(receptor) {
    this.receptor = receptor;
    this.tiempo = this.argumentos.tiempo || 2;
    this.cantidad = this.argumentos.cantidad || 32;

    this._contador_de_tiempo = 0;
    this._velocidad = (this.cantidad / 60.0) / this.tiempo;
    this.iniciar_animacion();
  }

  iniciar_animacion() {
  }

  supero_el_tiempo() {
    return (this._contador_de_tiempo > this.tiempo * 60);
  }
}

class MoverHaciaDerecha extends Movimiento {

  iniciar_animacion() {
  }

  actualizar() {
    this.realizar_movimiento();

    if (this.supero_el_tiempo())
      return true;

    this._contador_de_tiempo += 1;
  }

  realizar_movimiento() {
    this.receptor.x += this._velocidad;
  }
}

class MoverHaciaIzquierda extends MoverHaciaDerecha {

  realizar_movimiento() {
    this.receptor.x -= this._velocidad;
  }
}


class MoverHaciaArriba extends MoverHaciaDerecha {

  realizar_movimiento() {
    this.receptor.y += this._velocidad;
  }
}

class MoverHaciaAbajo extends MoverHaciaDerecha {

  realizar_movimiento() {
    this.receptor.y -= this._velocidad;
  }
}
