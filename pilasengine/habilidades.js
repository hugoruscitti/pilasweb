define(['mootools', 'singleton'], 
  function(mootools, singleton) {

  var Habilidad = new Class({
    initialize: function(actor) {
      console.log("Iniciando habilidad actor:", actor);
      this.actor = actor;
    },
    iniciar: function(actor) {
      
    },
    actualizar: function() {
    }
  });

  var Estudiante = new Class({
    habilidades: [],
    aprender: function(habilidad) {
      var habilidad = new habilidad(this);
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
    initialize: function(actor) {
      this.parent(actor);

      // Acceso a objeto pilas
      var pilas = singleton.get();
      console.log("Accediendo a pilas:", pilas);
      console.log("Accediendo a fisica:", pilas.fisica);
      console.log("Soy el actor", this.actor);
      //this.figura = new pilas.fisica.Circulo;

      /*this.figura = pilas.fisica.crear_circulo({
        x: this.actor.x,
        y: this.actor.y
      });*/
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
