/// <reference path="camara.ts />

class Normal {
  actores;
  stage;      // escenario de cretejs.
  camara;

  constructor() {
    this.actores = [];
    this.stage = new createjs.Stage(pilas.canvas);
    this.camara = new Camara();
  }

  actualizar() {
    for (var i=0; i<this.actores.length; i++)
      this.actores[i].actualizar();

    this.stage.update();
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
