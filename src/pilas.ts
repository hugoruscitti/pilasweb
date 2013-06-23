declare var pilas;
declare var PxLoader;
declare var createjs;

/// <reference path="actores.ts />
/// <reference path="utils.ts />
/// <reference path="fondos.ts />
/// <reference path="imagenes.ts />
/// <reference path="mundo.ts />
/// <reference path="escenas.ts />
/// <reference path="interpolaciones.ts />
/// <reference path="habilidades.ts />


/**
 * @class Pilas
 * @singleton
 *
 * Módulo pilas
 * ============
 *
 * Pilas es una biblioteca para facilitar el desarrollo de videojuegos. Es útil para 
 * programadores principiantes o para el desarrollo de juegos casuales.
 *
 * Este módulo contiene las funciones principales para iniciar y ejecutar la biblioteca.
 * {@img pilas-logo.png}
 *
 *     @example
 *     pilas.iniciar({ancho: 320, alto: 240});
 *     aceituna = new pilas.actores.Aceituna(); 
 */
class Pilas {
  canvas;     // elemento canvas html.
  opciones;   // dict de opciones iniciales.
  mundo;
  
  fondos;       // acceso a modulo.
  imagenes;     // acceso a modulo.
  actores;      // acceso a modulo.
  habilidades;  // acceso a modulo.

  interpolaciones;  // acceso al modulo.

  /**
   * @method iniciar 
   *
   * Inicia la ventana principal del juego con algunos detalles de funcionamiento.
   *
   * Ejemplo de invocación:
   *
   *     @example
   *     pilas.iniciar({ancho: 320, alto: 240, data_path: 'data/'});
   *
   * Parámetros:
   *
   * - data_path: La ruta hacia la carpeta donde están las imágenes de los actores. (Por defecto 'data/')
   *
   */
  iniciar(opciones) {
    this.inicializar_opciones(opciones);
    this.actores = new Actores();
    this.habilidades = new Habilidades();
    this.obtener_canvas();
    this.definir_tamano_del_canvas();

    this.imagenes = new Imagenes(this.onready, this.opciones.data_path);
    this.fondos = new Fondos();
    this.mundo = new Mundo();
    this.interpolaciones = new Interpolaciones();

    this.mundo.gestor_escenas.cambiar_escena(new Normal());
  }

  /**
   * @method escena_actual
   * Retorna la escena en curso.
   */
  escena_actual() {
    return this.mundo.gestor_escenas.escena_actual();
  }

  /**
   * @method inicializar_opciones
   * @private
   *
   * Carga las opciones iniciales y define los valores por omisión si es necesario.
   */
  private inicializar_opciones(opciones) {
    this.opciones = opciones || {};
    this.opciones.ancho = opciones.ancho || 320;
    this.opciones.alto = opciones.alto || 240;
    this.opciones.data_path = opciones.data_path || 'data';
    this.opciones.canvas_id = opciones.canvas_id || 'canvas';
  }

  /**
   * @method definir_tamano_del_canvas
   * @private
   *
   * Cambia el tamaño del canvas HTML en base a las opciones iniciales.
   */
  private definir_tamano_del_canvas() {
    this.canvas.width = this.opciones.ancho;
    this.canvas.height = this.opciones.alto;
  }

  /**
   * @method obtener_canvas
   * @private
   * 
   * Obtiene la referencia al elemento HTML canvas usando
   * el atributo *canvas_id* de las opciones iniciales.
   */
  private obtener_canvas() {
    this.canvas = document.getElementById(this.opciones.canvas_id);

    if (! this.canvas)
      throw new Error("No se encuentra el elemento canvas (id=canvas)");
  }

  /**
   * @method onready
   * Callback que se invoca una vez que pilas puede comenzar a funcionar.
   */
  onready() {
    throw "pilas-engine ha iniciado, pero el metodo onload está vacío. Tienes que sobre-escribirlo...";
  }

  /**
   * @method ejecutar
   * Pone en funcionamiento el bucle principal.
   */
  ejecutar() {
    this.onready();
    var self = this;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(function() {self.actualizar()});
  }

  /**
   * @method actualizar
   * Se ejecuta automáticamente 60 veces por segundo, para mantener el juego en funcionamiento.
   */
  actualizar() {
    this.mundo.actualizar()
  }

  interpolar(objeto, atributo, valor_o_valores, tiempo) {
    return this.interpolaciones.interpolar(objeto, atributo, valor_o_valores, tiempo);
  }

  definir_modos(modos) {
    this.mundo.definir_modos(modos);
  }
  
}

pilas = new Pilas();
