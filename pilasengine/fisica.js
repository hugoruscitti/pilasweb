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
    },
    Circulo: Circulo,
  })

  return {
    Fisica: Fisica
  }
})
