define(['mootools'], function(mootools) {
  var Habilidad = new Class({
    iniciar: function(actor) {
      this.actor = actor;
    },
    actualizar: function() {
    }
  });

  var Estudiante = new Class({
    habilidades: [],
    aprender: function(habilidad) {
      habilidad.iniciar(this);
      this.habilidades.push(habilidad);
    },

    actualizar_habilidades: function() {
      for (var i=0; i<this.habilidades.length; i++) {
        this.habilidades[i].actualizar();
      }
    }
  });

  var Girar = new Class({
    Extends: Habilidad,
    actualizar: function() {
      // FIXME modificar el actor para que su atributo sea "rotacion" sin guion bajo.
      this.actor._rotacion += 1;
    }
  });

  var RebotarComoPelota = new Class({
    Extends: Habilidad,
    initialize: function() {
      //this.figura = pilas.fisica.crear_circulo();
    },
    actualizar: function() {
      //this.actor.x = this.figura.GetWorldCenter().x;
      //this.actor.y = this.figura.GetWorldCenter().y;
    }
  });

  return {
    Estudiante: Estudiante,
    Habilidad: Habilidad,
    Girar: Girar,
    //RebotarComoPelota: RebotarComoPelota
  };
});
