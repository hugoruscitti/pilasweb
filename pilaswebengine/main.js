define(['singleton', 'pilas', 'mootools', 'libs/easeljs-0.4.2.min'], function(singleton, pilas, mootools, easeljs){
  // 'utils', 'libs/easeljs-0.4.2.min', 'libs/Box2dWeb-2.1.a.3.min'], function(pilas, mootools, utils, easel, box2d){

  /*
  var Fisica = new Class({
    initialize: function() {
      var Vector = Box2D.Common.Math.b2Vec2;
      var World = Box2D.Dynamics.b2World;

      this.world = new World(new Vector(0, 10), true);
    },
    crear_circulo: function() {
      return "pepe"
    },
  });




  function alias(obj, longcut, shortcut) {
    obj.__defineGetter__(shortcut, function(){return this[longcut]});
    obj.__defineSetter__(shortcut, function(v){this[longcut] = v;});
  }

  */


  /*
  alias(Texto.prototype, 'escala_x', 'es');

  function get_rotacion() {
    return this._rotacion
  }

  function set_rotacion(value) {
    this._rotacion = value;
  }

  function accesors(obj, name, getter, setter) {
    obj.__defineGetter__(name, getter)
    obj.__defineSetter__(name, setter)
  }

  accesors(Actor.prototype, 'rotacion', get_rotacion, set_rotacion)
  */

  /* for(var v in Actor.prototype) {console.log(v)} */

  /*
  Texto.prototype.__defineSetter__("escala", function(valor) {
    this.escala_x = valor;
    this.escala_y = valor;
  });
  */




  /*
  */

  //console.log(pilas)

  return {
    Pilas: pilas.Pilas
  };
});
