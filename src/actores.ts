/// <reference path="actores/aceituna.ts />
/// <reference path="actores/bomba.ts />
/// <reference path="actores/explosion.ts />

/**
 * @class Actores
 *
 * Módulo Actores
 * ==============
 *
 * Representa todos los actores conocidos en pilas-engine.
 */
class Actores {

  Aceituna;
  Actor;
  Bomba;
  Explosion;
  Pelota;

  constructor() {
    this.Aceituna = Aceituna;
    this.Actor = Actor;
    this.Bomba = Bomba;
    this.Explosion = Explosion;
    this.Pelota = Pelota;
  }
}
