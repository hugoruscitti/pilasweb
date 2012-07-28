define(['mootools', 'singleton'], 
  function(mootools, singleton) {

  var Figura = new Class({
    initialize: function() {
      this._fisica = singleton.get().fisica;
    }
  })

  /*
  * @Class Circulo
  * Representa un cuerpo de circulo, al asociarlo con
  * un actor, este se comportara como una pelota.
  */
  var Circulo = new Class({
    Extends: Figura,
    initialize: function() {
      console.log(this._fisica);
    }
  })

  var Fisica = new Class({
    initialize: function() {
      this.world = new b2World(
        new b2Vec2(0, 10), // gravedad
        true // allow sleep
      );
    },
    actualizar: function(){
      this.world.step(1/60, 3, 3);
    }
    //Circulo: Circulo,
  })

  return {
    Fisica: Fisica,
    Circulo: Circulo
  }
})
