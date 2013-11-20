/// <reference path="actores/aceituna.ts />
/// <reference path="actores/bomba.ts />
/// <reference path="actores/explosion.ts />
/// <reference path="actores/nave.ts />
/// <reference path="actores/piedra.ts />
/// <reference path="actores/eje.ts />
/// <reference path="actores/maton.ts />

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
  Eje;
  Maton;
  Globo;
  Texto;
  Bloque;
  Manzana;
  Cofre;
  Llave;

  constructor() {
    this.Aceituna = Aceituna;
    this.Actor = Actor;
    this.Bomba = Bomba;
    this.Nave = Nave;
    this.Explosion = Explosion;
    this.Proyectil = Proyectil;
    this.Piedra = Piedra;
    this.Eje = Eje;
    this.Maton = Maton;
    this.Globo = Globo;
    this.Texto = Texto;
    this.Bloque = Bloque; // TODO: eliminar, es solo para implementar tutorial.
    this.Manzana = Manzana;
    this.Cofre = Cofre;
    this.Llave = Llave;
  }
}
