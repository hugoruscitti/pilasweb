declare var pilas;
declare var PxLoader;
declare var createjs;

/// <reference path="actores.ts />
/// <reference path="utils.ts />
/// <reference path="grupo.ts />
/// <reference path="fondos.ts />
/// <reference path="imagenes.ts />
/// <reference path="mundo.ts />
/// <reference path="escenas.ts />
/// <reference path="interpolaciones.ts />
/// <reference path="habilidades.ts />
/// <reference path="comportamientos.ts />
/// <reference path="colisiones.ts />


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
  
  fondos;           // acceso a módulo.
  imagenes;         // acceso a módulo.
  actores;          // acceso a módulo.
  habilidades;      // acceso a módulo.
  comportamientos;  // acceso a módulo.
  utils;            // acceso a módulo.
  grupo;            // acceso a módulo.

  interpolaciones;  // acceso al módulo.
  colisiones;       // acceso al módulo.

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
    this.comportamientos = new Comportamientos();
    this.obtener_canvas();
    this.definir_tamano_del_canvas();
    this.conectar_eventos();

    this.imagenes = new Imagenes(this.onready, this.opciones.data_path);
    this.fondos = new Fondos();
    this.mundo = new Mundo();
    this.interpolaciones = new Interpolaciones();
    this.utils = new Utils();
    this.grupo = new grupo();
    this.colisiones = new Colisiones();

    this.mundo.gestor_escenas.cambiar_escena(new Normal());
  }

  /**
   * @method escena_actual
   * Retorna la escena en curso.
   */
  escena_actual() {
    if (this.mundo === undefined) {
      console.log("epa!");
    } else {
      var escena = this.mundo.gestor_escenas.escena_actual();
      return escena;
    }
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
   * @method obtener_codigo_y_texto_desde_evento
   * @private
   *
   * A partir del evento de teclado, obtiene su codigo y el texto de
   * la tecla presionada.
   */
  private obtener_codigo_y_texto_desde_evento(event) {
    var codigo;
    var texto;

    if (typeof event.which == "number") {
      codigo = event.which;
    }
    else {
      codigo = event.keyCode;
    }

    texto = String.fromCharCode(codigo);

    return {codigo: codigo, texto: texto};
  }

  /**
   * @method conectar_eventos
   * @private
   *
   * Conecta los eventos del mouse y teclado a los métodos manejadores
   * de eventos de la escena actual.
   */
  private conectar_eventos() {
    this.canvas.onmousedown = function (event) {
      var posicion = pilas.obtener_posicion_desde_evento(this, event);
      pilas.escena_actual().click_de_mouse.emitir(posicion);
    }

    this.canvas.onmouseup = function (event) {
      var posicion = pilas.obtener_posicion_desde_evento(this, event);
      pilas.escena_actual().cuando_termina_click.emitir(posicion);
    }

    this.canvas.onmousemove = function (event) {
      var posicion = pilas.obtener_posicion_desde_evento(this, event);
      pilas.escena_actual().mueve_mouse.emitir(posicion);
    }

    window.onkeydown = function (event) {
      var e = pilas.obtener_codigo_y_texto_desde_evento(event);
      pilas.escena_actual().pulsa_tecla.emitir(e);
    }

    window.onkeyup = function (event) {
      var e = pilas.obtener_codigo_y_texto_desde_evento(event);
      pilas.escena_actual().suelta_tecla.emitir(e);
    }
  }

  /**
   * @method obtener_posicion_desde_evento
   * @private
   *
   * A partir del evento del mouse, obtiene la posicion del puntero en
   * las coordenadas de Pilas.
   */
  private obtener_posicion_desde_evento(canvas, event) {
    var escena = pilas.escena_actual();
    var camara = escena.camara;
    var posicion = escena.obtener_posicion_escenario(escena.stage.mouseX,
                                                     escena.stage.mouseY);
    posicion.boton = event.which;

    return posicion;
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
      throw new Error("No se encuentra el elemento canvas (id='" + this.opciones.canvas_id + "')");
  }

  /**
   * @method onready
   * Callback que se invoca una vez que pilas puede comenzar a funcionar.
   */
  onready() {
    throw "pilas-engine ha iniciado, pero el metodo onready está vacío. Tienes que sobre-escribirlo...";
  }

  /**
   * @method ejecutar
   * Pone en funcionamiento el bucle principal.
   */
  ejecutar() {
    var self = this;

    // TODO: Limpiar los listeners con un mensaje y
    //       no accediendo directamente a la propiedad.
    createjs.Ticker.setFPS(60);
    var my_tick = function(event) {self.actualizar()};
    createjs.Ticker.addEventListener('tick', my_tick);
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

  mostrar_posiciones() {
    var modos = this.mundo.obtener_modos();
    modos.puntos_de_control = true;
    this.definir_modos(modos);
    return "Mostrando posiciones";
  }

  ocultar_posiciones() {
    var modos = this.mundo.obtener_modos();
    modos.puntos_de_control = false;
    this.definir_modos(modos);
    return "Ocultando posiciones";
  }

  mostrar_fisica() {
    var modos = this.mundo.obtener_modos();
    modos.fisica = true;
    this.definir_modos(modos);
    return "Mostrando fisica";
  }

  ocultar_fisica() {
    var modos = this.mundo.obtener_modos();
    modos.fisica = false;
    this.definir_modos(modos);
    return "Ocultando fisica";
  }


}

pilas = new Pilas();
