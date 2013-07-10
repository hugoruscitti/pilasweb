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
 * @class RebotarComoPelota
 *
 * Le indica al actor que rebote y colisiones como una pelota.
 *
 *     @example
 *     var un_actor = pilas.actores.Aceituna()
 *     un_actor.aprender(new pilas.habilidades.RebotarComoPelota)
 */
class RebotarComoPelota extends Habilidad {

  constructor(receptor) {
    super(receptor);
  }
}


/**
 * @class Habilidades
 *
 * Representa todas las habilidades conocidas en pilas-engine.
 */
class Habilidades {

  PuedeExplotar;
  RebotarComoPelota;

  constructor() {
    this.PuedeExplotar = PuedeExplotar;
    this.RebotarComoPelota = RebotarComoPelota;
  }
}
