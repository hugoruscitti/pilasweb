define(['mootools', 'singleton'], function(mootools, singleton) {

  var Habilidad = new Class({
    initialize: function(actor) {},
    iniciar: function(actor) {
      // TODO usar el initialize para esto.
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
    initialize: function() {
      this.parent();
      console.log("Girar el actor");
      //this.figura = pilas.fisica.crear_circulo();
    },
    actualizar: function() {
      this.actor.rotacion += 1;
    }
  });

  var RebotarComoPelota = new Class({
    Extends: Habilidad,
    initialize: function() {
      this.parent();

      // Acceso a objeto pilas
      var pilas = singleton.get();
      console.log("Accediendo a pilas:", pilas);
      console.log("Accediendo a fisica:", pilas.fisica);

      this.figura = pilas.fisica.crear_circulo();
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
    RebotarComoPelota: RebotarComoPelota
  };
});
