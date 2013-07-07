/**
 * @class Habilidad
 *
 * Representa una habilidad que un actor puede aprender.
 */
class Habilidad {
  receptor;

  constructor(receptor) {
    this.receptor = receptor;
  }

  actualizar() {
  }

  eliminar() {
  }
}

/**
 * @class PuedeExplotar
 *
 * Hace que un actor se pueda hacer explotar invocando al metodo eliminar.
 */
class PuedeExplotar extends Habilidad {

  constructor(receptor) {
    super(receptor);
    receptor.eliminar = () => {
      var explosion = new pilas.actores.Explosion();
      explosion.x = this.receptor.x;
      explosion.y = this.receptor.y;
      explosion.escala = this.receptor.escala;
      pilas.actores.Actor.prototype.eliminar.call(this.receptor);
    }
  }
}

/**
 * @class SeguirAlMouse
 *
 * Hace que un actor siga la posición del mouse en todo momento.
 */
class SeguirAlMouse extends Habilidad {
  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().mueve_mouse.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().mueve_mouse) {
      this.mover(evento);
    }
  }

  mover(evento) {
    console.log(this);
    this.receptor.x = evento.x;
    this.receptor.y = evento.y;
  }
}

/**
 * @class Habilidades
 *
 * Representa todas las habilidades conocidas en pilas-engine.
 */
class Habilidades {

  PuedeExplotar;
  SeguirAlMouse;

  constructor() {
    this.PuedeExplotar = PuedeExplotar;
    this.SeguirAlMouse = SeguirAlMouse;
  }
}
