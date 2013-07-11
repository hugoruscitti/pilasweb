/// <reference path="camara.ts />
/// <reference path="evento.ts />
/// <reference path="fisica.ts />

class Base {
  mueve_mouse;

  constructor() {
    this.mueve_mouse = new Evento('mueve_mouse');  // ['x', 'y', 'dx', 'dy']
  }
}

/**
 * @class Normal
 *
 * Escena básica de pilas.
 *
 * Si no se define ninguna escena, cuando se ejecuta:
 *
 *     @example
 *     pilas.iniciar();
 *
 * esta es la escena que se muestra en la pantalla.
 *
 */
class Normal extends Base {
  actores;
  stage;      // escenario de cretejs.
  camara;
  fisica;

  constructor() {
    super();
    this.actores = [];
    this.stage = new createjs.Stage(pilas.canvas);
    this.camara = new Camara();
    this.fisica = new Fisica();
  }

  actualizar() {
    for (var i=0; i<this.actores.length; i++) {
      this.actores[i].pre_actualizar();
      this.actores[i].actualizar();
    }

    this.stage.update();
    this.fisica.actualizar();
  }

  agregar_actor(actor) {
    this.actores.push(actor);

    this.stage.addChild(actor.sprite);
    this.stage.update();
  }

  eliminar_actor(actor) {
    var index = this.actores.indexOf(actor);
    this.actores.splice(index, 1);

    this.stage.removeChild(actor.sprite);
    this.stage.update();
  }

  obtener_posicion_pantalla(x, y) {
    return this.camara.obtener_posicion_pantalla(x, y);
  }

  obtener_posicion_escenario(x, y) {
    return this.camara.obtener_posicion_escenario(x, y);
  }
}
