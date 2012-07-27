define(
  ['mootools', 'singleton', 'habilidades'],
  function(mootools, singleton, habilidades){
    /**
     * @class Actor
     * Representa un actor/personaje visible en pantalla.
     *
     */
    var Actor = new Class({
      Implements: [habilidades.Estudiante],

      initialize: function(imagen, x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
        imagen = imagen || "sin_imagen.png";

        this.imagen = this.cargar_imagen(imagen);
        this.inicializar(x, y, centro_x, centro_y, escala_x, escala_y, rotacion);

        this.centro_x = 16;
        this.centro_y = 16;
        singleton.get().agregar_actor(this);
      },

      inicializar: function(x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
        /** @property {Int} x posicion horizontal. */
        /** @property {Int} y posicion vertical. */
        this.x = x || 0;
        this.y = y || 0;
        this.centro_x = centro_x || 0;
        this.centro_y = centro_y || 0;

        this.escala_x = escala_x || 1;
        this.escala_y = escala_y || 1;
        this._rotacion = rotacion || 0;
      },

      /**
       * Realiza la actualización lógica del actor.
       *
       * Este método se suele sobre-escribir para tener control sobre el actor.
       */
      actualizar: function() {
        this.actualizar_habilidades();
      },

      /**
       * Pinta el actor sobre el contexto de canvas.
       *
       * Este método se invoca automáticamente desde el mainloop
       * de pilasengine.
       */
      dibujar: function(contexto) {
        contexto.save();

        contexto.translate(this.x, -this.y);
        singleton.get().camara.fijar_posicion(contexto);

        contexto.rotate(singleton.get().utils.convertir_a_radianes(this._rotacion));
        contexto.scale(this.escala_x, this.escala_y);
        contexto.translate(-this.centro_x, -this.centro_y);

        this.imagen.dibujar(contexto);

        contexto.restore();
      },

      /**
       * Quita al actor del escenario de juego.
       */
      eliminar: function() {
        singleton.get().eliminar_actor(this);
      },

      /**
       * Permite alterar el centro o punto de control.
       *
       * Este punto (dx, dy) será tomado como el centro de rotación y
       * posición, entre otras transformaciones.
       */
      definir_centro: function(dx, dy) {
        if (dx === "centro")
          dx = this.imagen.image.width / 2;

        if (dy === "centro")
          dy = this.imagen.image.height / 2;

        this.centro_x = Math.round(dx);
        this.centro_y = Math.round(dy);
      },

      /**
       * Retorna true si el punto (x, y) está dentro del area visible del actor.
       */
      punto_interno: function(x, y) {
        if (Math.abs(x-this.x) < 20 && Math.abs(y-this.y) < 20){
          return true;
        }
        return false;
      },
      
      /**
       * Atajo para cargar imágenes.
       */
      cargar_imagen: function(ruta){
        return singleton.get().imagenes.cargar(ruta);
      },

      click: function(evento) {
      }
    });

    return {
      Actor: Actor
    };
  }
);
