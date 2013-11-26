declare var Box2D;
var PPM = 30

var box2d = {
  b2Vec2: Box2D.Common.Math.b2Vec2,
  b2AABB: Box2D.Collision.b2AABB,
  b2BodyDef: Box2D.Dynamics.b2BodyDef,
  b2Body: Box2D.Dynamics.b2Body,
  b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
  b2Fixture: Box2D.Dynamics.b2Fixture,
  b2World: Box2D.Dynamics.b2World,
  b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
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
    var x = convertir_a_pixels(posicion.x);
    var y = convertir_a_pixels(posicion.y);

    return this.camara.convertir_de_posicion_fisica_a_relativa(x, y);
  }

  definir_posicion(x, y) {
    var v = this.cuerpo.GetPosition();
    var pos = this.camara.convertir_de_posicion_relativa_a_fisica(x, y);

    var _x = convertir_a_metros(pos.x);
    var _y = convertir_a_metros(pos.y);

    v.x = _x;
    v.y = _y;

    this.cuerpo.SetPosition(v);
    this.empujar(0, 0);
  }

  obtener_rotacion() {
    return (this.cuerpo.GetAngle() * 180) / Math.PI;
  }

  empujar(dx, dy) {
    var v = this.cuerpo.GetLinearVelocity();
    v.x = convertir_a_metros(dx);
    v.y = convertir_a_metros(dy);
    this.cuerpo.SetLinearVelocity(v);
  }

  definir_radio(radio) {
    var fixture = this.cuerpo.GetFixtureList();

    if (fixture) {
      var shape = fixture.GetShape();
      shape.SetRadius(convertir_a_metros(radio));
    }
  }

  obtener_radio() {
    var fixture = this.cuerpo.GetFixtureList();

    if (fixture) {
      var shape = fixture.GetShape();
      return convertir_a_pixels(shape.GetRadius());
    }
  }
}


class Rectangulo extends Figura {
  constructor(fisica, x, y, ancho, alto, opciones) {
    super(fisica);

    if (opciones.dinamico === undefined)
      opciones.dinamico = true;

    var bodyDef = new box2d.b2BodyDef;

    if (opciones.dinamico)
      bodyDef.type = box2d.b2Body.b2_dynamicBody;
    else
      bodyDef.type = box2d.b2Body.b2_staticBody;

    var pos = this.fisica.camara.convertir_de_posicion_relativa_a_fisica(x, y);
    bodyDef.position.Set(convertir_a_metros(pos.x), convertir_a_metros(pos.y));
    //bodyDef.userData=data;

    var polygonShape = new box2d.b2PolygonShape;
    polygonShape.SetAsBox(convertir_a_metros(ancho/2), convertir_a_metros(alto/2));

    var fixtureDef = new box2d.b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.5;
    fixtureDef.shape = polygonShape;

    var body = this.fisica.mundo.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);

    this.cuerpo = body;
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

    fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(convertir_a_metros(radio));

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
  }
}


class Fisica {
  mundo;

  Circulo;
  Rectangulo;
  camara;
  velocidad;
  timeStep;

  constructor(camara) {
    this.camara = camara;
    this.mundo = new box2d.b2World(new box2d.b2Vec2(0, 10), false);
    this.Rectangulo = Rectangulo; // TODO: separar fisica como Motor y Módulo, dos clases separadas.
    this.Circulo = Circulo;       // TODO: separar fisica como Motor y Módulo, dos clases separadas.
    this.velocidad = 1.0;
    this.timeStep = this.velocidad/120.0;

    // Bordes del escenario
    this.crear_rectangulo(0, -118, 320, 5, {dinamico: false}); // abajo
    this.crear_rectangulo(0, 118, 320, 5,  {dinamico: false}); // arriba
    this.crear_rectangulo(-158, 0, 5, 240, {dinamico: false}); // izquierda
    this.crear_rectangulo( 158, 0, 5, 240, {dinamico: false}); // derecha
  }

  actualizar() {
    this.mundo.Step(this.timeStep, 6, 3);
    this.mundo.ClearForces();
  }

  definir_gravedad(dx, dy) {
    this.mundo.SetGravity(new box2d.b2Vec2(dx, dy));
  }

  dibujar_figuras_sobre_lienzo(graphics) {

	  for(var b = this.mundo.m_bodyList; b != null; b = b.m_next){

      var fixture = b.GetFixtureList();

      if (fixture) {
        var x = b.GetPosition().x * PPM; 
        var y = b.GetPosition().y * PPM;
        var shape = fixture.GetShape();

        // dibuja un circulo en el centro de la figura.
        //graphics.beginStroke("#FFF").
        //    drawCircle(
        //      x,
        //      y,
        //      5
        //    ).
        //endStroke();

        if (shape.GetRadius !== undefined) {
          var radio = shape.GetRadius();
          graphics.beginStroke("#FFF").drawCircle(x, y, convertir_a_pixels(radio)).endStroke();

          var dx = Math.cos(b.GetAngle())
          var dy = Math.sin(b.GetAngle())

          graphics.beginStroke("white").
            moveTo(x, y).
            lineTo(x + convertir_a_pixels(dx * radio), y + convertir_a_pixels(dy * radio)).
          endStroke();
        } 

        if (shape.b2PolygonShape !== undefined) {
          var vertices = shape.GetVertices();
          var v2 = {};

          // TODO: reconstruir para que dibuje poligonos de cualquier cantidad
          //       de vertices.

          v2[0] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[0]);
          v2[1] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[1]);
          v2[2] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[2]);
          v2[3] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[3]);

            graphics.beginStroke("white").
              moveTo(v2[0].x, v2[0].y).
              lineTo(v2[1].x, v2[1].y).
              lineTo(v2[2].x, v2[2].y).
              lineTo(v2[3].x, v2[3].y).
              lineTo(v2[0].x, v2[0].y).
            endStroke();
        }
      }


		}

  }

  convertir_vector_relativo_a_pantalla(cuerpo, x, y, v) {
    var vector_salida = cuerpo.GetWorldVector(v);
    return {x: vector_salida.x * PPM + x,
            y: vector_salida.y * PPM + y}
  }

  createBox(width, height, pX, pY, type, data) {
		var bodyDef = new box2d.b2BodyDef;
		bodyDef.type = type;
		bodyDef.position.Set(pX/PPM, pY/PPM);
    //bodyDef.userData=data;

		var polygonShape = new box2d.b2PolygonShape;
		polygonShape.SetAsBox(width/2/PPM, height/2/PPM);

		var fixtureDef = new box2d.b2FixtureDef;
		fixtureDef.density = 1.0;
		fixtureDef.friction = 0.5;
		fixtureDef.restitution = 0.5;
		fixtureDef.shape = polygonShape;

		var body = this.mundo.CreateBody(bodyDef);
		body.CreateFixture(fixtureDef);
	}

  crear_rectangulo(x, y, ancho, alto, opciones) {
    return new this.Rectangulo(this, x, y, ancho, alto, opciones);
  }

  crear_circulo(x, y, radio, opciones) {
    return new this.Circulo(this, x, y, radio, opciones);
  }
}
