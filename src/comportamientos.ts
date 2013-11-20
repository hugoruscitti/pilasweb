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

class Saltar extends Comportamiento {
  suelo;
  velocidad_inicial;
  velocidad;
  velocidad_aux;

  iniciar(receptor) {
    this.receptor = receptor;
    this.suelo = this.receptor.y;
    this.velocidad_inicial = this.argumentos.velocidad_inicial || 10;
    this.velocidad = this.velocidad_inicial;
    this.velocidad_aux = this.velocidad_inicial;
  }

  actualizar() {
    this.receptor.y += this.velocidad;
    this.velocidad -= 0.3;

    if(this.receptor.y <= this.suelo) {
      this.velocidad_aux /= 2.0;
      this.velocidad = this.velocidad_aux;

      if(this.velocidad_aux <= 1) {
        this.receptor.y = this.suelo;
        return true;
      }
    }
  }
}


class Orbitar extends Comportamiento {
  punto_de_orbita_x;
  punto_de_orbita_y;
  radio;
  velocidad;
  direccion;
  angulo;

  iniciar(receptor) {
    this.receptor = receptor;
    this.punto_de_orbita_x = this.argumentos.punto_de_orbita_x || 0; 
    this.punto_de_orbita_y = this.argumentos.punto_de_orbita_y || 0;
    this.radio = this.argumentos.radio || 10;
    this.velocidad = this.argumentos.velocidad || .0001;
    this.direccion = this.argumentos.direccion || "derecha";
    this.angulo = 0;

    if(this.direccion == "izquierda") {
      this.velocidad = -this.velocidad
    }

    else if(this.direccion == "derecha") {
      this.velocidad;
    }
  }

  actualizar() {
    this.angulo += this.velocidad;
    this.mover_astro();
  }

  mover_astro() {
    this.receptor.x = this.punto_de_orbita_x + 
    (Math.cos((this.angulo*(180 / Math.PI))) * this.radio);

    this.receptor.y = this.punto_de_orbita_y - 
    (Math.sin((this.angulo*(180 / Math.PI))) * this.radio);
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
  Orbitar;
  Saltar;

  constructor() {
    this.CaminarBase = CaminarBase;
    this.CaminaArriba = CaminaArriba;
    this.CaminaAbajo = CaminaAbajo;
    this.CaminaIzquierda = CaminaIzquierda;
    this.CaminaDerecha = CaminaDerecha;
    this.Orbitar = Orbitar;
    this.Saltar = Saltar;
  }
}
