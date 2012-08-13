define(
  ['singleton', 'eventos', 'mootools', 'actores',
   'camara', 'imagenes', 'depurador', 'utils', 
   'fisica', 'habilidades'],
  function(singleton, eventos, mootools, actores,
    camara, imagenes, depurador, utils, fisica, habilidades){
    
    /**
     * Representa la clase principal que controla el videojuego.
     * @singleton
     *
     *      @example
     *      var pilas = new pilasengine.Pilas("canvas", "../data");
     */
    var Pilas = new Class({

      initialize: function(id_canvas, prefijo_imagenes) {
        var that = this;
        this.canvas = document.id(id_canvas);
        if (this.canvas === null)
          throw new Error("El elemento " + id_canvas + " no existe en la pagina");

        this.stage = new Stage(this.canvas);
        this.contexto = this.canvas.getContext("2d");
        this.lista_actores = [];
        this.camara = new camara.Camara(this.canvas);
        this.eventos = new eventos.Eventos(this.canvas);

        // carga de imagenes
        this.imagenes = new imagenes.Imagenes(prefijo_imagenes);
        this.depurador = new depurador.Depurador(this);

        this.utils = new utils.Utils();
        
        // Cargar el mundo de Box2d
        
        // NOTA: se envia la referencia a this, porque de otra forma, la clase
        //       Fisica no puede acceder al objeto pilas. El singleton en este
        //       caso no funcionaria, porque estamos en el contexto del constructor
        //       del singleton.
        this.fisica = new fisica.Fisica(this);
        
        singleton.set(this);
        Ticker.setFPS(200);
        Ticker.addListener(this);
      },

      deshabilitar_main_loop: function() {
        Ticker.removeAllListeners();
      },

      /**
       * Agrega un actor a la lista de actores a dibujar y actualizar.
       */
      agregar_actor: function(actor) {
        this.lista_actores.push(actor);
      },

      /**
       * Quita un actor de la escena.
       */
      eliminar_actor: function(actor) {
        this.lista_actores.erase(actor);
      },

      /**
       * @private
       *
       * Actualiza la pantalla y a todos los actores.
       *
       */
      _actualizar_y_dibujar_actores: function(c) {

        this._limpiar(c);
        this.depurador.comienza_dibujado();
        this.fisica.actualizar();

        for (var i=0; i<this.lista_actores.length; i++) {
          var actor = this.lista_actores[i];
          actor.actualizar_habilidades();
          actor.actualizar();
          actor.dibujar(c);
          this.depurador.dibuja_al_actor(actor);
        }

        this.depurador.termina_dibujado();
      },

      /**
       * Retorna el actor que se encuentre debajo de la posición del mouse.
       */
      actor_clickeado: function (x, y) {
        var txy;
        txy = this.traducir_coordenadas(x, y);
        for (var i=0; i<this.lista_actores.length; i++) {
          var actor = this.lista_actores[i];
          if (actor.punto_interno(txy.x, txy.y)) {
            return actor;
          }
        }
      },

      /**
       * Traduce coordenadas de canvas a pilas
       * Canvas tiene el 0,0 arriba a la izquierda
       * Pilas tiene el 0,0 en el centro del canvas
       */
      traducir_coordenadas: function (x, y) {
        var canvas = this.canvas;
        var w, h, nx, ny;
        w = canvas.width;
        h = canvas.height;
        nx = x - w/2.0;
        ny = (-(h/2.0)) + (h - y);
        return {x: nx, y: ny};
      },
      
      /**
       * Borra toda la pantalla
       */
      _limpiar: function(c) {
        this.stage.clear();
      },

      /**
       * Función de respuesta que se llama 60 veces por segundo.
       */
      tick: function() {
        this._actualizar_y_dibujar_actores(this.contexto);
      },

      /**
       * Retorna una instancia unica de pilas.
       */
      obtener_instancia: function() {
        return singleton.get();
      },

      /**
       * @property
       * Contine a todos los actores disponibles.
       */
      actores: actores,

      /**
       * @property
       * Contiene a todas las habilidades que los actores pueden aprender.
       */
      habilidades: habilidades,
    });

    
    return {
      Pilas: Pilas
    };
  });