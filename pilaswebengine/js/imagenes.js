define(['mootools'], function(mootools) {
  var Imagenes = new Class({

    initialize: function(prefijo) {
        this.prefijo = prefijo || "pilaswebengine/data/";
    },

    cargar: function(ruta) {
        var imagen = new Bitmap(this.prefijo + ruta);
        return imagen;
    }
  });

  return {
    Imagenes: Imagenes
  };
});
