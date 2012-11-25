define(
  ['require', 'singleton', 'actores/actor', 'mootools'],
  function(require, singleton, actor, mootools){
    /**
     * @extends Actor
     */
    var Aceituna = new Class({
      Extends: actor.Actor,
      initialize: function(x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
        this.parent("sin_imagen.png", x, y, centro_x, centro_y, escala_x, escala_y, rotacion);
        this.nombre = "Aceituna";
        this.imagen = this.cargar_imagen("actores/aceituna.png");
        this.centro_x = 18;
        this.centro_y = 18;
      },
      actualizar: function(){
      },
      click: function(){
        this.eliminar();
      }
    });

    return {
      Aceituna: Aceituna
    };
  }
);
