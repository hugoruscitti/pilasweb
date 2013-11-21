declare var Box2D;
var PPM = 30

function convertir_a_metros(valor) {
  return valor / PPM;
}

function convertir_a_pixels(valor) {
  return valor * PPM;
}


class Figura {
  cuerpo;

  obtener_posicion() {
    var posicion = this.cuerpo.GetPosition();
    posicion.x = convertir_a_pixels(posicion.x);
    posicion.y = convertir_a_pixels(posicion.y);

    return pilas.escena_actual().camara.convertir_de_posicion_fisica_a_relativa(posicion.x, posicion.y);
  }
}


class Circulo extends Figura {
  constructor(x, y, radio, opciones) {
    super();
    var fixDef = new Box2D.Dynamics.b2FixtureDef;

    fixDef.density = opciones.densidad || 1.0;
    fixDef.friction = opciones.friccion || 0.5;
    fixDef.restitution = opciones.restitucion || 0.2;

    fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(radio);

    // crear el body dinamico
    var bodyDef = new Box2D.Dynamics.b2BodyDef;

    var posicion = pilas.escena_actual().camara.convertir_de_posicion_relativa_a_fisica(x, y);
    bodyDef.position.x = convertir_a_metros(posicion.x);
    bodyDef.position.y = convertir_a_metros(posicion.y);

    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    this.cuerpo = pilas.escena_actual().fisica.mundo.CreateBody(bodyDef);
    this.cuerpo.CreateFixture(fixDef);
  }
}

/**
 * @class Fisica
 */
class Fisica {
  gravedad;
  mundo;
  velocidad;
  timeStep;

  Circulo;

  constructor() {
    this.Circulo = Circulo;  // TODO: separar fisica como Motor y Módulo, dos clases separadas.

    this.gravedad = new Box2D.Common.Math.b2Vec2(0, 10);
    this.mundo = new Box2D.Dynamics.b2World(this.gravedad, false);
    this.velocidad = 1.0;
    this.timeStep = this.velocidad/120.0;

    this.crear_bordes_del_escenario();
  }

  crear_bordes_del_escenario() {
    // crear el objeto suelo
    // usa un fixture con la forma de rectangular
    var fixDef = new Box2D.Dynamics.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.7;
    fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
    fixDef.shape.SetAsBox(convertir_a_metros(500), convertir_a_metros(10));

    // crear el cuerpo como un objeto estatico
    var bodyDef = new Box2D.Dynamics.b2BodyDef;
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    bodyDef.position.Set(convertir_a_metros(-100), convertir_a_metros(100));

    // instertar el objeto suelo en el mundo
    this.mundo.CreateBody(bodyDef).CreateFixture(fixDef);
  }

  actualizar() {
    this.mundo.Step(this.timeStep, 6, 3);
  }

  crear_circulo(x, y, radio, opciones) {
    return new this.Circulo(x, y, radio, opciones);
  }
}
