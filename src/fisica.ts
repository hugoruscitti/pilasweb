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

    this.mundo = new Box2D.Dynamics.b2World(new b2Vec2(0, 10), true);
    this.PPM = 30;
  }

  habilitar_depurado() {
    var debugDraw = new b2DebugDraw;
    debugDraw.SetSprite(pilas.canvas.getContext('2d'));
    debugDraw.SetDrawScale(30);
    debugDraw.SetFillAlpha(0.1);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.mundo.SetDebugDraw(debugDraw);
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
}
