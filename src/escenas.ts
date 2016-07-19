/// <reference path="control.ts" />
/// <reference path="camara.ts" />
/// <reference path="evento.ts" />
/// <reference path="pilas.ts" />

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
  pausada;

  constructor() {
    this.desPausar();
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

  actualizar(){
    if (!this.pausada) {
      this.doActualizar();
    }
  }

  doActualizar() {
    this.fisica.actualizar();
    this.tareas.actualizar();

    var copiaActores = this.actores.slice();

    for (var i=0; i<this.actores.length; i++) {

      if (copiaActores[i] !== undefined) {
        copiaActores[i].pre_actualizar();
        copiaActores[i].actualizar();
      }

    }

    this.actualiza.emitir();
    pilas.colisiones.verificar_colisiones();

    this.ordenar_actores_por_valor_z();
    this.stage.update();
  }

  pausar(){
    this.pausada = true;
  }

  desPausar(){
    this.pausada = false;
  }

  ordenar_actores_por_valor_z() {
    this.stage.sortChildren((a,b) => b.z - a.z);
  }

  agregar_actor(actor) {
    this.actores.push(actor);
    this.stage.addChild(actor.sprite);
    this.ordenar_actores_por_valor_z();
    this.stage.update();
  }

  eliminar_actor(actor) {
    var index = this.actores.indexOf(actor);
    if(index !== -1) this.actores.splice(index, 1);

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
