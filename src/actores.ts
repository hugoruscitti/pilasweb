/// <reference path="actores/aceituna.ts />
/// <reference path="actores/bomba.ts />
/// <reference path="actores/explosion.ts />
/// <reference path="actores/nave.ts />
/// <reference path="actores/piedra.ts />

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
  Nave;
  Proyectil;
	Piedra;

  constructor() {
    this.Aceituna = Aceituna;
    this.Actor = Actor;
    this.Bomba = Bomba;
    this.Nave = Nave;
    this.Explosion = Explosion;
    this.Proyectil = Proyectil;
		this.Piedra = Piedra;
  }
}
