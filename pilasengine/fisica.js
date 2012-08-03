define(['mootools', 'libs/Box2dWeb-2.1.a.3', 'singleton'], 
  function(mootools, _Box2D, singleton) {
    // TODO Box2D no es un modulo de require.js por eso
    // el argumento que estamos recibiendo es _Box2D, para no pisar el window.Box2D que 
    // se esta cargando en el archivo js de box2d
  
  var Figura = new Class({
    initialize: function() {
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
    _opciones: {
      x: 0, 
      y: 0, 
      radio: 0.1, 
      dinamica: true, 
      densidad: 1.0,
      restitucion: 0.56, 
      friccion: 10.5, 
      amortiguacion: 0.1,
      fisica: null, 
      sin_rotacion: false
    },
    initialize: function(opciones) {
      
      this.parent(opciones);

      this._opciones = Object.merge(this._opciones, opciones);

      // definir los atributos del circulo
      var fixDef = new Box2D.Dynamics.b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;

      // circulo de radio 50 metros = 50 pixels.
      fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(50); 

      // crear el body dinamico
      var bodyDef = new Box2D.Dynamics.b2BodyDef;
      bodyDef.position.x = 100;
      bodyDef.position.y = 150;
      //bodyDef.position.y = this._opciones.y;
      bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
      this.cuerpo = this._fisica.mundo.CreateBody(bodyDef);
      this.cuerpo.CreateFixture(fixDef);

      console.log(this.cuerpo.GetPosition());

      console.log("Cuerpo del circulo", this.cuerpo);
    }
  })

  var Fisica = new Class({
    initialize: function(pilas) {
      //this.pilas = pilas;

      // crear el mundo
      this.mundo = new Box2D.Dynamics.b2World(
        new Box2D.Common.Math.b2Vec2(0, 90), // vector gravedad
        false
      );

      // crear el objeto suelo
      // usa un fixture con la forma de rectangular
      var fixDef = new Box2D.Dynamics.b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.7;
      fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
      fixDef.shape.SetAsBox(640, 2);

      // crear el cuerpo como un objeto estatico
      var bodyDef = new Box2D.Dynamics.b2BodyDef;
      bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
      bodyDef.position.Set(0, 400);

      // instertar el objeto suelo en el mundo
      this.mundo.CreateBody(bodyDef).CreateFixture(fixDef);
    },

    actualizar: function(){
      this.mundo.Step(1/20.0, 1, 1);

      //setup debug draw
      var debugDraw = new Box2D.Dynamics.b2DebugDraw();
      var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
      debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
      debugDraw.SetDrawScale(1.0);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      this.mundo.SetDebugDraw(debugDraw);
      this.mundo.DrawDebugData();
    },

    crear_circulo: function(opciones){
      return new Circulo(opciones);
    }
  })

  return {
    Fisica: Fisica,
    Circulo: Circulo
  }
})
