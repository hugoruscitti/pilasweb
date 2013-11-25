
/*
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

  class Rectangulo extends Figura {
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


  class FisicaAnterior {
    gravedad;
    mundo;
    velocidad;
    timeStep;

    Circulo;
    Rectangulo;
    camara;
    debug;

    constructor(camara) {
      this.Circulo = Circulo;       // TODO: separar fisica como Motor y Módulo, dos clases separadas.
      this.Rectangulo = Rectangulo; // TODO: separar fisica como Motor y Módulo, dos clases separadas.
      this.camara = camara;

      this.velocidad = 1.0;
      this.timeStep = this.velocidad/120.0;

      //this.crear_bordes_del_escenario();

      var   b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2AABB = Box2D.Collision.b2AABB
            ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
            ,	b2Body = Box2D.Dynamics.b2Body
            ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            ,	b2Fixture = Box2D.Dynamics.b2Fixture
            ,	b2World = Box2D.Dynamics.b2World
            ,	b2MassData = Box2D.Collision.Shapes.b2MassData
            ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;
           
      this.gravedad = new box2d.b2Vec2(0, 9);
      this.mundo = new box2d.b2World(this.gravedad, true);

    }

    crear_bordes_del_escenario() {
      var b2Vec2 = Box2D.Common.Math.b2Vec2;
      var b2AABB = Box2D.Collision.b2AABB;
      var b2BodyDef = Box2D.Dynamics.b2BodyDef;
      var b2Body = Box2D.Dynamics.b2Body;
      var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
      var b2Fixture = Box2D.Dynamics.b2Fixture;
      var b2World = Box2D.Dynamics.b2World;
      var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
      var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

      var bodyDef = new b2BodyDef();
      bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
      var posicion = this.camara.convertir_de_posicion_relativa_a_fisica(0, -50);
      posicion.x = convertir_a_metros(posicion.x);
      posicion.y = convertir_a_metros(posicion.y);

      bodyDef.position.Set(posicion.x, posicion.y);
      //bodyDef.userData=data;
      var polygonShape = new b2PolygonShape;
      polygonShape.SetAsBox(convertir_a_metros(50), convertir_a_metros(1));
      var fixtureDef = new b2FixtureDef;
      fixtureDef.density = 1.0;
      fixtureDef.friction = 0.5;
      fixtureDef.restitution = 1;
      fixtureDef.shape = polygonShape;
      var body = this.mundo.CreateBody(bodyDef);
      body.CreateFixture(fixtureDef);
    }

    actualizar() {
      this.mundo.Step(this.timeStep, 6, 3);
      //this.mundo.DrawDebugData();
      this.mundo.ClearForces();
    }

    crear_circulo(x, y, radio, opciones) {
      return new this.Circulo(this, x, y, radio, opciones);
    }

    crear_rectangulo(x, y, ancho, alto, opciones) {
      return new this.Rectangulo(this, x, y, ancho, alto, opciones);
    }

    dibujar_figuras_sobre_lienzo(graphics) {
      var cuerpo = this.mundo.GetBodyList();

      while (cuerpo !== null) {
        //cuerpo.GetType() == 2 -> (es dinámico)
        var fixture = cuerpo.GetFixtureList();

        if (fixture) {
          var shape = fixture.GetShape();
          var posicion = cuerpo.GetPosition();

          if (shape.GetRadius !== undefined) {
            var radio = shape.GetRadius();
            graphics.beginStroke("#FFF").drawCircle(posicion.x, posicion.y, convertir_a_pixels(radio)).endStroke();
          } 

          if (shape.b2PolygonShape !== undefined) {
            var vertices = shape.GetVertices();
            var v2 = {};

            v2[0] = this.convertir_a_vertice_pantalla(vertices[0].x, vertices[0].y);
            v2[1] = this.convertir_a_vertice_pantalla(vertices[1].x, vertices[1].y);
            v2[2] = this.convertir_a_vertice_pantalla(vertices[2].x, vertices[2].y);
            v2[3] = this.convertir_a_vertice_pantalla(vertices[3].x, vertices[3].y);


            graphics.beginStroke("white").
              moveTo(v2[0].x, v2[0].y).
              lineTo(v2[1].x, v2[1].y).
              lineTo(v2[2].x, v2[2].y).
              lineTo(v2[3].x, v2[3].y).
              lineTo(v2[0].x, v2[0].y).
            endStroke();
          } 
          // else {
          //  console.log("No es circulo!");
          // }
        }

        cuerpo = cuerpo.m_next;
      }

      //for (var i=0; i<escena.actores.length; i++) {
      //    var actor = escena.actores[i];
      //  var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

      //  graphics.beginStroke("#FFF").drawCircle(posicion.x, posicion.y, actor.radio_de_colision).endStroke();
      // }
    }

    convertir_a_vertice_pantalla(x, y) {
      return {x: 160 + (x * 30), y: 120 - (y  * 30)}
    var v = {
        x: convertir_a_pixels(x),
        y: convertir_a_pixels(y)
      }
      return {x: v.x + 160, y: 120 - v.y};
    }
  }
*/

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

class Fisica {
  mundo;

  Circulo;
  Rectangulo;
  camara;

  constructor(camara) {
    this.camara = camara;
    this.mundo = new box2d.b2World(new box2d.b2Vec2(0, 10), true);

    // Bordes del escenario
    this.createBox(640/2, 30/2 , 320/2, 480/2, box2d.b2Body.b2_staticBody, null);
    this.createBox(640/2, 30/2 , 320/2, 0,     box2d.b2Body.b2_staticBody, null);
    this.createBox(30/2 , 480/2, 0,     240/2, box2d.b2Body.b2_staticBody, null);
    this.createBox(30/2 , 480/2, 640/2, 240/2, box2d.b2Body.b2_staticBody, null);


    // 
    this.createBox(64, 64, 40, 40, box2d.b2Body.b2_dynamicBody, {});
    this.createBox(64, 64, 20, 10, box2d.b2Body.b2_dynamicBody, {});
  }

  actualizar() {
    this.mundo.Step(1/60, 10, 10);

    this.mundo.ClearForces();
  }

  dibujar_figuras_sobre_lienzo(graphics) {

	  for(var b = this.mundo.m_bodyList; b != null; b = b.m_next){

      var fixture = b.GetFixtureList();

      if (fixture) {
        var x = b.GetPosition().x * PPM; 
        var y = b.GetPosition().y * PPM;
        var shape = fixture.GetShape();

        // dibuja un circulo en el centro de la figura.
        graphics.beginStroke("#FFF").
            drawCircle(
              x,
              y,
              5
            ).
        endStroke();

        if (shape.b2PolygonShape !== undefined) {
          var vertices = shape.GetVertices();
          var v2 = {};

          window['b'] = b;
          window['a'] = vertices[0];

          v2[0] = b.GetWorldVector(vertices[0]);

          v2[0] = {
            x: v2[0].x * PPM + x,
            y: v2[0].y * PPM + y,
          }

          v2[1] = b.GetWorldVector(vertices[1]);

          v2[1] = {
            x: v2[1].x * PPM + x,
            y: v2[1].y * PPM + y,
          }

          v2[2] = b.GetWorldVector(vertices[2]);

          v2[2] = {
            x: v2[2].x * PPM + x,
            y: v2[2].y * PPM + y,
          }

          v2[3] = b.GetWorldVector(vertices[3]);

          v2[3] = {
            x: v2[3].x * PPM + x,
            y: v2[3].y * PPM + y,
          }


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

  createBox(width, height, pX, pY, type, data) {
		var bodyDef = new box2d.b2BodyDef;
		bodyDef.type = type;
		bodyDef.position.Set(pX/PPM, pY/PPM);
		bodyDef.userData=data;

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

}
