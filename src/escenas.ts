class escena {
  Base;
  Normal;
  constructor() {
    this.Base = Base;
    this.Normal = Normal;
  }
}

class Base {
  click_de_mouse;
  cuando_termina_click;
  mueve_mouse;
  actualiza;
  pulsa_tecla;
  suelta_tecla;
  fisica;
  stage;      // escenario de cretejs.
  camara;
  control;
  actores;
  tareas;

  constructor() {
    this.click_de_mouse = new Evento('click_de_mouse');             // ['boton', 'x', 'y']
    this.cuando_termina_click = new Evento('cuando_termina_click'); // ['boton', 'x', 'y']
    this.mueve_mouse = new Evento('mueve_mouse');                   // ['x', 'y', 'dx', 'dy']
    this.pulsa_tecla = new Evento('pulsa_tecla');                   // ['codigo', 'texto']
    this.suelta_tecla = new Evento('suelta_tecla');                 // ['codigo', 'texto']
    this.actualiza = new Evento('actualiza');                       // []
    this.stage = new createjs.Stage(pilas.canvas);

    this.stage.snapToPixel = true;

    this.camara = new Camara(this.stage);
    this.fisica = new Fisica(this.camara);
    this.control = new Control(this);

    this.actores = [];
    this.tareas = new pilas.tareas.Tareas();
  }

  iniciar() {
    throw "Tienes que re-definir el método iniciar";
  }

  actualizar() {
    this.fisica.actualizar();
    this.tareas.actualizar();

    for (var i=0; i<this.actores.length; i++) {
      this.actores[i].pre_actualizar();
      this.actores[i].actualizar();
    }

    this.actualiza.emitir();
    pilas.colisiones.verificar_colisiones();

    this.stage.update();

    if (this.necesita_ordenar_actores())
      this.ordenar_actores_por_valor_z();
  }

  necesita_ordenar_actores() {
    var ultimo_z =  300000000;

    for (var i=0; i<this.stage.children.length; i++) {

      if (this.stage.children[i].z > ultimo_z) {
        console.log("necesita actualizar!");
        return true;
      }

      ultimo_z = this.stage.children[i].z;
    }

  }


  ordenar_actores_por_valor_z() {

    var sortFunction = function(a, b) {
      if (a.z < b.z) return 1;
      if (a.z > b.z) return -1;
      return 0;
    }

    this.stage.sortChildren(sortFunction);
  }

  agregar_actor(actor) {
    if (this.actores[1]) {
      actor.z = this.actores[this.actores.length-1].z-1;
    }
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
  fondo;

  iniciar() {
    this.fondo = new pilas.fondos.Plano();
  }

}
