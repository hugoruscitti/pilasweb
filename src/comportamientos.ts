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

class CaminarBase extends Comportamiento {
  pasos;
  velocidad;

  iniciar(receptor) {
    this.receptor = receptor;
    this.pasos = this.argumentos.pasos || 1;
    this.velocidad = 1;
  }

  actualizar() {
    this.mover();
    this.pasos -= 0.05;

    if (this.pasos <= 0.05) { // TODO: en realidad tendría que ser 0.0 en vez de 0.1, pero por algún motivo siempre avanza un pixel mas...
      this.receptor.detener_animacion()
      return true;
    }
  }

  mover() {
  }
}

class CaminaArriba extends CaminarBase {
  mover() {
    this.receptor.mover(0, this.velocidad);
  }
}

class CaminaAbajo extends CaminarBase {
  mover() {
    this.receptor.mover(0, -this.velocidad);
  }
}

class CaminaIzquierda extends CaminarBase {
  mover() {
    this.receptor.mover(-this.velocidad, 0);
  }
}

class CaminaDerecha extends CaminarBase {
  mover() {
    this.receptor.mover(this.velocidad, 0);
  }
}


/**
 * @class Comportamientos
 *
 * Representa todos los comportamientos que puede hacer un actor en pilas-engine.
 */
class Comportamientos {
  Subir;
  CaminarBase;
  CaminaArriba;
  CaminaAbajo;
  CaminaIzquierda;
  CaminaDerecha;

  constructor() {
    this.CaminarBase = CaminarBase;
    this.CaminaArriba = CaminaArriba;
    this.CaminaAbajo = CaminaAbajo;
    this.CaminaIzquierda = CaminaIzquierda;
    this.CaminaDerecha = CaminaDerecha;
  }
}
