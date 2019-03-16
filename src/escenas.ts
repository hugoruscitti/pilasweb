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
  _modo_edicion;

  constructor() {
    this.desPausar();
    this.click_de_mouse = new Evento('click_de_mouse');             // ['boton', 'x', 'y']
    this.cuando_termina_click = new Evento('cuando_termina_click'); // ['boton', 'x', 'y']
    this.mueve_mouse = new Evento('mueve_mouse');                   // ['x', 'y', 'dx', 'dy']
    this.pulsa_tecla = new Evento('pulsa_tecla');                   // ['codigo', 'texto']
    this.suelta_tecla = new Evento('suelta_tecla');                 // ['codigo', 'texto']
    this.actualiza = new Evento('actualiza');                       // []
    this.stage = new createjs.Stage(pilas.canvas);
    this._modo_edicion = false;

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
    console.log("Pausando escena desde pilasweb...");
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
    this.actualizar_modo_edicion_cuando_agrega_actor(actor);

    if (parent) {
      let mensaje = {
        tipo: "seAgregaUnActor",
        actorID: actor.id
      };

      parent.postMessage(mensaje, window.location.origin);
    }
  }

  eliminar_actor(actor) {
    var index = this.actores.indexOf(actor);
    if(index !== -1) this.actores.splice(index, 1);

    this.stage.removeChild(actor.sprite);
    this.stage.update();

    if (parent) {
      let mensaje = {
        tipo: "seEliminaUnActor",
        actorID: actor.id
      };

      parent.postMessage(mensaje, window.location.origin);
    }
  }

  obtener_posicion_pantalla(x, y) {
    return this.camara.obtener_posicion_pantalla(x, y);
  }

  obtener_posicion_escenario(x, y) {
    return this.camara.obtener_posicion_escenario(x, y);
  }

  definir_modo_edicion(estado) {
    if (estado === this._modo_edicion) {
      return;
    }

    this._modo_edicion = estado;
    var stage = this.stage;

    if (estado) {
      stage.enableMouseOver(20); // el argumento son las interacciones por segundo.

      this.obtener_actores().forEach(function (actor) {
        actor.activar_el_modo_edicion();
      });

    } else {
      stage.enableMouseOver(0); // el argumento son las interacciones por segundo.

      this.obtener_actores().forEach(function (actor) {
        actor.desactivar_el_modo_edicion();
      });
    }
  }

  obtener_actores() {
    return this.actores.slice();
  }

  /*
   * Se invoca automáticamente cuando se agrega un nuevo actor
   * a la escena.
   */
  actualizar_modo_edicion_cuando_agrega_actor(actor) {
    // Solo si el modo de edicion está activado, hace que el
    // actor nuevo se puede desplazar también.
    if (this._modo_edicion) {
      actor.activar_el_modo_edicion();
    }
  }

  acelerarLaVelocidadDeLasAnimaciones() {
    this.actores.forEach(actor => actor.acelerarLaVelocidadDeLasAnimaciones());
  }

  restaurarLaVelocidadDeLasAnimaciones() {
    this.actores.forEach(actor => actor.restaurarLaVelocidadDeLasAnimaciones());
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
