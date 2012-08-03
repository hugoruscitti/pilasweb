define(['mootools', 'libs/Box2dWeb-2.1.a.3', 'singleton'], 
  function(mootools, _Box2D, singleton) {
    // TODO Box2D no es un modulo de require.js por eso
    // el argumento que estamos recibiendo es _Box2D, para no pisar el window.Box2D que 
    // se esta cargando en el archivo js de box2d
  
  var Figura = new Class({
    initialize: function() {
      this._fisica = singleton.get().fisica;
    },

    /**
     * Retorna la posicion de la figura en coordenadas relativas
     * de pantalla, donde el centro de la ventana es (0,0)
     */
    obtener_posicion: function() {
      var pilas = singleton.get();
      var p = this.cuerpo.GetPosition();

      return pilas.camara.convertir_de_posicion_fisica_a_relativa(p.x, p.y)
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
      radio: 25,
      dinamica: true, 
      densidad: 1.0,
      restitucion: 0.56, 
      friccion: 10.5, 
      amortiguacion: 0.1,
      fisica: null, 
      sin_rotacion: false
    },
    initialize: function(opciones) {
      var pilas = singleton.get();
      
      this.parent(opciones);

      this._opciones = Object.merge(this._opciones, opciones);

      // definir los atributos del circulo
      var fixDef = new Box2D.Dynamics.b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;

      fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this._opciones.radio); 

      // crear el body dinamico
      var bodyDef = new Box2D.Dynamics.b2BodyDef;

      var posicion = pilas.camara.convertir_de_posicion_relativa_a_fisica(this._opciones.x, this._opciones.y);
      bodyDef.position.x = posicion.x
      bodyDef.position.y = posicion.y

      bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
      this.cuerpo = this._fisica.mundo.CreateBody(bodyDef);
      this.cuerpo.CreateFixture(fixDef);
    }
  })

  var Fisica = new Class({

    initialize: function(pilas) {
      //this.pilas = pilas;
      var gravedad = new Box2D.Common.Math.b2Vec2(0, 90);
      this.mundo = new Box2D.Dynamics.b2World(gravedad, false);
      this.crear_bordes_del_escenario();
    },

    crear_bordes_del_escenario: function() {
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
    },

    crear_circulo: function(opciones){
      return new Circulo(opciones);
    },
  })

  return {
    Fisica: Fisica,
    Circulo: Circulo
  }
})
