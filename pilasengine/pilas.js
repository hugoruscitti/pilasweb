define(
  ['singleton', 'eventos', 'mootools', 'actores',
   'camara', 'imagenes', 'depurador', 'utils', 'fisica'],
  function(singleton, eventos, mootools, actores,
    camara, imagenes, depurador, utils, fisica){
    
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
        //this.fisica = new fisica.Fisica()
        singleton.set(this);
        Ticker.setFPS(60);
        Ticker.addListener(this);

        this.eventos.click_de_mouse.conectar(function(e){
          var x = e.x, y = e.y;
          var actor;
          actor = that.actor_clickeado(x, y);
          if (actor) {
            actor.click();
          }
        });
      },

      /*
       * Agrega un actor a la lista de actores a dibujar y actualizar.
       */
      agregar_actor: function(actor) {
        this.lista_actores.push(actor);
      },

      eliminar_actor: function(actor) {
        this.lista_actores.erase(actor);
      },

      _actualizar_y_dibujar_actores: function(c) {

        this._limpiar(c);
        this.depurador.comienza_dibujado();
        //this.fisica.actualizar();

        for (var i=0; i<this.lista_actores.length; i++) {
          var actor = this.lista_actores[i];
          actor.actualizar();
          actor.dibujar(c);
          this.depurador.dibuja_al_actor(actor);
        }

        this.depurador.termina_dibujado();

      },

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

      /* Traduce coordenadas de canvas a pilas
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
      
      /* Borra toda la pantalla */
      _limpiar: function(c) {
        this.stage.clear();
      },

      /* 
       * Función de respuesta que se llama 60 veces por segundo.
       */
      tick: function() {
        this._actualizar_y_dibujar_actores(this.contexto);
      },

      obtener_instancia: function() {
        return singleton.get();
      },

      actores: actores
    });

    
    return {
      Pilas: Pilas
    };
  });
