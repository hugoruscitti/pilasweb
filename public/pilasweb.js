/// <reference path="actores/aceituna.ts />
/// <reference path="actores/bomba.ts />
/// <reference path="actores/explosion.ts />
/**
* @class Actores
*
* Módulo Actores
* ==============
*
* Representa todos los actores conocidos en pilas-engine.
*/
var Actores = (function () {
    function Actores() {
        this.Aceituna = Aceituna;
        this.Actor = Actor;
        this.Bomba = Bomba;
        this.Explosion = Explosion;
        this.Pelota = Pelota;
    }
    return Actores;
})();
var Estudiante = (function () {
    function Estudiante() { }
    Estudiante.prototype.aprender = function (clase_de_habilidad) {
        // FIXME, hacer una lista de habilidades, chequear si la clase de
        // habilidad ya se ha agregado y eliminarla.
        this.agregar_habilidad(clase_de_habilidad);
    };
    Estudiante.prototype.agregar_habilidad = function (clase_de_habilidad) {
        var habilidad = new clase_de_habilidad(this);
    };
    return Estudiante;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="estudiante.ts"/>
/**
* @class Actor
*
* Representa un objeto visible en pantalla, algo que se ve y tiene posicion.
*
* {@img actores/actor.png}
*
* Un objeto Actor se tiene que crear siempre indicando una imagen. Si no
* se especifica una imagen, se verá una pila de color gris cómo la que
* está mas arriba.
*
* Una forma de crear el actor con una imagen es:
*
*     @example
*     var protagonista = Actor("protagonista_de_frente.png");
*
* incluso, es equivalente hacer lo siguiente:
*
*     @example
*     var imagen = pilas.imagenes.cargar("protagonista_de_frente.png");
*     var protagonista = Actor(imagen);
*
* Luego, una vez que ha sido ejecutada la sentencia aparecerá
* el nuevo actor para que puedas manipularlo. Por ejemplo
* alterando sus propiedades:
*
*     @example
*     protagonista.x = 100;
*     protagonista.escala = 2;
*     protagonista.rotacion = 30;
*
* Estas propiedades también se pueden manipular mediante
* interpolaciones. Por ejemplo, para aumentar el tamaño del
* personaje de 1 a 5 en 7 segundos:
*
*     @example
*     protagonista.escala = 1;
*     protagonista.escala = [5];
*
* Si quieres que el actor sea invisible, un truco es crearlo
* con la imagen ``invisible.png``:
*
*     @example
*     invisible = pilas.actores.Actor('invisible.png');
*
*/
var Actor = (function (_super) {
    __extends(Actor, _super);
    function Actor(imagen, x, y) {
        _super.call(this);
        this.imagen = imagen || 'sin_imagen.png';
        this.crear_sprite();
        this.x = x || 0;
        this.y = y || 0;
        this.centro_x = this.ancho / 2;
        this.centro_y = this.alto / 2;
        pilas.escena_actual().agregar_actor(this);
    }
    Actor.prototype.crear_sprite = function () {
        this.sprite = this._imagen.instanciar();
    };
    Actor.prototype.eliminar = function () {
        pilas.escena_actual().eliminar_actor(this);
    };
    Object.defineProperty(Actor.prototype, "x", {
        get: function () {
            var pos = pilas.escena_actual().obtener_posicion_escenario(this.sprite.x, 0);
            return pos.x;
        },
        set: function (_x) {
            if(_x instanceof Array) {
                pilas.interpolar(this, 'x', _x, 1000);
            } else {
                var pos = pilas.escena_actual().obtener_posicion_pantalla(_x, 0);
                this.sprite.x = pos.x;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "y", {
        get: function () {
            var pos = pilas.escena_actual().obtener_posicion_escenario(0, this.sprite.y);
            return pos.y;
        },
        set: function (_y) {
            if(_y instanceof Array) {
                pilas.interpolar(this, 'y', _y, 1000);
            } else {
                var pos = pilas.escena_actual().obtener_posicion_pantalla(0, _y);
                this.sprite.y = pos.y;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "centro_x", {
        get: function () {
            return this.sprite.regX;
        },
        set: function (_x) {
            this.sprite.regX = _x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "centro_y", {
        get: function () {
            return this.sprite.regY;
        },
        set: function (_y) {
            this.sprite.regY = _y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "escala_x", {
        get: function () {
            return this.sprite.scaleX;
        },
        set: function (valor) {
            if(valor instanceof Array) {
                pilas.interpolar(this.sprite, 'scaleX', valor, 1000);
            } else {
                this.sprite.scaleX = valor;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "escala_y", {
        get: function () {
            return this.sprite.scaleY;
        },
        set: function (valor) {
            if(valor instanceof Array) {
                pilas.interpolar(this.sprite, 'scaleY', valor, 1000);
            } else {
                this.sprite.scaleY = valor;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "escala", {
        get: function () {
            return this.escala_x;
        },
        set: function (valor) {
            this.escala_x = valor;
            this.escala_y = valor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "rotacion", {
        get: function () {
            return this.sprite.rotation;
        },
        set: function (valor) {
            if(valor instanceof Array) {
                pilas.interpolar(this.sprite, 'rotation', valor, 1000);
            } else {
                this.sprite.rotation = valor;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "transparencia", {
        get: function () {
            return (-100 * this.sprite.alpha) + 100;
        },
        set: function (_t) {
            this.sprite.alpha = (_t - 100) / -100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "ancho", {
        get: function () {
            return this._imagen.ancho;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "alto", {
        get: function () {
            return this._imagen.alto;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "imagen", {
        set: function (_i) {
            if(_i.substring) {
                this._imagen = pilas.imagenes.cargar(_i);
            } else {
                this._imagen = _i;
            }
        },
        enumerable: true,
        configurable: true
    });
    Actor.prototype.actualizar = function () {
    };
    return Actor;
})(Estudiante);
/// <reference path="actor.ts"/>
var Aceituna = (function (_super) {
    __extends(Aceituna, _super);
    function Aceituna(x, y) {
        var imagen = "aceituna.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 18;
        this.centro_y = 18;
    }
    return Aceituna;
})(Actor);
/// <reference path="actor.ts"/>
var Bomba = (function (_super) {
    __extends(Bomba, _super);
    function Bomba(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("bomba.png", 2);
        _super.call(this, imagen, x, y);
        this.centro_x = 36;
        this.centro_y = 31;
        this.paso = 0;
        this.aprender(pilas.habilidades.PuedeExplotar);
    }
    Bomba.prototype.actualizar = function () {
        this.paso += 0.1;
        this._imagen.definir_cuadro(parseInt(this.paso) % 2);
    };
    return Bomba;
})(Actor);
/// <reference path="actor.ts"/>
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("explosion.png", 7);
        _super.call(this, imagen, x, y);
        this.centro_x = 16;
        this.centro_y = 16;
        this.paso = 0;
    }
    Explosion.prototype.actualizar = function () {
        this.paso += 0.1;
        if(this.paso > 1) {
            if(!this._imagen.avanzar()) {
                this.eliminar();
            }
            this.paso = 0;
        }
    };
    return Explosion;
})(Actor);
/// <reference path="actor.ts"/>
var Pelota = (function (_super) {
    __extends(Pelota, _super);
    function Pelota(x, y) {
        var imagen = "pelota.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 18;
        this.centro_y = 18;
    }
    return Pelota;
})(Actor);
/**
* @class Camara
*
* Representa la cámara que visualiza el escenario y permite hacer movimientos
* de pantalla.
*
* Esta clase también se encarga de transformar el sistema de referencia
* entre coordenadas de pantalla y coordenadas de escenario.
*/
var Camara = (function () {
    function Camara() {
        this.x = 0;
        this.y = 0;
    }
    Camara.prototype.obtener_posicion_pantalla = /**
    * @method obtener_posicion_pantalla
    *
    * Convierte una posición del escenario de pilas al formato
    * de coordenadas del navegador.
    *
    * Por ejemplo, el punto (0, 0) es el centro del escenario para
    * pilas, pero el navegador lo interpreta como el punto (160, 120).
    */
    function (x, y) {
        return {
            x: x + 160,
            y: 120 - y
        };
    };
    Camara.prototype.obtener_posicion_escenario = /**
    * @method obtener_posicion_escenario
    *
    * Convierte una posición dada en un sistema de coordenadas
    * tradicional, en una posición de escenario, donde el punto (0, 0)
    * es el centro de la pantalla.
    */
    function (x, y) {
        return {
            x: x - 160,
            y: 120 - y
        };
    };
    return Camara;
})();
var DepuradorDeshabilitado = (function () {
    function DepuradorDeshabilitado() {
        this.modos = [];
    }
    DepuradorDeshabilitado.prototype.actualizar = function () {
        for(var i = 0; i < this.modos.length; i++) {
            this.modos[i].actualizar();
        }
    };
    DepuradorDeshabilitado.prototype.definir_modos = function (modos) {
        modos = modos || {
        };
        modos.puntos_de_control = modos.puntos_de_control || false;
        if(modos.puntos_de_control) {
            this.modos.push(new ModoPuntosDeControl());
        }
    };
    return DepuradorDeshabilitado;
})();
var ModoPuntosDeControl = (function () {
    function ModoPuntosDeControl() {
        this.container = new createjs.Container();
        this.shape = new createjs.Shape();
        this.container.addChild(this.shape);
        this.text_modo = new createjs.Text("F12 ModoPosicion habilitado", "12px Arial", "white");
        this.container.addChild(this.text_modo);
        this.text_coordenada = new createjs.Text("Posición del mouse: x=12 y=33", "12px Arial", "white");
        this.text_coordenada.y = 220;
        this.text_coordenada.x = 120;
        this.container.addChild(this.text_coordenada);
        pilas.escena_actual().stage.addChild(this.container);
    }
    ModoPuntosDeControl.prototype.actualizar = function () {
        var escena = pilas.escena_actual();
        this.shape.graphics.clear();
        for(var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
            var size = 3;
            // Dibuja una cruz
            this.shape.graphics.beginStroke("#ffffff").moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
            this.shape.graphics.beginStroke("#ffffff").moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();
        }
        var pos = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
        this.text_coordenada.text = "Posición del mouse: x=" + pos.x + " y=" + pos.y;
    };
    return ModoPuntosDeControl;
})();
/// <reference path="camara.ts />
/// <reference path="evento.ts />
/// <reference path="fisica.ts />
var Base = (function () {
    function Base() {
        this.mueve_mouse = new Evento('mueve_mouse')// ['x', 'y', 'dx', 'dy']
        ;
    }
    return Base;
})();
/**
* @class Normal
*
* Escena básica de pilas.
*
* Si no se define ninguna escena, cuando se ejecuta:
*
*     @example
*     pilas.iniciar();
*
* esta es la escena que se muestra en la pantalla.
*
*/
var Normal = (function (_super) {
    __extends(Normal, _super);
    function Normal() {
        _super.call(this);
        this.actores = [];
        this.stage = new createjs.Stage(pilas.canvas);
        this.camara = new Camara();
        this.fisica = new Fisica();
    }
    Normal.prototype.actualizar = function () {
        for(var i = 0; i < this.actores.length; i++) {
            this.actores[i].actualizar();
        }
        this.stage.update();
        this.fisica.actualizar();
    };
    Normal.prototype.agregar_actor = function (actor) {
        this.actores.push(actor);
        this.stage.addChild(actor.sprite);
        this.stage.update();
    };
    Normal.prototype.eliminar_actor = function (actor) {
        var index = this.actores.indexOf(actor);
        this.actores.splice(index, 1);
        this.stage.removeChild(actor.sprite);
        this.stage.update();
    };
    Normal.prototype.obtener_posicion_pantalla = function (x, y) {
        return this.camara.obtener_posicion_pantalla(x, y);
    };
    Normal.prototype.obtener_posicion_escenario = function (x, y) {
        return this.camara.obtener_posicion_escenario(x, y);
    };
    return Normal;
})(Base);
var Evento = (function () {
    function Evento(nombre) {
        this.respuestas = {
        };
        this.nombre = nombre;
    }
    Evento.prototype.emitir = function (evento) {
        for(var respuesta in this.respuestas) {
            this.respuestas[respuesta](evento);
        }
    };
    Evento.prototype.conectar = function (respuesta) {
        this.respuestas[respuesta.toString()] = respuesta;
    };
    Evento.prototype.desconectar = function (respuesta) {
        delete this.respuestas[respuesta.toString()];
    };
    return Evento;
})();
var Figura = (function () {
    function Figura(cuerpo) {
        this._cuerpo = cuerpo;
    }
    Figura.prototype.obtener_x = function () {
        var box2d_position = this._cuerpo.GetBody().GetPosition();
        return pilas.fisica.convertir_a_pixels(box2d_position.x);
    };
    Figura.prototype.obtener_y = function () {
        var box2d_position = this._cuerpo.GetBody().GetPosition();
        return pilas.fisica.convertir_a_pixels(box2d_position.y);
    };
    return Figura;
})();
var Circulo = (function (_super) {
    __extends(Circulo, _super);
    function Circulo(x, y, radio) {
        console.log(this);
        console.log(x, y, radio);
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        var fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2CircleShape(pilas.fisica.convertir_a_metros(radio));
        bodyDef.position.x = pilas.fisica.convertir_a_metros(120);
        bodyDef.position.y = pilas.fisica.convertir_a_metros(100);
        _super.call(this, pilas.fisica.mundo.CreateBody(bodyDef).CreateFixture(fixDef));
    }
    return Circulo;
})(Figura);
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
var Fisica = (function () {
    function Fisica() {
        this.Circulo = Circulo;
        this.mundo = new Box2D.Dynamics.b2World(new b2Vec2(0, 10), true);
        this.PPM = 30;
    }
    Fisica.prototype.habilitar_depurado = function () {
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(pilas.canvas.getContext('2d'));
        debugDraw.SetDrawScale(30);
        debugDraw.SetFillAlpha(0.1);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.mundo.SetDebugDraw(debugDraw);
    };
    Fisica.prototype.actualizar = function () {
        this.mundo.Step(1 / 120.0, 6, 3);
        this.mundo.DrawDebugData();
        this.mundo.ClearForces();
    };
    Fisica.prototype.convertir_a_metros = function (valor) {
        return valor / this.PPM;
    };
    Fisica.prototype.convertir_a_pixels = function (valor) {
        return valor * this.PPM;
    };
    return Fisica;
})();
/// <reference path="actores/actor.ts"/>
var Plano = (function (_super) {
    __extends(Plano, _super);
    function Plano() {
        _super.call(this, 'plano.png', 0, 0);
        this.centro_x = 0;
        this.centro_y = 0;
    }
    Plano.prototype.crear_sprite = function () {
        var img = this._imagen.imagen;
        var s = new createjs.Shape();
        s.graphics.beginBitmapFill(img, 'repeat');
        s.graphics.drawRect(-160, -120, 320, 240)// TODO: detectar el area visible de pantalla.
        ;
        this.sprite = s;
    };
    Plano.prototype.actualizar = function () {
    };
    return Plano;
})(Actor);
var Fondos = (function () {
    function Fondos() {
        this.Plano = Plano;
    }
    return Fondos;
})();
var GestorDeEscenas = (function () {
    function GestorDeEscenas() {
        //this.escenas = [];
        this.escena = null;
    }
    GestorDeEscenas.prototype.cambiar_escena = function (nueva_escena) {
        this.escena = nueva_escena;
    };
    GestorDeEscenas.prototype.actualizar = function () {
        var escena = this.escena_actual();
        escena.actualizar();
    };
    GestorDeEscenas.prototype.escena_actual = function () {
        return this.escena;
    };
    return GestorDeEscenas;
})();
/**
* @class Habilidad
*
* Representa una habilidad que un actor puede aprender.
*/
var Habilidad = (function () {
    function Habilidad(receptor) {
        this.receptor = receptor;
    }
    Habilidad.prototype.actualizar = function () {
    };
    Habilidad.prototype.eliminar = function () {
    };
    return Habilidad;
})();
/**
* @class PuedeExplotar
*
* Hace que un actor se pueda hacer explotar invocando al metodo eliminar.
*/
var PuedeExplotar = (function (_super) {
    __extends(PuedeExplotar, _super);
    function PuedeExplotar(receptor) {
        var _this = this;
        _super.call(this, receptor);
        receptor.eliminar = function () {
            var explosion = new pilas.actores.Explosion();
            explosion.x = _this.receptor.x;
            explosion.y = _this.receptor.y;
            explosion.escala = _this.receptor.escala;
            pilas.actores.Actor.prototype.eliminar.call(_this.receptor);
        };
    }
    return PuedeExplotar;
})(Habilidad);
/**
* @class RebotarComoPelota
*
* Le indica al actor que rebote y colisiones como una pelota.
*
*     @example
*     var un_actor = pilas.actores.Aceituna()
*     un_actor.aprender(new pilas.habilidades.RebotarComoPelota)
*/
var RebotarComoPelota = (function (_super) {
    __extends(RebotarComoPelota, _super);
    function RebotarComoPelota(receptor) {
        _super.call(this, receptor);
    }
    return RebotarComoPelota;
})(Habilidad);
/**
* @class Habilidades
*
* Representa todas las habilidades conocidas en pilas-engine.
*/
var Habilidades = (function () {
    function Habilidades() {
        this.PuedeExplotar = PuedeExplotar;
        this.RebotarComoPelota = RebotarComoPelota;
    }
    return Habilidades;
})();
var Imagenes = (function () {
    function Imagenes(callback_onready, data_path) {
        this.recursos = {
        };
        this.data_path = data_path;
        this.loader = new PxLoader();
        this.imagenes_solicitadas = 0;
        this.cargar_recursos();
        //loader.addProgressListener(function (e) {
        //    this.actualizar_progreso(e);
        //            return true
        // });
        this.loader.addCompletionListener(function (e) {
            pilas.onready();
            pilas.ejecutar();
        });
        this.loader.start();
    }
    Imagenes.prototype.cargar_recursos = function () {
        this.cargar_recurso('aceituna.png');
        this.cargar_recurso('aceituna_grita.png');
        this.cargar_recurso('aceituna_risa.png');
        this.cargar_recurso('aceituna_burla.png');
        this.cargar_recurso('banana.png');
        this.cargar_recurso('bomba.png');
        this.cargar_recurso('caja.png');
        this.cargar_recurso('explosion.png');
        this.cargar_recurso('pelota.png');
        this.cargar_recurso('sin_imagen.png');
        this.cargar_recurso('plano.png');
        this.cargar_recurso('cooperativista/alerta.png');
        this.cargar_recurso('cooperativista/camina.png');
        this.cargar_recurso('cooperativista/camina_sujeta.png');
        this.cargar_recurso('cooperativista/ok.png');
        this.cargar_recurso('cooperativista/parado.png');
        this.cargar_recurso('cooperativista/parado_sujeta.png');
        this.cargar_recurso('cooperativista/trabajando.png');
    };
    Imagenes.prototype.cargar_recurso = function (nombre) {
        var path = this.data_path + '/' + nombre;
        this.recursos[nombre] = this.loader.addImage(path);
        this.imagenes_solicitadas += 1;
    };
    Imagenes.prototype.cargar = function (nombre) {
        if(nombre in this.recursos) {
            return new Imagen(this.recursos[nombre]);
        } else {
            throw "No se puede encontrar la imagen: " + nombre;
        }
    };
    Imagenes.prototype.cargar_grilla = function (nombre, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        return new Grilla(this.recursos[nombre], columnas, filas);
    };
    return Imagenes;
})();
var Imagen = (function () {
    function Imagen(imagen) {
        this.ruta = imagen;
        this.imagen = imagen;
    }
    Imagen.prototype.instanciar = function () {
        return new createjs.Bitmap(this.imagen);
    };
    Object.defineProperty(Imagen.prototype, "ancho", {
        get: function () {
            return this.imagen.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Imagen.prototype, "alto", {
        get: function () {
            return this.imagen.height;
        },
        enumerable: true,
        configurable: true
    });
    return Imagen;
})();
var Grilla = (function (_super) {
    __extends(Grilla, _super);
    function Grilla(imagen, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        _super.call(this, imagen);
        this.columnas = columnas;
        this.filas = filas;
        this.cuadro = 0;
    }
    Grilla.prototype.instanciar = function () {
        var data = {
            images: [
                this.ruta.src
            ],
            frames: {
                width: this.ancho / this.columnas,
                height: this.alto / this.filas
            }
        };
        var spritesheet = new createjs.SpriteSheet(data);
        this.sprite = new createjs.BitmapAnimation(spritesheet);
        this.definir_cuadro(0);
        return this.sprite;
    };
    Object.defineProperty(Grilla.prototype, "cantidad_cuadros", {
        get: function () {
            return this.filas * this.columnas;
        },
        enumerable: true,
        configurable: true
    });
    Grilla.prototype.definir_cuadro = function (numero_de_cuadro) {
        this.cuadro = numero_de_cuadro;
        this.sprite.gotoAndStop(numero_de_cuadro);
    };
    Grilla.prototype.avanzar = function () {
        var ha_avanzado = true;
        this.cuadro += 1;
        if(this.cuadro >= this.cantidad_cuadros) {
            this.cuadro = 0;
            ha_avanzado = false;
        }
        this.definir_cuadro(this.cuadro);
        return ha_avanzado;
    };
    return Grilla;
})(Imagen);
var Interpolaciones = (function () {
    function Interpolaciones() { }
    Interpolaciones.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo) {
        var tiempo = tiempo || 1000;
        var step = tiempo / valor_o_valores.length;
        var tween = createjs.Tween.get(objeto);
        for(var i = 0; i < valor_o_valores.length; i++) {
            var attr = atributo.toString();
            var diccionario = {
            };
            diccionario[attr] = valor_o_valores[i];
            tween = tween.to(diccionario, step);
        }
    };
    return Interpolaciones;
})();
/// <reference path="gestor_escenas.ts />
/// <reference path="depurador.ts />
var Mundo = (function () {
    function Mundo() {
        this.gestor_escenas = new GestorDeEscenas();
        this.depurador = new DepuradorDeshabilitado();
    }
    Mundo.prototype.actualizar = function () {
        this.gestor_escenas.actualizar();
        this.depurador.actualizar();
    };
    Mundo.prototype.definir_modos = function (modos) {
        this.depurador.definir_modos(modos);
    };
    return Mundo;
})();
/// <reference path="actores.ts />
/// <reference path="utils.ts />
/// <reference path="fondos.ts />
/// <reference path="imagenes.ts />
/// <reference path="mundo.ts />
/// <reference path="escenas.ts />
/// <reference path="interpolaciones.ts />
/// <reference path="habilidades.ts />
/**
* @class Pilas
* @singleton
*
* Módulo pilas
* ============
*
* Pilas es una biblioteca para facilitar el desarrollo de videojuegos. Es útil para
* programadores principiantes o para el desarrollo de juegos casuales.
*
* Este módulo contiene las funciones principales para iniciar y ejecutar la biblioteca.
* {@img pilas-logo.png}
*
*     @example
*     pilas.iniciar({ancho: 320, alto: 240});
*     aceituna = new pilas.actores.Aceituna();
*/
var Pilas = (function () {
    function Pilas() { }
    Pilas.prototype.iniciar = // acceso al modulo.
    /**
    * @method iniciar
    *
    * Inicia la ventana principal del juego con algunos detalles de funcionamiento.
    *
    * Ejemplo de invocación:
    *
    *     @example
    *     pilas.iniciar({ancho: 320, alto: 240, data_path: 'data/'});
    *
    * Parámetros:
    *
    * - data_path: La ruta hacia la carpeta donde están las imágenes de los actores. (Por defecto 'data/')
    *
    */
    function (opciones) {
        this.inicializar_opciones(opciones);
        this.actores = new Actores();
        this.habilidades = new Habilidades();
        this.obtener_canvas();
        this.definir_tamano_del_canvas();
        this.conectar_eventos();
        this.imagenes = new Imagenes(this.onready, this.opciones.data_path);
        this.fondos = new Fondos();
        this.mundo = new Mundo();
        this.interpolaciones = new Interpolaciones();
        this.mundo.gestor_escenas.cambiar_escena(new Normal());
    };
    Pilas.prototype.escena_actual = /**
    * @method escena_actual
    * Retorna la escena en curso.
    */
    function () {
        return this.mundo.gestor_escenas.escena_actual();
    };
    Pilas.prototype.inicializar_opciones = /**
    * @method inicializar_opciones
    * @private
    *
    * Carga las opciones iniciales y define los valores por omisión si es necesario.
    */
    function (opciones) {
        this.opciones = opciones || {
        };
        this.opciones.ancho = opciones.ancho || 320;
        this.opciones.alto = opciones.alto || 240;
        this.opciones.data_path = opciones.data_path || 'data';
        this.opciones.canvas_id = opciones.canvas_id || 'canvas';
    };
    Pilas.prototype.definir_tamano_del_canvas = /**
    * @method definir_tamano_del_canvas
    * @private
    *
    * Cambia el tamaño del canvas HTML en base a las opciones iniciales.
    */
    function () {
        this.canvas.width = this.opciones.ancho;
        this.canvas.height = this.opciones.alto;
    };
    Pilas.prototype.conectar_eventos = /**
    * @method conectar_eventos
    * @private
    *
    * Conecta los eventos del mouse y teclado a los métodos manejadores
    * de eventos de la escena actual.
    */
    function () {
        this.canvas.onmousemove = function (event) {
            var camara = pilas.escena_actual().camara;
            var posicion = camara.obtener_posicion_escenario(event.layerX, event.layerY);
            pilas.escena_actual().mueve_mouse.emitir(posicion);
        };
    };
    Pilas.prototype.obtener_canvas = /**
    * @method obtener_canvas
    * @private
    *
    * Obtiene la referencia al elemento HTML canvas usando
    * el atributo *canvas_id* de las opciones iniciales.
    */
    function () {
        this.canvas = document.getElementById(this.opciones.canvas_id);
        if(!this.canvas) {
            throw new Error("No se encuentra el elemento canvas (id='" + this.opciones.canvas_id + "')");
        }
    };
    Pilas.prototype.onready = /**
    * @method onready
    * Callback que se invoca una vez que pilas puede comenzar a funcionar.
    */
    function () {
        throw "pilas-engine ha iniciado, pero el metodo onload está vacío. Tienes que sobre-escribirlo...";
    };
    Pilas.prototype.ejecutar = /**
    * @method ejecutar
    * Pone en funcionamiento el bucle principal.
    */
    function () {
        var self = this;
        // TODO: Limpiar los listeners con un mensaje y
        //       no accediendo directamente a la propiedad.
        createjs.Ticker.setFPS(60);
        var my_tick = function (event) {
            self.actualizar();
        };
        createjs.Ticker.addEventListener('tick', my_tick);
    };
    Pilas.prototype.actualizar = /**
    * @method actualizar
    * Se ejecuta automáticamente 60 veces por segundo, para mantener el juego en funcionamiento.
    */
    function () {
        this.mundo.actualizar();
    };
    Pilas.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolaciones.interpolar(objeto, atributo, valor_o_valores, tiempo);
    };
    Pilas.prototype.definir_modos = function (modos) {
        this.mundo.definir_modos(modos);
    };
    Object.defineProperty(Pilas.prototype, "fisica", {
        get: function () {
            return this.escena_actual().fisica;
        },
        enumerable: true,
        configurable: true
    });
    return Pilas;
})();
pilas = new Pilas();
