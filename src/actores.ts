/// <reference path='actores/aceituna.ts' />
/// <reference path='actores/bomba.ts' />
/// <reference path='actores/nave.ts' />
/// <reference path='actores/explosion.ts' />
/// <reference path='actores/proyectil.ts' />
/// <reference path='actores/piedra.ts' />
/// <reference path='actores/eje.ts' />
/// <reference path='actores/maton.ts' />
/// <reference path='actores/globo.ts' />
/// <reference path='actores/texto.ts' />
/// <reference path='actores/bloque.ts' />
/// <reference path='actores/manzana.ts' />
/// <reference path='actores/cofre.ts' />
/// <reference path='actores/llave.ts' />
/// <reference path='actores/caja.ts' />
/// <reference path='actores/cesto.ts' />
/// <reference path='actores/pelota.ts' />
/// <reference path='actores/zanahoria.ts' />
/// <reference path='actores/boton.ts' />
/// <reference path='actores/puntaje.ts' />
/// <reference path='actores/mono.ts' />
/// <reference path='actores/banana.ts' />
/// <reference path='actores/tortuga.ts' />
/// <reference path='actores/pizarra.ts' />
/// <reference path='actores/pingu.ts' />
/// <reference path='actores/alien.ts' />
/// <reference path='actores/alien_marron.ts' />
/// <reference path='actores/tuerca.ts' />
/// <reference path='actores/sombra.ts' />

/**
 * @class Actores
 *
 * Módulo Actores
 * ==============
 *
 * Representa todos los actores conocidos en pilas-engine.
 */
class Actores {
  pilas;

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
  Caja;
  Cesto;
  Pelota;
  Zanahoria;
  Boton;
  Puntaje;
  Mono;
  Banana;
  Tortuga;
  Pizarra;
  Pingu;
  Alien;
  AlienMarron;
  Tuerca;
  Sombra;


  constructor(pilas) {
    this.pilas = pilas;
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
    this.Caja = Caja;
    this.Cesto = Cesto;
    this.Pelota = Pelota;
    this.Zanahoria = Zanahoria;
    this.Boton = Boton;
    this.Puntaje = Puntaje;
    this.Mono = Mono;
    this.Banana = Banana;
    this.Tortuga = Tortuga;
    this.Pizarra = Pizarra;
    this.Pingu = Pingu;
    this.Alien = Alien;
    this.AlienMarron = AlienMarron;
    this.Tuerca = Tuerca;
    this.Sombra = Sombra;
  }
}
