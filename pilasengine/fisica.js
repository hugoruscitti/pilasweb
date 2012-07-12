define(['mootools', 'singleton'], 
  function(mootools, singleton) {

  var Figura = new Class({
    initialize: function() {
      this._fisica = singleton.get().fisica;
    }
  })

  var Circulo = new Class({
    Extends: Figura,
    initialize: function() {
      console.log(this._fisica);
    }
  })

  var Fisica = new Class({
    initialize: function() {
        this.world = "asd";
    },
    actualizar: function(){
        // this.world.step(1/60, 3, 3);
    }
    //Circulo: Circulo,
  })

  return {
    Fisica: Fisica
  }
})
