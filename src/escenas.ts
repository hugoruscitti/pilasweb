class Normal {
  actores;
  stage;      // escenario de cretejs.

  constructor() {
    this.actores = [];
    this.stage = new createjs.Stage(pilas.canvas);
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
}
