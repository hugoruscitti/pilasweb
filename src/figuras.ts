
class Figura {
  _cuerpo;

  constructor(cuerpo) {
    this._cuerpo = cuerpo;
  }

  obtener_x() {
    var box2d_position = this._cuerpo.GetBody().GetPosition();
    return pilas.fisica.convertir_a_pixels(box2d_position.x);
  }

  obtener_y() {
    var box2d_position = this._cuerpo.GetBody().GetPosition();
    return pilas.fisica.convertir_a_pixels(box2d_position.y);
  }

  obtener_rotacion() {
    var box2d_cuerpo = this._cuerpo.GetBody();
    return box2d_cuerpo.GetAngle();
  }

}

class Circulo extends Figura {

  constructor(x, y, radio) {
    console.log(this);
    console.log(x, y, radio);

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    var fixDef = new b2FixtureDef;

    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    fixDef.shape = new b2CircleShape(pilas.fisica.convertir_a_metros(radio));

    bodyDef.position.x = pilas.fisica.convertir_a_metros(120);
    bodyDef.position.y = pilas.fisica.convertir_a_metros(100);
    super(pilas.fisica.mundo.CreateBody(bodyDef).CreateFixture(fixDef));
  }

}
