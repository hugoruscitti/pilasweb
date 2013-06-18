/// <reference path="actores/aceituna.ts />
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
    }
    return Actores;
})();
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
var Actor = (function () {
    function Actor(imagen, x, y) {
        this.imagen = imagen || 'sin_imagen.png';
        this.crear_sprite();
        this.x = x || 0;
        this.y = y || 0;
        this.centro_x = this.ancho / 2;
        this.centro_y = this.alto / 2;
        pilas.escena_actual().agregar_actor(this);
    }
    Actor.prototype.crear_sprite = function () {
        this.sprite = new createjs.Bitmap(this._imagen.imagen);
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
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var Normal = (function () {
    function Normal() {
        this.actores = [];
        this.stage = new createjs.Stage(pilas.canvas);
        this.camara = new Camara();
    }
    Normal.prototype.actualizar = function () {
        for(var i = 0; i < this.actores.length; i++) {
            this.actores[i].actualizar();
        }
        this.stage.update();
    };
    Normal.prototype.agregar_actor = function (actor) {
        this.actores.push(actor);
        this.stage.addChild(actor.sprite);
        this.stage.update();
    };
    Normal.prototype.obtener_posicion_pantalla = function (x, y) {
        return this.camara.obtener_posicion_pantalla(x, y);
    };
    Normal.prototype.obtener_posicion_escenario = function (x, y) {
        return this.camara.obtener_posicion_escenario(x, y);
    };
    return Normal;
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
        return new Grilla(this.recursos[nombre], columnas, filas);
    };
    return Imagenes;
})();
var Imagen = (function () {
    function Imagen(imagen) {
        this.imagen = imagen;
    }
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
        _super.call(this, imagen);
        this.columnas = columnas;
        this.filas = filas;
    }
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
        this.obtener_canvas();
        this.definir_tamano_del_canvas();
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
            throw new Error("No se encuentra el elemento canvas (id=canvas)");
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
        this.onready();
        var self = this;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addListener(function () {
            self.actualizar();
        });
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
    return Pilas;
})();
pilas = new Pilas();
