// <reference path="comportamientos.ts />

class Alien extends Actor {
  sombra;
  limitar_movimientos;
  sonido_blabla;

  constructor(x=0, y=0) {
    var imagen = pilas.imagenes.cargar_animacion('alien.png', 14);
    super(imagen, x, y);

    window['alien'] = this;

    imagen.definir_animacion("parado", [11, 11], 5);
    imagen.definir_animacion("hablar", [12, 13, 11, 12, 11, 13], 20);
    imagen.definir_animacion("recoger", [11, 12, 10, 12, 11], 1);
    imagen.definir_animacion("camina", [0, 1, 2, 3, 4, 3, 2, 1], 15);
    imagen.cargar_animacion("parado");
    this.sonido_blabla = pilas.sonidos.cargar('blabla.wav');
  }

  iniciar() {
    this.sombra = new pilas.actores.Sombra();
    this.sombra.escala = 0.5;
    this.limitar_movimientos = true;

    this.centro_y = 'abajo';
    this.centro_y -= 10;
  }

  decir(mensaje) {
    this.hacer_luego(Hablar, {mensaje: mensaje, tiempo: 1});
  }

  super_decir(mensaje) {
    super.decir(mensaje);
    this.sonido_blabla.reproducir();
  }

  actualizar() {
    this._imagen.avanzar();
    this.z = this.y;

    this.sombra.x = this.x;
    this.sombra.y = this.y;
    this.sombra.z = this.z + 1;
  }

  ir_derecha() {
    if (this.x < 176)
      this.hacer_luego(MoverHaciaDerecha, {cantidad: 68, tiempo: 1});
    else
      this.decir("no puedo ir ahí");
  }

  ir_izquierda() {
    if (this.x > -175)
      this.hacer_luego(MoverHaciaIzquierda, {cantidad: 68, tiempo: 1});
    else
      this.decir("no puedo ir ahí");
  }

  ir_arriba() {
    if (this.y < 150)
      this.hacer_luego(MoverHaciaArriba, {cantidad: 80, tiempo: 1});
    else
      this.decir("no puedo ir ahí");
  }

  ir_abajo() {
    if (this.y > -180)
      this.hacer_luego(MoverHaciaAbajo, {cantidad: 80, tiempo: 1});
    else
      this.decir("no puedo ir ahí");
  }

  esperar(tiempo=2) {
    this.hacer_luego(Esperar, {tiempo: tiempo});
  }

  detener() {
    this.esperar(0);
  }

  recoger() {
    this.hacer_luego(Recoger, {tiempo: 1});
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

  al_terminar() {
  }
}

class MoverHaciaDerecha extends Movimiento {

  iniciar_animacion() {
    this.receptor._imagen.cargar_animacion("camina");
    this.receptor.espejado = false;
  }

  actualizar() {
    this.realizar_movimiento();

    if (this.supero_el_tiempo()) {
      this.receptor._imagen.cargar_animacion('parado');
      this.al_terminar();
      return true;
    }

    this._contador_de_tiempo += 1;
  }

  realizar_movimiento() {
    this.receptor.x += this._velocidad;
  }
}

class MoverHaciaIzquierda extends MoverHaciaDerecha {

  iniciar_animacion() {
    this.receptor._imagen.cargar_animacion("camina");
    this.receptor.espejado = true;
  }

  realizar_movimiento() {
    this.receptor.x -= this._velocidad;
  }
}


class MoverHaciaArriba extends MoverHaciaDerecha {

  iniciar_animacion() {
    this.receptor._imagen.cargar_animacion("camina");
  }

  realizar_movimiento() {
    this.receptor.y += this._velocidad;
  }
}

class MoverHaciaAbajo extends MoverHaciaDerecha {

  iniciar_animacion() {
    this.receptor._imagen.cargar_animacion("camina");
  }

  realizar_movimiento() {
    this.receptor.y -= this._velocidad;
  }
}

class Esperar extends MoverHaciaDerecha {

  iniciar_animacion() {
    this.receptor._imagen.cargar_animacion("parado");
    this.receptor.espejado = true;
  }

  realizar_movimiento() {
  }
}



class Recoger extends MoverHaciaDerecha {

  iniciar_animacion() {
    this.receptor._imagen.cargar_animacion("recoger");
  }

  realizar_movimiento() {
  }

  al_terminar() {
    this.receptor._imagen.cargar_animacion("parado");
  }
}

class Hablar extends MoverHaciaDerecha {

  iniciar_animacion() {
    this.receptor._imagen.cargar_animacion("hablar");
    this.receptor.super_decir(this.argumentos.mensaje);
  }

  realizar_movimiento() {
  }
}
