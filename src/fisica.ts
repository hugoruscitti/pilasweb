declare var Box2D;

class Figura {
  cuerpo;

  obtener_posicion() {
    var posicion = this.cuerpo.GetPosition();
    // TODO: Convertir a coordenadas de pantalla.
    return posicion;
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

    //var posicion = pilas.camara.convertir_de_posicion_relativa_a_fisica(this._opciones.x, this._opciones.y);
    // TODO: convertir las coordenadas x e y desde coordenadas pixels a coordenadas fisica.
    bodyDef.position.x = x;
    bodyDef.position.y = y;

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
  Circulo;

  constructor() {
    this.Circulo = Circulo;  // TODO: separar fisica como Motor y Módulo, dos clases separadas.

    this.gravedad = new Box2D.Common.Math.b2Vec2(0, 90);
    this.mundo = new Box2D.Dynamics.b2World(this.gravedad, false);
  }

  actualizar() {
    this.mundo.Step(1/20.0, 1, 1);
  }

  crear_circulo(x, y, radio, opciones) {
    return new this.Circulo(x, y, radio, opciones);
  }
}
