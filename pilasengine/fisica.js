define(['mootools', 'libs/Box2dWeb-2.1.a.3', 'singleton'], 
  function(mootools, _Box2D, singleton) {
    // TODO Box2D no es un modulo de require.js por eso
    // el argumento que estamos recibiendo es _Box2D, para no pisar el window.Box2D que 
    // se esta cargando en el archivo js de box2d
  
  var Figura = new Class({
    initialize: function() {
      // console.log("figura", pilas, pilas.obtener_instancia())
      console.log("desde figura", singleton.get());
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
      this.parent();
      console.log("desde circulo", this._fisica);
    }
  })

  var Fisica = new Class({
    initialize: function(pilas) {
      this.pilas = pilas;
      // crear el mundo
      this.mundo = new Box2D.Dynamics.b2World(
        new Box2D.Common.Math.b2Vec2(0, 10), // vector gravedad
        true
      );
      // crear el objeto suelo
      // usa un fixture con la forma de rectangular
      var fixDef = new Box2D.Dynamics.b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;
      fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
      fixDef.shape.SetAsBox(20, 2);

      // crear el cuerpo como un objeto estatico
      var bodyDef = new Box2D.Dynamics.b2BodyDef;
      bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
      bodyDef.position.Set(10, 400 / 30 + 1.8);

      // instertar el objeto suelo en el mundo
      this.mundo.CreateBody(bodyDef).CreateFixture(fixDef);
    },
    actualizar: function(){
      this.mundo.step(1/60, 3, 3);
    },
    // TODO: faltan parametros, solo es prueba.
    crear_circulo: function(){
      return new Circulo();
    }
  })

  return {
    Fisica: Fisica,
    Circulo: Circulo
  }
})
