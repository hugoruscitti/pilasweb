declare var pilas;
declare var PxLoader;
declare var createjs;

/// <reference path="utils.ts />
/// <reference path="fondos.ts />
/// <reference path="imagenes.ts />


class Pilas {
  canvas;     // elemento canvas html.
  opciones;   // dict de opciones iniciales.
  stage;      // escenario de cretejs.
  
  fondos;       // acceso a modulo.
  imagenes;     // acceso a modulo.

  iniciar(opciones) {
    this.inicializar_opciones(opciones);
    this.obtener_canvas();

    this.stage = new createjs.Stage(this.canvas);
    this.imagenes = new Imagenes(this.onready, this.opciones.data_path);
    this.fondos = new Fondos();
  }

  private inicializar_opciones(opciones) {
    this.opciones = opciones || {};
    this.opciones.ancho = opciones.ancho || 320;
    this.opciones.alto = opciones.alto || 240;
    this.opciones.data_path = opciones.data_path || 'data';
  }

  private obtener_canvas() {
    // TODO: hacer parametrizable el id del canvas.
    this.canvas = document.getElementById('canvas');

    if (! this.canvas)
      throw new Error("No se encuentra el elemento canvas (id=canvas)");
  }

  onready() {
    console.log("pilas cargado");
  }

  ejecutar() {
    this.onready();
    setInterval(this.actualizar, 100);
  }

  actualizar() {
  }
}

//PxLoader();
pilas = new Pilas();
