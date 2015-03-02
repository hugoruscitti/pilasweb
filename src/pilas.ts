declare var pilas;
declare var window: Window;
declare var pilasengine;
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
/// <reference path="colores.ts />
/// <reference path="tareas.ts />
/// <reference path="sonidos.ts />
/// <reference path="evento.ts />


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

  tareas;           // acceso a módulo.
  rutinas;          // acceso a módulo.

  interpolaciones;  // acceso al módulo.
  colisiones;       // acceso al módulo.
  colores;          // acceso al módulo.
  sonidos;          // acceso al módulo.
  escena;          // acceso al módulo.
  eventos;          // acceso al módulo.

  ready;

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
    this.actores = new Actores(this);
    this.habilidades = new Habilidades();
    this.comportamientos = new Comportamientos();
    this.obtener_canvas();
    this.definir_tamano_del_canvas();
    this.conectar_eventos();

    this.imagenes = new Imagenes(this.onready, this.opciones);
    this.fondos = new Fondos();
    this.mundo = new Mundo();
    this.interpolaciones = new Interpolaciones();
    this.utils = new Utils();
    this.grupo = new grupo();
    this.colisiones = new Colisiones();
    this.colores = new colores();
    this.sonidos = new Sonidos(this.opciones.data_path);
    this.escena = new escena();
    this.tareas = new tareas();
    this.rutinas = new Rutinas();

    this.mundo.gestor_escenas.cambiar_escena(new Normal());

    this.eventos = new ProxyEventos();

    // Deshabilita el interpolado de pixels.
    var ctx = this.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    this.ready  = false;
  }

  observar_tareas(elemento_id, intervalo) {
    this.rutinas.observar_tareas(elemento_id, intervalo);
  }

	reiniciar() {
		// TODO: hacer que el fondo sea un atributo de la escena y que
		// siempre se inicialice ahí, y no en la función onload del lado del
		// usuario como hace ahora...

    this.mundo.gestor_escenas.cambiar_escena(new Normal());
		var fondo = new pilas.fondos.Plano();
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
    this.opciones.ancho = this.opciones.ancho || 320;
    this.opciones.alto = this.opciones.alto || 240;
    this.opciones.data_path = this.opciones.data_path || 'data';
    this.opciones.canvas_id = this.opciones.canvas_id || 'canvas';
    this.opciones.canvas = this.opciones.canvas || null;
    this.opciones.imagenesExtra = this.opciones.imagenesExtra || [];
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
    if (this.opciones.canvas !== null)
      this.canvas = this.opciones.canvas;
    else
      this.canvas = document.getElementById(this.opciones.canvas_id);

    if (! this.canvas)
      throw new Error("No se encuentra el elemento canvas (id='" + this.opciones.canvas_id + "'), especificalo con opciones como {canvas_id: 'id_del_canvas'}");
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
    this.rutinas.actualizar();
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

  /**
   * @method obtener_actores_en
   * Se ejecuta para conseguir una lista de todos los actores que estén en una
   * coordenanda determinada de la pantalla.
   *
   * Opcionalmente se puede espeficiar una etiqueta a modo de filtro, con el
   * parámetro "con_etiqueta".
   *
   * ejemplos de invocaciones:
   *
   *     >>> pilas.obtener_actores_en(0, 0)
   *     [Actor, Mono, Fondo]
   *
   *     >>> pilas.obtener_actores_en(0, 0, 'Mono')
   *     [Mono]
   *
   */
  obtener_actores_en(x, y, con_etiqueta=undefined) {
    var actores = [];

    for (var i=0; i<this.escena_actual().actores.length; i++) {
      var actor = this.escena_actual().actores[i];

      if (actor.colisiona_con_un_punto(x, y)) {
        if (con_etiqueta) {
          if (actor.tiene_etiqueta(con_etiqueta))
            actores.push(actor);
        } else {
          actores.push(actor);
        }
      }
    }

    return actores;
  }

  obtener_actores_con_etiqueta(etiqueta) {
    var actores = [];

    for (var i=0; i<this.escena_actual().actores.length; i++) {
      var actor = this.escena_actual().actores[i];

      if (actor.tiene_etiqueta(etiqueta))
        actores.push(actor);
    }

    return actores;
  }
    
  izquierda(){
      return 0 - this.opciones.ancho/2;
  }
    
  derecha(){
      return this.opciones.ancho/2;
  }
    
  arriba(){
      return this.opciones.alto/2;
  }
    
  abajo(){
      return 0 - this.opciones.alto/2;
  }

}

pilas = new Pilas();

pilasengine = {
  iniciar: function iniciar(opciones) {
    window['pilas'] = new Pilas();

    window['pilas'].iniciar(opciones);
    return window['pilas'];
  }
}
