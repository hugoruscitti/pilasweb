declare var Box2D;
var PPM = 30

var box2d = {
  b2World: Box2D.Dynamics.b2World,
  b2Vec2: Box2D.Common.Math.b2Vec2,
  b2DebugDraw: Box2D.Dynamics.b2DebugDraw,
}

function convertir_a_metros(valor) {
  return valor / PPM;
}

function convertir_a_pixels(valor) {
  return valor * PPM;
}


class Figura {
  cuerpo;
  camara;
  fisica;

  constructor(fisica) {
    this.fisica = fisica;
    this.camara = fisica.camara;
  }

  obtener_posicion() {
    var posicion = this.cuerpo.GetPosition();
    posicion.x = convertir_a_pixels(posicion.x);
    posicion.y = convertir_a_pixels(posicion.y);

    return this.camara.convertir_de_posicion_fisica_a_relativa(posicion.x, posicion.y);
  }
}


class Circulo extends Figura {
  constructor(fisica, x, y, radio, opciones) {
    super(fisica);
    opciones.dinamico = opciones.dinamico || true;
    var fixDef = new Box2D.Dynamics.b2FixtureDef;

    fixDef.density = opciones.densidad || 1.0;
    fixDef.friction = opciones.friccion || 0.5;
    fixDef.restitution = opciones.restitucion || 0.2;

    fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(radio);

    // crear el body dinamico
    var bodyDef = new Box2D.Dynamics.b2BodyDef;

    var posicion = this.camara.convertir_de_posicion_relativa_a_fisica(x, y);
    posicion.x = convertir_a_metros(posicion.x);
    posicion.y = convertir_a_metros(posicion.y);

    bodyDef.position.x = posicion.x;
    bodyDef.position.y = posicion.y;

    if (opciones.dinamico)
      bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    else
      bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    this.cuerpo = this.fisica.mundo.CreateBody(bodyDef);
    this.cuerpo.CreateFixture(fixDef);

    window['cuerpo'] = this.cuerpo;
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
  camara;
  debug;

  constructor(camara) {
    this.Circulo = Circulo;  // TODO: separar fisica como Motor y Módulo, dos clases separadas.
    this.camara = camara;

    this.gravedad = new box2d.b2Vec2(0, 9);
    this.mundo = new box2d.b2World(this.gravedad, false);
    this.velocidad = 1.0;
    this.timeStep = this.velocidad/120.0;

    //this.crear_bordes_del_escenario();
    //this.crear_modo_depuracion();
  }

  crear_modo_depuracion() {
    this.debug = new box2d.b2DebugDraw();
    this.debug.SetDrawScale(PPM);
  }

  crear_bordes_del_escenario() {
    // crear el objeto suelo
    // usa un fixture con la forma de rectangular
    var fixDef = new Box2D.Dynamics.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 1.0;
    fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
    fixDef.shape.SetAsBox(1, 1);

    // crear el cuerpo como un objeto estatico
    var bodyDef = new Box2D.Dynamics.b2BodyDef;
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    var posicion = this.camara.obtener_posicion_pantalla(-100, -100);
    console.log(posicion);
    //var posicion = {x: 100, y: 100};

    bodyDef.position.y = convertir_a_metros(200);
    bodyDef.position.x = convertir_a_metros(0);

    // instertar el objeto suelo en el mundo
    this.mundo.CreateBody(bodyDef).CreateFixture(fixDef);
  }

  actualizar() {
    this.mundo.Step(this.timeStep, 6, 3);
  }

  crear_circulo(x, y, radio, opciones) {
    return new this.Circulo(this, x, y, radio, opciones);
  }
}
