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
  circulo;

  constructor(receptor) {
    super(receptor);

    this.circulo = new pilas.fisica.Circulo(receptor.x, receptor.y, 20);
    receptor.aprender(pilas.habilidades.Imitar, this.circulo);
  }

}

class Imitar extends Habilidad {
  objeto_a_imitar;

  constructor(receptor, objeto_a_imitar) {
    super(receptor);
    this.objeto_a_imitar = objeto_a_imitar;
  }

  actualizar() {
    this.receptor.x = this.objeto_a_imitar.obtener_x();
    this.receptor.y = this.objeto_a_imitar.obtener_y();
  }
}


/**
 * @class Habilidades
 *
 * Representa todas las habilidades conocidas en pilas-engine.
 */
class Habilidades {

  Imitar;
  PuedeExplotar;
  RebotarComoPelota;

  constructor() {
    this.PuedeExplotar = PuedeExplotar;
    this.RebotarComoPelota = RebotarComoPelota;
    this.Imitar = Imitar;
  }
}
