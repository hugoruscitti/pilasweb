declare var Box2D;

declare var b2Vec2;
declare var b2BodyDef;
declare var b2Body;
declare var b2FixtureDef;
declare var b2Fixture;
declare var b2World;
declare var b2MassData;
declare var b2PolygonShape;
declare var b2CircleShape;
declare var b2DebugDraw;

b2Vec2 = Box2D.Common.Math.b2Vec2;
b2BodyDef = Box2D.Dynamics.b2BodyDef;
b2Body = Box2D.Dynamics.b2Body;
b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
b2Fixture = Box2D.Dynamics.b2Fixture;
b2World = Box2D.Dynamics.b2World;
b2MassData = Box2D.Collision.Shapes.b2MassData;
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

/// <reference path="figuras.ts"/>

class Fisica {
  mundo;
  body;
  PPM;

  Circulo;

  constructor() {
    this.Circulo = Circulo;

    this.mundo = new Box2D.Dynamics.b2World(new b2Vec2(0, -10), true);
    this.PPM = 30;
  }

  actualizar() {
    this.mundo.Step(1 / 120.0, 6, 3);
    this.mundo.DrawDebugData();
    this.mundo.ClearForces();
  }

  convertir_a_metros(valor) {
    return valor / this.PPM;
  }

  convertir_a_pixels(valor) {
    return valor * this.PPM;
  }

  dibujar_figuras_sobre_el_lienzo(graphics) {
    for (var b=this.mundo.GetBodyList(); b; b=b.GetNext()) {
      var fixtures = b.GetFixtureList();

      if (fixtures) {
        var shape = fixtures.GetShape();
        var shape_type = shape.GetType();

        graphics.setStrokeStyle(1);
        graphics.beginStroke("white");

        if (shape_type == 0) {
          graphics.drawCircle(
            this.convertir_a_pixels(b.GetPosition().x),
            120 -this.convertir_a_pixels(b.GetPosition().y),
            this.convertir_a_pixels(shape.GetRadius()));
        }
      }
    }
  }
}
