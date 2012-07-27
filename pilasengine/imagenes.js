define(['mootools'], function(mootools) {
  var Imagen = new Class({
    initialize: function(ruta) {
      this.bitmap = new Bitmap(ruta);
    },

    dibujar: function(contexto) {
        this.bitmap.draw(contexto);
    }

  });

  var Grilla = new Class({
    Extends: Imagen,

    initialize: function(ruta, filas, columnas) {
      this.bitmap = new Bitmap(ruta);
      this.filas = filas;
      this.columnas = columnas;
      this.cuadro = 0;
    },


    dibujar: function(contexto) {
        var ancho_cuadro = this.bitmap.image.width / this.columnas;
        var alto_cuadro = this.bitmap.image.height / this.filas;

        this.bitmap.sourceRect = new Rectangle(this.cuadro * ancho_cuadro, 0, ancho_cuadro, alto_cuadro);

        this.bitmap.draw(contexto);
    }

  });


  var Imagenes = new Class({

    initialize: function(prefijo) {
        this.prefijo = prefijo || "data/";
    },

    cargar: function(ruta) {
        var imagen = new Imagen(this.prefijo + ruta);
        return imagen;
    },
     
    cargar_grilla: function(ruta, opciones) {
      var opciones = opciones || {};
      var filas = opciones.filas || 1;
      var columnas = opciones.columnas || 1;
      var grilla = new Grilla(this.prefijo + ruta, filas, columnas);
      return grilla;
    }
  });

  return {
    Imagenes: Imagenes
  };
});
