/**
 * @class Comportamiento
 *
 * Representa una habilidad que un actor puede aprender.
 */
class Comportamiento {
  receptor;
  argumentos;

  constructor(argumentos) {
    this.argumentos = argumentos;
  }

  iniciar(receptor) {
    this.receptor = receptor;
  }

  actualizar() {
  }

  eliminar() {
  }
}

class Subir extends Comportamiento {
  pasos;

  iniciar(receptor) {
    this.receptor = receptor;
    this.pasos = this.argumentos.pasos;
  }

  actualizar() {
    this.pasos -= 0.01;
    this.receptor.mover(0, -0.05);

    if (this.pasos < 0) {
      this.receptor.detener_animacion()
      return true;
    }
  }
}


/**
 * @class Comportamientos
 *
 * Representa todos los comportamientos que puede hacer un actor en pilas-engine.
 */
class Comportamientos {
  Subir;

  constructor() {
    this.Subir = Subir;
  }
}
