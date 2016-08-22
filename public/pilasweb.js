var Estudiante = (function () {
    function Estudiante() {
        this.habilidades = [];
        this.comportamientos = [];
    }
    Estudiante.prototype.aprender = function (clase_de_habilidad, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.agregar_habilidad(clase_de_habilidad, argumentos);
        return "Enseñando una habilidad ...";
    };

    Estudiante.prototype.agregar_habilidad = function (habilidad_o_clase, argumentos) {
        this.olvidar(habilidad_o_clase);
        this.habilidades.push(this.getHabilidad(habilidad_o_clase, argumentos));
    };

    Estudiante.prototype.olvidar = function (habilidad_o_clase) {
        for (var i = 0; i < this.habilidades.length; i++) {
            if (this.habilidades[i] == habilidad_o_clase || (this.isClass(habilidad_o_clase) && this.habilidades[i] instanceof habilidad_o_clase)) {
                this.habilidades.splice(i, 1);
                break;
            }
        }
    };

    Estudiante.prototype.getHabilidad = function (objetoOClase, argumentos) {
        if (!this.isClass(objetoOClase))
            return objetoOClase;
        if (!argumentos)
            return new objetoOClase(this);
        return new objetoOClase(this, argumentos);
    };

    Estudiante.prototype.isClass = function (objeto) {
        return this.getClassName(objeto) == "" || this.getClassName(objeto) == "Function";
    };

    Estudiante.prototype.actualizar_habilidades = function () {
        for (var i = 0; i < this.habilidades.length; i++) {
            this.habilidades[i].actualizar();
        }
    };

    Estudiante.prototype.hacer = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = {}; }
        var _comportamiento = new comportamiento(argumentos);
        this.comportamientos.splice(0, 0, _comportamiento);
        this._adoptar_el_siguiente_comportamiento();
    };

    Estudiante.prototype.hacer_luego = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = {}; }
        var _comportamiento = new comportamiento(argumentos);
        this.comportamientos.push(_comportamiento);
    };

    Estudiante.prototype.actualizar_comportamientos = function () {
        if (this.comportamiento_actual) {
            var termina = this.comportamiento_actual[0]["actualizar"]();

            if (termina) {
                this._adoptar_el_siguiente_comportamiento();
            }
        } else {
            this._adoptar_el_siguiente_comportamiento();
        }
    };

    Estudiante.prototype._adoptar_el_siguiente_comportamiento = function () {
        if (this.comportamientos[0]) {
            this.comportamiento_actual = this.comportamientos.splice(0, 1);

            //console.log(this.comportamiento_actual);
            this.comportamiento_actual[0]["iniciar"](this);
        } else {
            this.comportamiento_actual = undefined;
        }
    };

    Estudiante.prototype.getClassName = function (obj) {
        if (typeof obj === "undefined") { obj = this; }
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(obj["constructor"].toString());
        return (results && results.length > 1) ? results[1] : "";
    };
    return Estudiante;
})();
/// <reference path="estudiante.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    function Actor(imagen, x, y, atributos) {
        if (typeof atributos === "undefined") { atributos = {}; }
        _super.call(this);
        this.evto_se_movio = new Evento("se_movio");
        this.imagen = imagen || 'sin_imagen.png';
        atributos = atributos || {};
        this.vivo = true;
        this.radio_de_colision = Math.min(this.ancho, this.alto) / 2;
        this.id = pilas.utils.obtener_uuid();
        this.x = x || 0;
        this.y = y || 0;
        this.espejado = false;
        this.centro = ['centro', 'centro'];

        this.etiquetas = [];
        this.etiquetas.push(this.getClassName());

        if (atributos['rotacion'])
            this.rotacion = atributos['rotacion'];

        if (atributos['centro_x'])
            this.centro_x = atributos['centro_x'];

        if (atributos['centro_x'])
            this.centro_y = atributos['centro_y'];

        this.z = 0;
        pilas.escena_actual().agregar_actor(this);

        //eventos
        pilas.escena_actual().click_de_mouse.conectar(this);
        pilas.escena_actual().mueve_mouse.conectar(this);

        this.callbacks_cuando_hace_click = [];
        this.callbacks_cuando_mueve_mouse = [];

        this.iniciar();
    }
    Actor.prototype.iniciar = function () {
    };

    Actor.prototype.tiene_fisica = function () {
        return (this.figura !== undefined);
    };

    Actor.prototype._crear_sprite = function () {
        /* Si el actor ya tenía imagen, entonces se encarga de reemplazar
        la imagen actual, y vuelve a definir el punto de control en el
        centro. */
        if (this.sprite === undefined) {
            var x = 0;
            var y = 0;
            var rotacion = 0;
            var escala = 1;
        } else {
            var x = this.x;
            var y = this.y;
            var rotacion = this.rotacion;
            var escala = this.escala;
        }

        if (this.sprite === undefined) {
            this.sprite = this._imagen.instanciar();
        } else {
            pilas.escena_actual().eliminar_actor(this);
            this.sprite = this._imagen.instanciar();
            pilas.escena_actual().agregar_actor(this);
        }

        this.x = x;
        this.y = y;
        this.rotacion = rotacion;
        this.escala = escala;
        /*
        if (this.sprite !== undefined) {
        this.sprite.image = this._imagen.instanciar().image;
        
        if (! this.sprite.image) {
        this.sprite = this._imagen.instanciar();
        }
        
        } else {
        this.sprite = this._imagen.instanciar();
        }
        */
    };

    Actor.prototype.eliminar = function () {
        this.vivo = false;
        pilas.escena_actual().eliminar_actor(this);
        if (this.tiene_fisica()) {
            this.figura.eliminar();
        }
    };

    Object.defineProperty(Actor.prototype, "z", {
        get: function () {
            return this.sprite.z;
        },
        set: function (_z) {
            this.sprite.z = _z;
            this.evto_se_movio.emitir();
        },
        enumerable: true,
        configurable: true
    });

    Actor.prototype.getZ = function () {
        return this.z;
    };


    Actor.prototype.setZ = function (z) {
        this.z = z;
    };

    Object.defineProperty(Actor.prototype, "espejado", {
        get: function () {
            return this._espejado;
        },
        set: function (_espejado) {
            this._espejado = _espejado;

            if (_espejado)
                this.sprite.scaleX = -Math.abs(this.sprite.scaleX);
            else
                this.sprite.scaleX = Math.abs(this.sprite.scaleX);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "x", {
        get: function () {
            var pos = pilas.escena_actual().obtener_posicion_escenario(this.sprite.x, 0);
            return pos.x;
        },
        set: function (_x) {
            if (_x instanceof Array)
                pilas.interpolar(this, 'x', _x, 1);
            else {
                var pos = pilas.escena_actual().obtener_posicion_pantalla(_x, 0);
                this.sprite.x = pos.x;
                this.evto_se_movio.emitir({});
            }
        },
        enumerable: true,
        configurable: true
    });

    Actor.prototype.getX = function () {
        return this.x;
    };


    Actor.prototype.setX = function (x) {
        this.x = x;
    };

    Object.defineProperty(Actor.prototype, "y", {
        get: function () {
            var pos = pilas.escena_actual().obtener_posicion_escenario(0, this.sprite.y);
            return pos.y;
        },
        set: function (_y) {
            if (_y instanceof Array)
                pilas.interpolar(this, 'y', _y, 1);
            else {
                var pos = pilas.escena_actual().obtener_posicion_pantalla(0, _y);
                this.sprite.y = pos.y;
                this.evto_se_movio.emitir({});
            }
        },
        enumerable: true,
        configurable: true
    });

    Actor.prototype.getY = function () {
        return this.y;
    };


    Actor.prototype.setY = function (y) {
        this.y = y;
    };

    Object.defineProperty(Actor.prototype, "centro", {
        get: function () {
            return [this.centro_x, this.centro_y];
        },
        set: function (_valor) {
            if (typeof _valor === 'object' && _valor.length) {
                var x = _valor[0];
                var y = _valor[1];
                this.centro_x = x;
                this.centro_y = y;
            } else {
                throw Error("Solo se permite centrar usando un array de dos elementos.");
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
            if (_x === 'centro')
                _x = this.ancho / 2;

            if (_x === 'derecha')
                _x = this.ancho;

            if (_x === 'izquierda')
                _x = 0;

            if (typeof _x !== 'number')
                throw new Error("Solo se permite asignar números o las cadenas 'centro', 'izquierda' y 'derecha'");

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
            if (_y === 'centro')
                _y = this.alto / 2;

            if (_y === 'abajo')
                _y = this.alto;

            if (_y === 'arriba')
                _y = 0;

            if (typeof _y !== 'number')
                throw new Error("Solo se permite asignar números o las cadenas 'centro', 'abajo' y 'arriba'");

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
            if (valor instanceof Array)
                pilas.interpolar(this.sprite, 'scaleX', valor, 1);
            else
                this.sprite.scaleX = valor;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "escala_y", {
        get: function () {
            return this.sprite.scaleY;
        },
        set: function (valor) {
            if (valor instanceof Array)
                pilas.interpolar(this.sprite, 'scaleY', valor, 1);
            else
                this.sprite.scaleY = valor;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "escala", {
        get: function () {
            return this.escala_x;
        },
        set: function (valor) {
            if (valor instanceof Array) {
                var nuevo_radio_de_colision = [];
                for (var i = 0; i < valor.length; i++) {
                    nuevo_radio_de_colision.push((this.radio_de_colision * valor[i]) / this.escala);
                }
                pilas.interpolar(this, 'radio_de_colision', nuevo_radio_de_colision, 1);
                this.radio_de_colision = nuevo_radio_de_colision[0];
            } else {
                this.radio_de_colision = (this.radio_de_colision * valor) / this.escala;
            }

            this.escala_x = valor;
            this.escala_y = valor;
        },
        enumerable: true,
        configurable: true
    });

    Actor.prototype.escalarProporcionalALimites = function (anchoLimite, altoLimite) {
        this.escala = 1;
        var escalaAlto = altoLimite / this.alto;
        var escalaAncho = anchoLimite / this.ancho;
        this.escala = Math.min(escalaAncho, escalaAlto);
    };

    Actor.prototype.escalarAAncho = function (anchoDeseado) {
        this.escala = 1;
        this.escala = anchoDeseado / this.ancho;
    };
    Actor.prototype.escalarAAlto = function (altoDeseado) {
        this.escala = 1;
        this.escala = altoDeseado / this.alto;
    };

    Object.defineProperty(Actor.prototype, "rotacion", {
        get: function () {
            return -this.sprite.rotation;
        },
        set: function (valor) {
            if (valor instanceof Array) {
                for (var i in valor) {
                    valor[i] = -1 * (((valor[i] % 360) + 360) % 360);
                }
                pilas.interpolar(this.sprite, 'rotation', valor, 1);
            } else
                this.sprite.rotation = -1 * (((valor % 360) + 360) % 360);
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
            return Math.abs(this._imagen.ancho * this.escala_x);
        },
        set: function (nuevo) {
            var signo = this.escala_x / Math.abs(this.escala_x);
            this.escala_x = nuevo / this._imagen.ancho * signo;
        },
        enumerable: true,
        configurable: true
    });

    Actor.prototype.getAncho = function () {
        return this.ancho;
    };


    Actor.prototype.setAncho = function (a) {
        this.ancho = a;
    };

    Object.defineProperty(Actor.prototype, "alto", {
        get: function () {
            return Math.abs(this._imagen.alto * this.escala_y);
        },
        set: function (nuevo) {
            var signo = this.escala_y / Math.abs(this.escala_y);
            this.escala_y = nuevo / this._imagen.alto * signo;
        },
        enumerable: true,
        configurable: true
    });

    Actor.prototype.getAlto = function () {
        return this.alto;
    };


    Actor.prototype.setAlto = function (a) {
        this.alto = a;
    };

    Object.defineProperty(Actor.prototype, "imagen", {
        set: function (_i) {
            if (_i.substring)
                this._imagen = pilas.imagenes.cargar(_i);
            else
                this._imagen = _i;

            //alert(_i);
            this._crear_sprite();
            this.centro = ['centro', 'centro'];
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "izquierda", {
        /* TODO: hacer que se puedan interpolar
        las propiedades: izquierda, derecha, arriba, abajo.
        */
        get: function () {
            return this.x - (this.centro_x * this.escala);
        },
        set: function (x) {
            this.setX(x + (this.centro_x * this.escala));
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "derecha", {
        get: function () {
            return this.izquierda + this.ancho;
        },
        set: function (x) {
            this.izquierda = x - this.ancho;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "arriba", {
        get: function () {
            return this.y + (this.centro_y * this.escala_y);
        },
        set: function (y) {
            this.setY(y - (this.centro_y * this.escala_y));
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "abajo", {
        get: function () {
            return this.arriba - this.alto;
        },
        set: function (y) {
            this.arriba = y + this.alto;
        },
        enumerable: true,
        configurable: true
    });


    Actor.prototype.ejecutar_callbacks_clicks = function () {
        for (var i = 0; i < this.callbacks_cuando_hace_click.length; i++) {
            this.callbacks_cuando_hace_click[i]();
        }
    };

    Actor.prototype.ejecutar_callbacks_over = function () {
        for (var i = 0; i < this.callbacks_cuando_mueve_mouse.length; i++) {
            this.callbacks_cuando_mueve_mouse[i]();
        }
    };

    Object.defineProperty(Actor.prototype, "cuando_hace_click", {
        get: function () {
            return this.callbacks_cuando_hace_click;
        },
        set: function (funcion) {
            //Esta funcion no admite parametros
            this.callbacks_cuando_hace_click.push(funcion);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "cuando_mueve_mouse", {
        get: function () {
            return this.callbacks_cuando_mueve_mouse;
        },
        set: function (funcion) {
            //Esta funcion no admite parametros
            this.callbacks_cuando_mueve_mouse.push(funcion);
        },
        enumerable: true,
        configurable: true
    });

    //metodo recibir() para gestionar los eventos
    Actor.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this._cuando_hace_click(evento);
        }
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this._cuando_mueve_mouse(evento);
        }
    };

    Actor.prototype._cuando_hace_click = function (click) {
        if (this.colisiona_con_un_punto(click.x, click.y)) {
            this.ejecutar_callbacks_clicks();
        }
    };

    Actor.prototype._cuando_mueve_mouse = function (evento) {
        if (this.colisiona_con_un_punto(evento.x, evento.y)) {
            this.ejecutar_callbacks_over();
        }
    };

    /**
    * @method colisiona_con_un_punto
    *
    * Determina si un punto colisiona con el area del actor.
    */
    Actor.prototype.colisiona_con_un_punto = function (x, y) {
        if (x >= ((this.x - this.centro_x * this.escala_x)) && (x <= (this.x + this.centro_x * this.escala_x))) {
            if (y >= ((this.y - this.centro_y * this.escala_y)) && (y <= (this.y + this.centro_y * this.escala_y))) {
                return true;
            }
        }
        return false;
    };

    Actor.prototype.decir = function (mensaje) {
        new pilas.actores.Globo(this, mensaje);
    };
    Actor.prototype.pensar = function (mensaje) {
        new pilas.actores.GloboPensar(this, mensaje);
    };

    Actor.prototype.imitar = function (actor_o_figura) {
        this.aprender(pilas.habilidades.Imitar, { objeto_a_imitar: actor_o_figura });
    };

    Actor.prototype.pre_actualizar = function () {
        this.actualizar_comportamientos();
        this.actualizar_habilidades();
    };

    Actor.prototype.actualizar = function () {
    };

    Actor.prototype.colisiona_con = function (otro_actor) {
        return pilas.utils.colisionan(this, otro_actor);
    };

    /*
    * Comprueba si el actor se encuentra dentro del area visible de la pantalla
    */
    Actor.prototype.esta_fuera_de_la_pantalla = function () {
        var area_visible = pilas.escena_actual().camara.obtener_area_visible();
        return this.derecha < area_visible.izquierda || this.izquierda > area_visible.derecha || this.abajo > area_visible.arriba || this.arriba < area_visible.abajo;
    };

    Actor.prototype.tiene_etiqueta = function (etiqueta) {
        return this.etiquetas.indexOf(etiqueta) > -1;
    };
    return Actor;
})(Estudiante);
var Utils = (function () {
    function Utils() {
    }
    Utils.prototype.convertir_a_grados = function (angulo_en_radianes) {
        return angulo_en_radianes * (180 / Math.PI);
    };

    Utils.prototype.convertir_a_radianes = function (angulo_en_grados) {
        return angulo_en_grados * (Math.PI / 180);
    };

    Utils.prototype.colisionan = function (a, b) {
        return (this.distancia_entre_dos_actores(a, b) < a.radio_de_colision + b.radio_de_colision);
    };

    Utils.prototype.distancia_entre_dos_actores = function (a, b) {
        return this.distancia_entre_dos_puntos(a.x, a.y, b.x, b.y);
    };

    Utils.prototype.distancia_entre_dos_puntos = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(this.distancia(x1, x2), 2) + Math.pow(this.distancia(y1, y2), 2));
    };

    Utils.prototype.obtener_uuid = function () {
        var uuid = Math['uuid'];
        return uuid();
    };

    Utils.prototype.distancia = function (a, b) {
        return Math.abs(b - a);
    };

    Utils.prototype.fabricar = function (clase, cantidad, posiciones_al_azar) {
        if (typeof cantidad === "undefined") { cantidad = 1; }
        if (typeof posiciones_al_azar === "undefined") { posiciones_al_azar = true; }
        var actores = [];

        for (var i = 0; i < cantidad; i++) {
            if (posiciones_al_azar) {
                var x = Math.floor(Math.random() * (320 - (-320 + 1))) - 320;
                var y = Math.floor(Math.random() * (240 - (-240 + 1))) - 240;
            } else {
                var x = 0;
                var y = 0;
            }

            var nuevo = new clase(x, y);
            actores.push(nuevo);
        }

        return new pilas.grupo.Grupo(actores);
    };
    return Utils;
})();
//modulo grupo
var grupo = (function () {
    function grupo() {
        this.Grupo = Grupo;
    }
    return grupo;
})();

var HGrupo = (function () {
    /*Se utiliza para que la clase Grupo pueda extender de ella y por ende
    extender propiedades y metodos de la clase Array */
    function HGrupo() {
        Array.apply(this, arguments);
        return new Array();
    }
    HGrupo.prototype.pop = function () {
        return "";
    };
    HGrupo.prototype.push = function (val) {
        return 0;
    };
    return HGrupo;
})();

HGrupo["prototype"] = new Array();

var Grupo = (function (_super) {
    __extends(Grupo, _super);
    function Grupo(actor_o_array) {
        _super.call(this);
        if (actor_o_array instanceof Array) {
            this.agregar_grupo(actor_o_array);
        } else if (actor_o_array instanceof Object) {
            this.agregar_actor(actor_o_array);
        }
    }
    Grupo.prototype.agregar_grupo = function (grupo) {
        for (var i = 0; i < grupo.length; i++) {
            this.agregar_actor(grupo[i]);
        }
    };

    Grupo.prototype.agregar_actor = function (actor) {
        this.push(actor);
    };

    Object.defineProperty(Grupo.prototype, "x", {
        get: function () {
            return this.__getattr__("x");
        },
        set: function (x) {
            this.__setattr__("x", x);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Grupo.prototype, "y", {
        get: function () {
            return this.__getattr__("y");
        },
        set: function (y) {
            this.__setattr__("y", y);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Grupo.prototype, "escala", {
        get: function () {
            return this.__getattr__("escala");
        },
        set: function (escala) {
            this.__setattr__("escala", escala);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Grupo.prototype, "rotacion", {
        get: function () {
            return this.__getattr__("rotacion");
        },
        set: function (rotacion) {
            this.__setattr__("rotacion", rotacion);
        },
        enumerable: true,
        configurable: true
    });


    Grupo.prototype.aprender = function (habilidad, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.ejecutar_funcion("aprender", habilidad, argumentos);
    };

    Grupo.prototype.hacer = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.ejecutar_funcion("hacer", comportamiento, argumentos);
    };

    Grupo.prototype.hacer_luego = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.ejecutar_funcion("hacer_luego", comportamiento, argumentos);
    };

    Grupo.prototype.decir = function (mensaje) {
        this.ejecutar_funcion("decir", mensaje);
    };

    Grupo.prototype.eliminar = function () {
        this.ejecutar_funcion("eliminar");
    };

    Grupo.prototype.__getattr__ = function (attr) {
        var valores = [];
        for (var i = 0; i < this.length; i++) {
            valores.push(this[i][attr]);
        }
        return valores;
    };

    Grupo.prototype.__setattr__ = function (attr, valor) {
        for (var i = 0; i < this.length; i++) {
            this[i][attr] = valor;
        }
    };

    Grupo.prototype.ejecutar_funcion = function (id, argumentos1, argumentos2) {
        if (typeof argumentos1 === "undefined") { argumentos1 = undefined; }
        if (typeof argumentos2 === "undefined") { argumentos2 = undefined; }
        for (var i = 0; i < this.length; i++) {
            this[i][id](argumentos1, argumentos2);
        }
    };
    return Grupo;
})(HGrupo);
/// <reference path="actores/actor.ts"/>
var Fondo = (function (_super) {
    __extends(Fondo, _super);
    function Fondo(imagen, x, y) {
        _super.call(this, imagen, x, y);
        this.z = 1000;
    }
    return Fondo;
})(Actor);

var Tarde = (function (_super) {
    __extends(Tarde, _super);
    function Tarde() {
        _super.call(this, "fondos.tarde.jpg", 0, 0);
        this.z = 1000;
        this.y = 120; // TODO: temporal solo para tutorial.
    }
    return Tarde;
})(Fondo);

var Plano = (function (_super) {
    __extends(Plano, _super);
    function Plano() {
        _super.call(this, 'plano.png', 0, 0);
        this.sprite.regX = 0;
        this.sprite.regY = 0;
    }
    Plano.prototype.crear_sprite = function () {
        var img = this._imagen.imagen;
        var s = new createjs.Shape();

        s.graphics.beginBitmapFill(img, 'repeat');
        s.graphics.drawRect(-pilas.opciones.ancho / 2, -pilas.opciones.alto / 2, pilas.opciones.ancho, pilas.opciones.alto);
        this.sprite = s;
    };

    Plano.prototype.actualizar = function () {
    };
    return Plano;
})(Fondo);

var Pasto = (function (_super) {
    __extends(Pasto, _super);
    function Pasto() {
        _super.call(this, 'pasto.png', 0, 0);
        this.sprite.regX = 0;
        this.sprite.regY = 0;
    }
    Pasto.prototype.crear_sprite = function () {
        var img = this._imagen.imagen;
        var s = new createjs.Shape();

        s.graphics.beginBitmapFill(img, 'repeat');
        s.graphics.drawRect(-pilas.opciones.ancho / 2, -pilas.opciones.alto / 2, pilas.opciones.ancho, pilas.opciones.alto);
        this.sprite = s;
    };

    Pasto.prototype.actualizar = function () {
    };
    return Pasto;
})(Fondo);

var PastoCuadriculado = (function (_super) {
    __extends(PastoCuadriculado, _super);
    function PastoCuadriculado() {
        _super.call(this, 'pasto_cuadriculado.png', 0, 0);
    }
    PastoCuadriculado.prototype.actualizar = function () {
    };
    return PastoCuadriculado;
})(Fondo);

var Laberinto1 = (function (_super) {
    __extends(Laberinto1, _super);
    function Laberinto1() {
        _super.call(this, 'fondos.laberinto1.png', 0, 0);
    }
    Laberinto1.prototype.actualizar = function () {
    };
    return Laberinto1;
})(Fondo);

var Fondos = (function () {
    function Fondos() {
        this.Plano = Plano;
        this.Pasto = Pasto;
        this.PastoCuadriculado = PastoCuadriculado;
        this.Tarde = Tarde;
        this.Laberinto1 = Laberinto1;
    }
    return Fondos;
})();
var Imagenes = (function () {
    function Imagenes(callback_onready, opciones) {
        this.nombresImagenes = [
            'aceituna.png', 'aceituna_grita.png', 'aceituna_risa.png',
            'aceituna_burla.png',
            'banana.png', 'bomba.png', 'caja.png', 'explosion.png',
            'sin_imagen.png',
            'plano.png', 'alien.png', 'alien_marron.png', 'tuerca.png', 'nave.png',
            'piedra_chica.png', 'piedra_grande.png', 'piedra_media.png', 'ejes.png',
            'disparos.misil.png', 'rpg.maton.png', 'pasto.png',
            'pasto_cuadriculado.png',
            'globo.png', 'balloon.png', 'balloon-tip-right.png', 'balloon-tip-left.png',
            'balloon-tip-think-right.png', 'balloon-tip-think-left.png',
            'bloque.png',
            'manzana_chica.png', 'invisible.png', 'cofre.png', 'llave.png',
            'cesto.png', 'pelota.png', 'zanahoria_normal.png',
            'zanahoria_sonrie.png', 'boton.boton_normal.png',
            'boton.boton_over.png', 'boton.boton_press.png',
            'fondos.tarde.jpg', 'fondos.laberinto1.png',
            'monkey_normal.png', 'monkey_smile.png', 'monkey_shout.png',
            'tortuga.png',
            'pingu.png', 'sombra.png',
            'cooperativista.alerta.png', 'cooperativista.camina.png',
            'cooperativista.camina_sujeta.png', 'cooperativista.ok.png',
            'cooperativista.parado.png', 'cooperativista.parado_sujeta.png',
            'cooperativista.trabajando.png'
        ];
        this.recursos = {};
        this.data_path = opciones.data_path;
        this.loader = new PxLoader();
        this.imagenes_solicitadas = 0;

        this.nombresImagenes = this.nombresImagenes.concat(opciones.imagenesExtra);
        this.cargar_recursos();

        //loader.addProgressListener(function (e) {
        //    this.actualizar_progreso(e);
        //            return true
        // });
        this.loader.addCompletionListener(function (e) {
            pilas.ready = true;
            pilas.escena_actual().iniciar();
            pilas.onready();
            pilas.ejecutar();
        });

        this.loader.start();
    }
    Imagenes.prototype.cargar_recursos = function () {
        var _this = this;
        this.nombresImagenes.forEach(function (nombre) {
            _this.cargar_recurso(nombre);
        });
    };

    Imagenes.prototype.cargar_recurso = function (nombre) {
        var path = this.data_path + '/' + nombre;
        this.recursos[nombre] = this.loader.addImage(path);
        this.imagenes_solicitadas += 1;
    };

    Imagenes.prototype.cargar = function (nombre) {
        if (nombre in this.recursos)
            return new Imagen(this.recursos[nombre]);
        else
            throw "No se puede encontrar la imagen: '" + nombre + "' ¿ha sido pre-cargada en el archivo imagenes.ts?";
    };

    Imagenes.prototype.cargar_grilla = function (nombre, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        return new Grilla(this.recursos[nombre], columnas, filas);
    };

    Imagenes.prototype.cargar_animacion = function (nombre, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        return new Animacion(this.recursos[nombre], columnas, filas);
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

    Imagen.prototype.avanzar = function (velocidad) {
        if (typeof velocidad === "undefined") { velocidad = 60; }
        return false;
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
            images: [this.ruta.src],
            frames: { width: this.ancho, height: this.alto }
        };
        var spritesheet = new createjs.SpriteSheet(data);

        this.sprite = new createjs.Sprite(spritesheet);
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

    Grilla.prototype.avanzar = function (velocidad) {
        if (typeof velocidad === "undefined") { velocidad = 60; }
        var ha_avanzado = true;
        this.cuadro += 1;

        if (this.cuadro >= this.cantidad_cuadros) {
            this.cuadro = 0;
            ha_avanzado = false;
        }

        this.definir_cuadro(this.cuadro);
        return ha_avanzado;
    };

    Object.defineProperty(Grilla.prototype, "ancho", {
        get: function () {
            return this.imagen.width / this.columnas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grilla.prototype, "alto", {
        get: function () {
            return this.imagen.height / this.filas;
        },
        enumerable: true,
        configurable: true
    });
    return Grilla;
})(Imagen);

var Animacion = (function (_super) {
    __extends(Animacion, _super);
    function Animacion(imagen, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        _super.call(this, imagen, columnas, filas);
        this.animaciones = {};
        this.animacion_en_curso = null;
        this.cuadro_en_la_animacion = 0;
        this._ticks_acumulados = 0;
    }
    Animacion.prototype.definir_animacion = function (nombre, cuadros, velocidad) {
        this.animaciones[nombre] = {
            nombre: nombre,
            cuadros: cuadros,
            velocidad: velocidad
        };
    };

    Animacion.prototype.cargar_animacion = function (nombre) {
        if (this.animacion_en_curso !== this.animaciones[nombre]) {
            this._ticks_acumulados = 0;
            this.animacion_en_curso = this.animaciones[nombre];
            this.cuadro_en_la_animacion = 0;
            this.definir_cuadro(this.animacion_en_curso["cuadros"][this.cuadro_en_la_animacion]);
        }
    };

    Animacion.prototype.avanzar = function (velocidad) {
        if (typeof velocidad === "undefined") { velocidad = -1; }
        if (velocidad !== -1)
            throw new Error("Tienes que definir la velocidad usando 'definir_animacion' no llamando al metodo avanzar con un numero.");

        if (!this.animacion_en_curso)
            throw new Error("Tienes que definir al menos una animacion inicial.");

        var velocidad_de_animacion = (1000.0 / 60) * this.animacion_en_curso["velocidad"];
        this._ticks_acumulados += velocidad_de_animacion;
        var ha_avanzado = true;

        if (this._ticks_acumulados > 1000.0) {
            this._ticks_acumulados -= 1000.0;

            if (this.cuadro_en_la_animacion >= this.animacion_en_curso['cuadros'].length) {
                this.cuadro_en_la_animacion = 0;
                ha_avanzado = false;
            }

            this.definir_cuadro(this.animacion_en_curso['cuadros'][this.cuadro_en_la_animacion]);
            this.cuadro_en_la_animacion += 1;
        }

        return ha_avanzado;
    };
    return Animacion;
})(Grilla);
var GestorDeEscenas = (function () {
    function GestorDeEscenas() {
        //this.escenas = [];
        this.escena = null;
    }
    GestorDeEscenas.prototype.cambiar_escena = function (nueva_escena) {
        this.escena = nueva_escena;
        if (pilas.ready) {
            this.escena.iniciar();
        }
        this.actualizar(); // NOTA: se ejecuta para que los actores
        //       tomen su posición inicial.
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
var DepuradorDeshabilitado = (function () {
    function DepuradorDeshabilitado() {
        this.modos = [];
        this.diccionario_modos = {};
    }
    DepuradorDeshabilitado.prototype.actualizar = function () {
        for (var i = 0; i < this.modos.length; i++) {
            this.modos[i].actualizar();
        }
    };

    DepuradorDeshabilitado.prototype.definir_modos = function (modos) {
        modos = modos || {};
        modos.puntos_de_control = modos.puntos_de_control || false;
        modos.radios_de_colision = modos.radios_de_colision || false;
        modos.fisica = modos.fisica || false;
        modos.area = modos.area || false;
        modos.posiciones = modos.posiciones || false;

        this.eliminar_todos_los_modos();

        if (modos.radios_de_colision)
            this.modos.push(new ModoRadiosDeColision());

        if (modos.puntos_de_control)
            this.modos.push(new ModoPuntosDeControl());

        if (modos.fisica)
            this.modos.push(new ModoFisica());

        if (modos.area)
            this.modos.push(new ModoArea());

        if (modos.posiciones)
            this.modos.push(new ModoPosicion());

        this.diccionario_modos = modos;
    };

    DepuradorDeshabilitado.prototype.eliminar_todos_los_modos = function () {
        for (var i = 0; i < this.modos.length; i++)
            this.modos[i].eliminar();

        this.modos = [];
    };

    DepuradorDeshabilitado.prototype.obtener_modos = function () {
        return this.diccionario_modos;
    };
    return DepuradorDeshabilitado;
})();

var ModoDeDepuracion = (function () {
    function ModoDeDepuracion() {
        this.container = new createjs.Container();

        this.shape = new createjs.Shape();
        this.container.addChild(this.shape);

        pilas.escena_actual().stage.addChild(this.container);

        this.grosor_linea = 2;
    }
    ModoDeDepuracion.prototype.eliminar = function () {
        pilas.escena_actual().stage.removeChild(this.container);
    };

    ModoDeDepuracion.prototype.actualizar = function () {
        this.shape.graphics.clear();
    };
    return ModoDeDepuracion;
})();

var ModoRadiosDeColision = (function (_super) {
    __extends(ModoRadiosDeColision, _super);
    function ModoRadiosDeColision() {
        _super.apply(this, arguments);
    }
    ModoRadiosDeColision.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();
        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).drawCircle(posicion.x, posicion.y, actor.radio_de_colision).endStroke();
        }
    };
    return ModoRadiosDeColision;
})(ModoDeDepuracion);

var ModoArea = (function (_super) {
    __extends(ModoArea, _super);
    function ModoArea() {
        _super.apply(this, arguments);
    }
    ModoArea.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).drawRect(posicion.x - actor.ancho / 2, posicion.y - actor.alto / 2, actor.ancho, actor.alto).endStroke();
        }
    };
    return ModoArea;
})(ModoDeDepuracion);

var ModoPuntosDeControl = (function (_super) {
    __extends(ModoPuntosDeControl, _super);
    function ModoPuntosDeControl() {
        _super.apply(this, arguments);
    }
    ModoPuntosDeControl.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
            var size = 3;

            // Dibuja una cruz negra
            size = 4;
            this.shape.graphics.beginStroke("#000").setStrokeStyle(this.grosor_linea + 2).moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
            this.shape.graphics.beginStroke("#000").setStrokeStyle(this.grosor_linea + 2).moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();

            // Dibuja una cruz blanca
            size = 3;
            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();
        }
    };
    return ModoPuntosDeControl;
})(ModoDeDepuracion);

var ModoFisica = (function (_super) {
    __extends(ModoFisica, _super);
    function ModoFisica() {
        _super.apply(this, arguments);
    }
    ModoFisica.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();
        this.shape.graphics.setStrokeStyle(this.grosor_linea);
        escena.fisica.dibujar_figuras_sobre_lienzo(this.shape.graphics);
    };
    return ModoFisica;
})(ModoDeDepuracion);

var ModoPosicion = (function (_super) {
    __extends(ModoPosicion, _super);
    function ModoPosicion() {
        _super.call(this);
        this.text_coordenada = new createjs.Text("Posición del mouse: x=12 y=33", "12px Arial", "white");
        this.text_coordenada.y = 920 / 2; //TODO: Tamaño decanvas 640*480
        this.text_coordenada.x = 900 / 2;
        this.container.addChild(this.text_coordenada);
        this.eje = new pilas.actores.Eje();
        this.sobre_escribir_dibujado();
    }
    ModoPosicion.prototype.sobre_escribir_dibujado = function () {
        var anterior_draw = this.shape.graphics.draw;
        var g = this.shape.graphics;
        this.shape.graphics.actores = [];

        this.shape.graphics.draw = function (a) {
            a.fillStyle = "white";

            for (var i = 0; i < this.actores.length; i++) {
                var actor = this.escena.actores[i];
                var posicion = this.escena.obtener_posicion_pantalla(actor.x, actor.y);

                a.fillText(" (" + Math.floor(actor.x) + ", " + Math.floor(actor.y) + ")", posicion.x + 10, posicion.y + 10);
            }

            anterior_draw.call(g, a);
        };
    };

    ModoPosicion.prototype.eliminar = function () {
        _super.prototype.eliminar.call(this);
        this.eje.eliminar();
    };

    ModoPosicion.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();
        this.shape.graphics.actores = escena.actores;
        this.shape.graphics.escena = escena;

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
            var size = 3;

            // Dibuja un punto
            this.shape.graphics.beginFill("#FFF").setStrokeStyle(this.grosor_linea).drawCircle(posicion.x, posicion.y, 2);
        }

        var pos = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
        this.text_coordenada.text = "Posición del mouse: x=" + Math.floor(pos.x) + " y=" + Math.floor(pos.y);
    };
    return ModoPosicion;
})(ModoDeDepuracion);
/// <reference path="gestor_escenas.ts" />
/// <reference path="depurador.ts" />
/// <reference path="pilas.ts" />
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

    Mundo.prototype.obtener_modos = function () {
        return this.depurador.obtener_modos();
    };

    Mundo.prototype.agregar_tarea_una_vez = function (tiempo, funcion, parametros, parent) {
        if (typeof parametros === "undefined") { parametros = undefined; }
        if (typeof parent === "undefined") { parent = undefined; }
        pilas.escena_actual().tareas.una_vez(tiempo, funcion, parametros, parent);
    };

    Mundo.prototype.agregar_tarea_siempre = function (tiempo, funcion, parametros, parent) {
        if (typeof parametros === "undefined") { parametros = undefined; }
        if (typeof parent === "undefined") { parent = undefined; }
        pilas.escena_actual().tareas.siempre(tiempo, funcion, parametros, parent);
    };
    return Mundo;
})();
var simbolos = {
    IZQUIERDA: 37,
    DERECHA: 39,
    ARRIBA: 38,
    ABAJO: 40,
    ESPACIO: 32,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    J: 74
};
/// <reference path="simbolos.ts" />
/// <reference path="pilas.ts" />
/**
* @class Control
*
* Representa un control de teclado sencillo.
*
* Este objeto permite acceder al estado del teclado usando atributos.
*
* Por ejemplo, con este objeto, para saber si el usuario está
* pulsando el direccional hacia la izquierda puedes ejecutar::
*
*     @example
*     if (pilas.escena_actual().control.izquierda) {
*       console.log('Ha pulsado hacia la izquierda');
*     }
*
* Es decir, si bien Control es una clase, no hace falta
* instanciarla. Ya existe un objeto que se puede consultar bajo el
* nombre ``pilas.escena_actual().control``.
*
* Entonces, una vez que tienes la referencia para consultar, los
* atributos que tiene este objeto control son::
*
*     @example
*     izquierda
*     derecha
*     arriba
*     abajo
*     boton
*
* Cada uno de estos atributos te pueden devolver true, o false,
* indicando si el control está pulsado o no.
*/
var Control = (function () {
    function Control(escena) {
        this.izquierda = false;
        this.derecha = false;
        this.arriba = false;
        this.abajo = false;
        this.boton = false;

        escena.pulsa_tecla.conectar(this);
        escena.suelta_tecla.conectar(this);
    }
    Control.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().pulsa_tecla) {
            this.cuando_pulsa_una_tecla(evento);
        }
        if (tipo == pilas.escena_actual().suelta_tecla) {
            this.cuando_suelta_una_tecla(evento);
        }
    };

    Control.prototype.cuando_pulsa_una_tecla = function (evento) {
        switch (evento.codigo) {
            case simbolos.IZQUIERDA: {
                this.izquierda = true;
                break;
            }
            case simbolos.DERECHA: {
                this.derecha = true;
                break;
            }
            case simbolos.ARRIBA: {
                this.arriba = true;
                break;
            }
            case simbolos.ABAJO: {
                this.abajo = true;
                break;
            }
            case simbolos.ESPACIO: {
                this.boton = true;
                break;
            }

            case simbolos.W: {
                this.arriba = true;
                break;
            }

            case simbolos.A: {
                this.izquierda = true;
                break;
            }

            case simbolos.D: {
                this.derecha = true;
                break;
            }

            case simbolos.S: {
                this.abajo = true;
                break;
            }

            case simbolos.J: {
                this.boton = true;
                break;
            }
        }
    };

    Control.prototype.cuando_suelta_una_tecla = function (evento) {
        switch (evento.codigo) {
            case simbolos.IZQUIERDA: {
                this.izquierda = false;
                break;
            }
            case simbolos.DERECHA: {
                this.derecha = false;
                break;
            }
            case simbolos.ARRIBA: {
                this.arriba = false;
                break;
            }
            case simbolos.ABAJO: {
                this.abajo = false;
                break;
            }
            case simbolos.ESPACIO: {
                this.boton = false;
                break;
            }

            case simbolos.W: {
                this.arriba = false;
                break;
            }

            case simbolos.A: {
                this.izquierda = false;
                break;
            }

            case simbolos.D: {
                this.derecha = false;
                break;
            }

            case simbolos.S: {
                this.abajo = false;
                break;
            }

            case simbolos.J: {
                this.boton = false;
                break;
            }
        }
    };
    return Control;
})();
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
    function Camara(escenario) {
        this.centro_x = pilas.opciones.ancho / 2;
        this.centro_y = pilas.opciones.alto / 2;

        this.escenario = escenario;
    }
    Object.defineProperty(Camara.prototype, "x", {
        get: function () {
            return this.escenario.x;
        },
        set: function (_x) {
            if (_x instanceof Array)
                pilas.interpolar(this.escenario, "x", [-_x], 1);
            else {
                this.escenario.x = -_x;
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Camara.prototype, "y", {
        get: function () {
            return this.escenario.y;
        },
        set: function (_y) {
            if (_y instanceof Array)
                pilas.interpolar(this.escenario, "y", [-_y], 1);
            else {
                this.escenario.y = -_y;
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Camara.prototype, "zoom", {
        get: function () {
            return this.escenario.scaleX;
        },
        set: function (_z) {
            if (_z instanceof Array) {
                pilas.interpolar(this.escenario, "scaleX", [1 + _z * 0.1], 1);
                pilas.interpolar(this.escenario, "scaleY", [1 + _z * 0.1], 1);
            } else {
                this.escenario.scaleX = 1 + _z * 0.1;
                this.escenario.scaleY = 1 + _z * 0.1;
            }
        },
        enumerable: true,
        configurable: true
    });


    /**
    * @method obtener_posicion_pantalla
    *
    * Convierte una posición del escenario de pilas al formato
    * de coordenadas del navegador.
    *
    * Por ejemplo, el punto (0, 0) es el centro del escenario para
    * pilas, pero el navegador lo interpreta como el punto (160, 120).
    */
    Camara.prototype.obtener_posicion_pantalla = function (x, y) {
        return { x: x + this.centro_x, y: this.centro_y - y };
    };

    /**
    * @method obtener_posicion_escenario
    *
    * Convierte una posición dada en un sistema de coordenadas
    * tradicional, en una posición de escenario, donde el punto (0, 0)
    * es el centro de la pantalla.
    */
    Camara.prototype.obtener_posicion_escenario = function (x, y) {
        return { x: x - this.centro_x, y: this.centro_y - y };
    };

    Camara.prototype.obtener_posicion = function () {
        return {
            x: this.centro_x - this.x,
            y: this.centro_y + this.y };
    };

    /*
    * Convierte una coordenada de pilas (donde 0,0 es el centro de pantalla)
    * en una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda).
    */
    Camara.prototype.convertir_de_posicion_relativa_a_fisica = function (x, y) {
        var centro = this.obtener_posicion();
        return {
            x: centro.x + x,
            y: centro.y - y };
    };

    /*
    * Convierte una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda)
    * en una coordenada de pilas (donde 0,0 es el centro de pantalla).
    */
    Camara.prototype.convertir_de_posicion_fisica_a_relativa = function (x, y) {
        var centro = this.obtener_posicion();
        return {
            x: -centro.x + x,
            y: +centro.y - y };
    };

    /*
    * Obtiene el area visible de la pantalla.
    * return: object
    */
    Camara.prototype.obtener_area_visible = function () {
        var ancho = pilas.opciones.ancho;
        var alto = pilas.opciones.alto;

        return {
            izquierda: this.x - ancho / 2, derecha: this.x + ancho / 2, arriba: this.y + alto / 2, abajo: this.y - alto / 2 };
    };
    return Camara;
})();
var Evento = (function () {
    function Evento(nombre) {
        this.respuestas = {};
        this.nombre = nombre;
    }
    Evento.prototype.emitir = function (evento) {
        for (var nombre_respuesta in this.respuestas) {
            var respuesta = this.respuestas[nombre_respuesta];
            if (typeof (respuesta) == 'object') {
                respuesta.recibir(evento, this);
            } else {
                respuesta(evento);
            }
        }
    };

    Evento.prototype.conectar = function (respuesta) {
        this.respuestas[respuesta.toString() + Math.random().toString()] = respuesta;
    };

    Evento.prototype.desconectar = function (respuesta) {
        delete this.respuestas[respuesta.toString()];
    };
    return Evento;
})();

var ProxyEventos = (function () {
    function ProxyEventos() {
        this.click_de_mouse = pilas.escena_actual().click_de_mouse;
        this.cuando_termina_click = pilas.escena_actual().cuando_termina_click;
        this.mueve_mouse = pilas.escena_actual().mueve_mouse;
        this.actualiza = pilas.escena_actual().actualiza;
        this.pulsa_tecla = pilas.escena_actual().pulsa_tecla;
        this.suelta_tecla = pilas.escena_actual().suelta_tecla;
        this.Evento = Evento;
    }
    return ProxyEventos;
})();
/// <reference path="control.ts" />
/// <reference path="camara.ts" />
/// <reference path="evento.ts" />
/// <reference path="pilas.ts" />
var escena = (function () {
    function escena() {
        this.Base = Base;
        this.Normal = Normal;
    }
    return escena;
})();

var Base = (function () {
    function Base() {
        this.desPausar();
        this.click_de_mouse = new Evento('click_de_mouse'); // ['boton', 'x', 'y']
        this.cuando_termina_click = new Evento('cuando_termina_click'); // ['boton', 'x', 'y']
        this.mueve_mouse = new Evento('mueve_mouse'); // ['x', 'y', 'dx', 'dy']
        this.pulsa_tecla = new Evento('pulsa_tecla'); // ['codigo', 'texto']
        this.suelta_tecla = new Evento('suelta_tecla'); // ['codigo', 'texto']
        this.actualiza = new Evento('actualiza'); // []
        this.stage = new createjs.Stage(pilas.canvas);

        this.stage.snapToPixel = true;

        this.camara = new Camara(this.stage);
        this.fisica = new Fisica(this.camara);
        this.control = new Control(this);

        this.actores = [];
        this.tareas = new pilas.tareas.Tareas();
    }
    Base.prototype.iniciar = function () {
        throw "Tienes que re-definir el método iniciar";
    };

    Base.prototype.actualizar = function () {
        if (!this.pausada) {
            this.doActualizar();
        }
    };

    Base.prototype.doActualizar = function () {
        this.fisica.actualizar();
        this.tareas.actualizar();

        var copiaActores = this.actores.slice();

        for (var i = 0; i < this.actores.length; i++) {
            if (copiaActores[i] !== undefined) {
                copiaActores[i].pre_actualizar();
                copiaActores[i].actualizar();
            }
        }

        this.actualiza.emitir();
        pilas.colisiones.verificar_colisiones();

        this.ordenar_actores_por_valor_z();
        this.stage.update();
    };

    Base.prototype.pausar = function () {
        this.pausada = true;
    };

    Base.prototype.desPausar = function () {
        this.pausada = false;
    };

    Base.prototype.ordenar_actores_por_valor_z = function () {
        this.stage.sortChildren(function (a, b) {
            return b.z - a.z;
        });
    };

    Base.prototype.agregar_actor = function (actor) {
        this.actores.push(actor);
        this.stage.addChild(actor.sprite);
        this.ordenar_actores_por_valor_z();
        this.stage.update();
    };

    Base.prototype.eliminar_actor = function (actor) {
        var index = this.actores.indexOf(actor);
        if (index !== -1)
            this.actores.splice(index, 1);

        this.stage.removeChild(actor.sprite);
        this.stage.update();
    };

    Base.prototype.obtener_posicion_pantalla = function (x, y) {
        return this.camara.obtener_posicion_pantalla(x, y);
    };

    Base.prototype.obtener_posicion_escenario = function (x, y) {
        return this.camara.obtener_posicion_escenario(x, y);
    };
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
        _super.apply(this, arguments);
    }
    Normal.prototype.iniciar = function () {
        this.fondo = new pilas.fondos.Plano();
    };
    return Normal;
})(Base);
var Interpolaciones = (function () {
    function Interpolaciones() {
    }
    Interpolaciones.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo, tipo) {
        var tiempo = tiempo * 1000 || 1000;
        var step = tiempo / valor_o_valores.length;
        var tipo = tipo || createjs.Ease.none;
        var tween = createjs.Tween.get(objeto);

        for (var i = 0; i < valor_o_valores.length; i++) {
            var attr = atributo.toString();
            var diccionario = {};
            diccionario[attr] = valor_o_valores[i];
            tween = tween.to(diccionario, step, tipo);
        }
    };

    Interpolaciones.prototype.AceleracionGradual = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.cubicin);
    };

    Interpolaciones.prototype.DesaceleracionGradual = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.cubicOut);
    };

    Interpolaciones.prototype.ReboteInicial = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.bounceIn);
    };

    Interpolaciones.prototype.ReboteFinal = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.bounceOut);
    };

    Interpolaciones.prototype.ElasticoInicial = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.elasticIn);
    };

    Interpolaciones.prototype.ElasticoFinal = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.elasticOut);
    };
    return Interpolaciones;
})();
var PPM = 30;

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
    b2MouseJointDef: Box2D.Dynamics.Joints.b2MouseJointDef
};

function convertir_a_metros(valor) {
    return valor / PPM;
}

function convertir_a_pixels(valor) {
    return valor * PPM;
}

var Figura = (function () {
    function Figura(fisica) {
        this.fisica = fisica;
        this.camara = fisica.camara;
        this.id = pilas.utils.obtener_uuid();
    }
    Object.defineProperty(Figura.prototype, "x", {
        get: function () {
            return this.obtener_posicion().x;
        },
        set: function (_x) {
            this.definir_posicion(_x, this.cuerpo.GetPosition().y);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Figura.prototype, "y", {
        get: function () {
            return this.obtener_posicion().y;
        },
        set: function (_y) {
            this.definir_posicion(this.cuerpo.GetPosition().x, _y);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Figura.prototype, "rotacion", {
        get: function () {
            return this.obtener_rotacion();
        },
        set: function (angulo) {
            this.definir_rotacion(angulo);
        },
        enumerable: true,
        configurable: true
    });


    Figura.prototype.obtener_posicion = function () {
        var posicion = this.cuerpo.GetPosition();
        var x = convertir_a_pixels(posicion.x);
        var y = convertir_a_pixels(posicion.y);

        return this.camara.convertir_de_posicion_fisica_a_relativa(x, y);
    };

    Figura.prototype.definir_posicion = function (x, y) {
        var v = this.cuerpo.GetPosition();
        var pos = this.camara.convertir_de_posicion_relativa_a_fisica(x, y);

        var _x = convertir_a_metros(pos.x);
        var _y = convertir_a_metros(pos.y);

        v.x = _x;
        v.y = _y;

        this.cuerpo.SetPosition(v);
        this.empujar(0, 0);
    };

    Figura.prototype.obtener_rotacion = function () {
        return (this.cuerpo.GetAngle() * 180) / Math.PI;
    };

    Figura.prototype.definir_rotacion = function (angulo) {
        this.cuerpo.SetAngle(pilas.utils.convertir_a_radianes(angulo));
    };

    Figura.prototype.empujar = function (dx, dy) {
        var v = this.cuerpo.GetLinearVelocity();
        v.x = convertir_a_metros(dx);
        v.y = convertir_a_metros(dy);
        this.cuerpo.SetLinearVelocity(v);
    };

    Figura.prototype.eliminar = function () {
        this.fisica.mundo.DestroyBody(this.cuerpo);
    };
    return Figura;
})();

var Rectangulo = (function (_super) {
    __extends(Rectangulo, _super);
    function Rectangulo(fisica, x, y, ancho, alto, opciones) {
        _super.call(this, fisica);

        var opciones = opciones || {};

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
        polygonShape.SetAsBox(convertir_a_metros(ancho / 2), convertir_a_metros(alto / 2));

        var fixtureDef = new box2d.b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;

        var body = this.fisica.mundo.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);

        this.cuerpo = body;
    }
    return Rectangulo;
})(Figura);

var Circulo = (function (_super) {
    __extends(Circulo, _super);
    function Circulo(fisica, x, y, radio, opciones) {
        _super.call(this, fisica);
        this._radio = convertir_a_metros(radio);
        this._escala = 1;

        var opciones = opciones || {};

        if (opciones.dinamico === undefined)
            opciones.dinamico = true;

        var fixDef = new Box2D.Dynamics.b2FixtureDef;

        fixDef.density = opciones.densidad || 1.0;
        fixDef.friction = opciones.friccion || 0.5;
        fixDef.restitution = opciones.restitucion || 0.2;

        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this._radio);

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
    Circulo.prototype.definir_radio = function () {
        var fixture = this.cuerpo.GetFixtureList();

        if (fixture) {
            var shape = fixture.GetShape();
            shape.SetRadius(this._radio);
        }
    };


    Object.defineProperty(Circulo.prototype, "radio", {
        get: function () {
            return convertir_a_pixels(this._radio);
        },
        set: function (radio) {
            if (radio instanceof Array) {
                pilas.interpolar(this, "radio", radio, 1);
            } else {
                this._escala = (this._escala * radio) / this.radio;
                this._radio = convertir_a_metros(radio);
                this.definir_radio();
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Circulo.prototype, "escala", {
        get: function () {
            return this._escala;
        },
        set: function (escala) {
            if (escala instanceof Array) {
                pilas.interpolar(this, "escala", escala, 1);
            } else {
                this._radio = (this._radio * escala) / this.escala;
                this._escala = escala;
                this.definir_radio();
            }
        },
        enumerable: true,
        configurable: true
    });
    return Circulo;
})(Figura);

var Fisica = (function () {
    function Fisica(camara) {
        this.camara = camara;
        this.mundo = new box2d.b2World(new box2d.b2Vec2(0, 10), false);
        this.Rectangulo = Rectangulo; // TODO: separar fisica como Motor y Módulo, dos clases separadas.
        this.Circulo = Circulo; // TODO: separar fisica como Motor y Módulo, dos clases separadas.
        this.velocidad = 1.0;
        this.timeStep = this.velocidad / 120.0;

        // Bordes del escenario
        this.crear_rectangulo(0, -pilas.opciones.alto / 2, pilas.opciones.ancho, 5, { dinamico: false }); // abajo
        this.crear_rectangulo(0, pilas.opciones.alto / 2, pilas.opciones.ancho, 5, { dinamico: false }); // arriba
        this.crear_rectangulo(-pilas.opciones.ancho / 2, 0, 5, pilas.opciones.alto, { dinamico: false }); // izquierda
        this.crear_rectangulo(pilas.opciones.ancho / 2, 0, 5, pilas.opciones.alto, { dinamico: false }); // derecha
    }
    Fisica.prototype.actualizar = function () {
        this.mundo.Step(this.timeStep, 6, 3);
        this.mundo.ClearForces();
    };

    Fisica.prototype.definir_gravedad = function (dx, dy) {
        this.mundo.SetGravity(new box2d.b2Vec2(dx, dy));
    };

    Fisica.prototype.dibujar_figuras_sobre_lienzo = function (graphics) {
        for (var b = this.mundo.m_bodyList; b != null; b = b.m_next) {
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

                    var dx = Math.cos(b.GetAngle());
                    var dy = Math.sin(b.GetAngle());

                    graphics.beginStroke("white").moveTo(x, y).lineTo(x + convertir_a_pixels(dx * radio), y + convertir_a_pixels(dy * radio)).endStroke();
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

                    graphics.beginStroke("white").moveTo(v2[0].x, v2[0].y).lineTo(v2[1].x, v2[1].y).lineTo(v2[2].x, v2[2].y).lineTo(v2[3].x, v2[3].y).lineTo(v2[0].x, v2[0].y).endStroke();
                }
            }
        }
    };

    Fisica.prototype.convertir_vector_relativo_a_pantalla = function (cuerpo, x, y, v) {
        var vector_salida = cuerpo.GetWorldVector(v);
        return {
            x: vector_salida.x * PPM + x,
            y: vector_salida.y * PPM + y };
    };

    Fisica.prototype.createBox = function (width, height, pX, pY, type, data) {
        var bodyDef = new box2d.b2BodyDef;
        bodyDef.type = type;
        bodyDef.position.Set(pX / PPM, pY / PPM);

        //bodyDef.userData=data;
        var polygonShape = new box2d.b2PolygonShape;
        polygonShape.SetAsBox(width / 2 / PPM, height / 2 / PPM);

        var fixtureDef = new box2d.b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;

        var body = this.mundo.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);

        return body;
    };

    Fisica.prototype.crear_rectangulo = function (x, y, ancho, alto, opciones) {
        return new this.Rectangulo(this, x, y, ancho, alto, opciones);
    };

    Fisica.prototype.crear_circulo = function (x, y, radio, opciones) {
        return new this.Circulo(this, x, y, radio, opciones);
    };
    return Fisica;
})();

var ConstanteDeMovimiento = (function () {
    function ConstanteDeMovimiento(figura, evento) {
        var def = new box2d.b2MouseJointDef();
        this.cuerpo_enlazado = pilas.escena_actual().fisica.createBox(8.5, 2, 1, 1, box2d.b2Body.b2_staticBody);
        def.bodyA = this.cuerpo_enlazado;
        def.bodyB = figura.cuerpo;
        var pos = pilas.escena_actual().camara.convertir_de_posicion_relativa_a_fisica(evento.x, evento.y);
        def.target = new box2d.b2Vec2(convertir_a_metros(pos.x), convertir_a_metros(pos.y));
        def.collideConnected = true;
        def.maxForce = 1000.0 * figura.cuerpo.GetMass();
        def.dampingRatio = 0;

        this.constante = pilas.escena_actual().fisica.mundo.CreateJoint(def);
        figura.cuerpo.SetAwake(true);
    }
    ConstanteDeMovimiento.prototype.mover = function (x, y) {
        var pos = pilas.escena_actual().camara.convertir_de_posicion_relativa_a_fisica(x, y);
        this.constante.SetTarget(new box2d.b2Vec2(convertir_a_metros(pos.x), convertir_a_metros(pos.y)));
    };

    ConstanteDeMovimiento.prototype.eliminar = function () {
        pilas.escena_actual().fisica.mundo.DestroyBody(this.cuerpo_enlazado);
    };
    return ConstanteDeMovimiento;
})();
/// <reference path="fisica.ts" />
/// <reference path="pilas.ts" />
/**
* @class Habilidad
*
* Representa una habilidad que un actor puede aprender.
*/
var Habilidad = (function () {
    function Habilidad(receptor, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = null; }
        this.receptor = receptor;
        this.argumentos = argumentos;
    }
    Habilidad.prototype.actualizar = function () {
    };

    Habilidad.prototype.eliminar = function () {
    };
    return Habilidad;
})();

var Imitar = (function (_super) {
    __extends(Imitar, _super);
    function Imitar(receptor, argumentos) {
        _super.call(this, receptor, argumentos);
        this.objeto_a_imitar = this.argumentos.objeto_a_imitar;

        if (this.argumentos.con_rotacion === undefined) {
            this.argumentos.con_rotacion = true;
        }
        if (this.argumentos.con_escala === undefined) {
            this.argumentos.con_escala = true;
        }

        receptor.id = this.argumentos.objeto_a_imitar.id;
        receptor.figura = this.argumentos.objeto_a_imitar;
    }
    Imitar.prototype.actualizar = function () {
        this.receptor.x = this.objeto_a_imitar.x;
        this.receptor.y = this.objeto_a_imitar.y;
        if (this.argumentos.con_rotacion) {
            this.receptor.rotacion = this.objeto_a_imitar.rotacion;
        }
        if (this.argumentos.con_escala) {
            this.objeto_a_imitar.escala = this.receptor.escala;
        }
    };
    return Imitar;
})(Habilidad);

var AtributoEntero = (function () {
    function AtributoEntero(nombre, victima, imitador) {
        this.nombre = nombre;
        this.deltaOriginal = victima[nombre] - imitador[nombre];
    }
    AtributoEntero.prototype.nuevoValor = function (victima) {
        return victima[this.nombre] - this.deltaOriginal;
    };
    return AtributoEntero;
})();

var AtributoPorcentual = (function () {
    function AtributoPorcentual(nombre, victima, imitador) {
        this.nombre = nombre;
        this.valorOriginalVictima = victima[nombre];
        this.valorOriginalImitador = imitador[nombre];
    }
    AtributoPorcentual.prototype.nuevoValor = function (victima) {
        var porcentaje = victima[this.nombre] / this.valorOriginalVictima;
        return porcentaje * this.valorOriginalImitador;
    };
    return AtributoPorcentual;
})();

var ImitarAtributosNumericos = (function (_super) {
    __extends(ImitarAtributosNumericos, _super);
    function ImitarAtributosNumericos(receptor, argumentos) {
        var _this = this;
        _super.call(this, receptor, argumentos);
        this.objeto_a_imitar = this.argumentos.objeto_a_imitar;
        this.argumentos.conVariacionEntera = this.argumentos.conVariacionEntera || [];
        this.argumentos.conVariacionPorcentual = this.argumentos.conVariacionPorcentual || [];

        this.atributos = this.argumentos.conVariacionEntera.map(function (nombre) {
            return new AtributoEntero(nombre, _this.objeto_a_imitar, _this.receptor);
        });
        this.atributos = this.atributos.concat(this.argumentos.conVariacionPorcentual.map(function (nombre) {
            return new AtributoPorcentual(nombre, _this.objeto_a_imitar, _this.receptor);
        }));
        this.setters = this.argumentos.setters || {};
    }
    ImitarAtributosNumericos.prototype.actualizar = function () {
        this.atributos.forEach(function (atributo) {
            var nuevoValor = atributo.nuevoValor(this.objeto_a_imitar);
            if (this.setters[atributo.nombre])
                this.receptor[this.setters[atributo.nombre]](nuevoValor);
            else
                this.receptor[atributo.nombre] = nuevoValor;
        }.bind(this));
    };
    return ImitarAtributosNumericos;
})(Habilidad);

var ImitarPosicion = (function (_super) {
    __extends(ImitarPosicion, _super);
    function ImitarPosicion(receptor, argumentos) {
        argumentos.conVariacionEntera = ['x', 'y'];
        argumentos.setters = { 'x': 'setX', 'y': 'setY' };
        _super.call(this, receptor, argumentos);
    }
    return ImitarPosicion;
})(ImitarAtributosNumericos);

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
* @class SeguirAlMouse
*
* Hace que un actor siga la posición del mouse en todo momento.
*/
var SeguirAlMouse = (function (_super) {
    __extends(SeguirAlMouse, _super);
    function SeguirAlMouse(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().mueve_mouse.conectar(this);
    }
    SeguirAlMouse.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this.mover(evento);
        }
    };

    SeguirAlMouse.prototype.mover = function (evento) {
        this.receptor.x = evento.x;
        this.receptor.y = evento.y;
    };
    return SeguirAlMouse;
})(Habilidad);

/**
* @class SeguirClicks
*
* Hace que el actor se coloque la posición del cursor cuando se hace click.
*/
var SeguirClicks = (function (_super) {
    __extends(SeguirClicks, _super);
    function SeguirClicks(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().click_de_mouse.conectar(this);
    }
    SeguirClicks.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this.moverse_a_este_punto(evento);
        }
    };

    SeguirClicks.prototype.moverse_a_este_punto = function (evento) {
        this.receptor.x = [evento.x], 0.5;
        this.receptor.y = [evento.y], 0.5;
    };
    return SeguirClicks;
})(Habilidad);

/**
* @class MoverseConElTeclado
*
* Hace que un actor cambie de posición con pulsar el teclado.
*/
var MoverseConElTeclado = (function (_super) {
    __extends(MoverseConElTeclado, _super);
    function MoverseConElTeclado(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
        this.en_movimiento = false;
    }
    MoverseConElTeclado.prototype.recibir = function (evento, tipo) {
        var x = 0;
        var y = 0;

        if (tipo == pilas.escena_actual().actualiza) {
            var control = pilas.escena_actual().control;
            var velocidad = this.receptor.velocidad || 5;

            if (control.izquierda)
                x = -velocidad;

            if (control.derecha)
                x = velocidad;

            if (control.arriba)
                y = velocidad;

            if (control.abajo)
                y = -velocidad;

            if (x != 0 || y != 0) {
                if (this.en_movimiento == false) {
                    this.en_movimiento = true;
                }
                this.mover(x, y);
            }
        }

        if (this.en_movimiento) {
            if (x == 0 && y == 0) {
                this.en_movimiento = false;
                this.receptor.detener_animacion();
            }
        }
    };

    MoverseConElTeclado.prototype.mover = function (x, y) {
        if (this.receptor.mover !== undefined) {
            this.receptor.mover(x, y);
        } else {
            this.receptor.x += x;
            this.receptor.y += y;
        }
    };
    return MoverseConElTeclado;
})(Habilidad);

var MoverseConElTecladoConRotacion = (function (_super) {
    __extends(MoverseConElTecladoConRotacion, _super);
    function MoverseConElTecladoConRotacion(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
    }
    MoverseConElTecladoConRotacion.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().actualiza) {
            var control = pilas.escena_actual().control;

            if (control.izquierda)
                this.receptor.rotacion -= 2;

            if (control.derecha)
                this.receptor.rotacion += 2;

            if (control.arriba)
                this.receptor.avanzar(1.5);
        }
    };
    return MoverseConElTecladoConRotacion;
})(Habilidad);

/**
* @class Arrastrable
*
* Hace que un objeto se pueda arrastrar con el puntero del mouse.
*
* Cuando comienza a mover al actor se llama al metodo
* ''comienza_a_arrastrar'' y cuando termina llama a
* ''termina_de_arrastrar''. Estos nombres de metodos se llaman para
* que puedas personalizar estos eventos, dado que puedes usar
* polimorfismo para redefinir el comportamiento de estos dos metodos.
*/
var Arrastrable = (function (_super) {
    __extends(Arrastrable, _super);
    function Arrastrable(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().click_de_mouse.conectar(this);
        pilas.escena_actual().mueve_mouse.conectar(this);
        this.debe_arrastrar = false;
    }
    Arrastrable.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this.cuando_intenta_arrastrar(evento);
        }
        if (tipo == pilas.escena_actual().cuando_termina_click) {
            this.cuando_termina_de_arrastrar(evento);
        }
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this.cuando_arrastra(evento);
        }
    };

    Arrastrable.prototype.cuando_intenta_arrastrar = function (evento) {
        if (evento.boton == 1) {
            if (this.receptor.colisiona_con_un_punto(evento.x, evento.y)) {
                pilas.escena_actual().cuando_termina_click.conectar(this);
                this.comienza_a_arrastrar(evento);
            }
        }
    };

    Arrastrable.prototype.cuando_arrastra = function (evento) {
        // Muestra un cursor diferente si puede comenzar
        // a mover la figura.
        if (this.receptor.colisiona_con_un_punto(evento.x, evento.y))
            document.body.style.cursor = "move";
        else
            document.body.style.cursor = "default";

        if (this.debe_arrastrar === true) {
            if (this.receptor.tiene_fisica()) {
                this.constante.mover(evento.x, evento.y);
            } else {
                this.receptor.x = evento.x;
                this.receptor.y = evento.y;
            }
        }
    };

    Arrastrable.prototype.cuando_termina_de_arrastrar = function (evento) {
        pilas.escena_actual().cuando_termina_click.desconectar(this);
        pilas.escena_actual().mueve_mouse.desconectar(this);
        this.termina_de_arrastrar();
    };

    Arrastrable.prototype.comienza_a_arrastrar = function (evento) {
        if (this.receptor.tiene_fisica())
            this.constante = new ConstanteDeMovimiento(this.receptor.figura, evento);

        this.debe_arrastrar = true;
    };

    Arrastrable.prototype.termina_de_arrastrar = function () {
        if (this.receptor.tiene_fisica())
            this.constante.eliminar();

        this.debe_arrastrar = false;
    };
    return Arrastrable;
})(Habilidad);

var Disparar = (function (_super) {
    __extends(Disparar, _super);
    function Disparar(receptor) {
        this.contador = 0;
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
    }
    Disparar.prototype.recibir = function (evento, tipo) {
        if (this.contador < 1) {
            if (tipo == pilas.escena_actual().actualiza) {
                var control = pilas.escena_actual().control;

                if (control.boton) {
                    this.receptor.disparar();
                    this.contador = 30;
                }
            }
        } else {
            this.contador -= 1;
        }
    };
    return Disparar;
})(Habilidad);

var RebotarComoPelota = (function (_super) {
    __extends(RebotarComoPelota, _super);
    function RebotarComoPelota(receptor) {
        _super.call(this, receptor);
        var circulo = pilas.escena_actual().fisica.crear_circulo(receptor.x, receptor.y, receptor.radio_de_colision, {});
        receptor.imitar(circulo);
    }
    return RebotarComoPelota;
})(Habilidad);

var RebotarComoCaja = (function (_super) {
    __extends(RebotarComoCaja, _super);
    function RebotarComoCaja(receptor) {
        _super.call(this, receptor);
        var rectangulo = pilas.escena_actual().fisica.crear_rectangulo(receptor.x, receptor.y, receptor.radio_de_colision * 2, receptor.radio_de_colision * 2, {});
        receptor.imitar(rectangulo);
    }
    return RebotarComoCaja;
})(Habilidad);

var SeMantieneEnPantalla = (function (_super) {
    __extends(SeMantieneEnPantalla, _super);
    function SeMantieneEnPantalla(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
    }
    SeMantieneEnPantalla.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().actualiza) {
            if (this.receptor.izquierda > pilas.opciones.ancho / 2)
                this.receptor.derecha = -pilas.opciones.ancho / 2;

            if (this.receptor.derecha < -pilas.opciones.ancho / 2)
                this.receptor.izquierda = pilas.opciones.ancho / 2;

            if (this.receptor.abajo > pilas.opciones.alto / 2)
                this.receptor.arriba = -pilas.opciones.alto / 2;

            if (this.receptor.arriba < -pilas.opciones.alto / 2)
                this.receptor.abajo = pilas.opciones.alto / 2;
        }
    };
    return SeMantieneEnPantalla;
})(Habilidad);

/**
* @class Habilidades
*
* Representa todas las habilidades conocidas en pilas-engine.
*/
var Habilidades = (function () {
    function Habilidades() {
        this.Arrastrable = Arrastrable;
        this.PuedeExplotar = PuedeExplotar;
        this.SeguirAlMouse = SeguirAlMouse;
        this.SeguirClicks = SeguirClicks;
        this.MoverseConElTeclado = MoverseConElTeclado;
        this.MoverseConElTecladoConRotacion = MoverseConElTecladoConRotacion;
        this.SeMantieneEnPantalla = SeMantieneEnPantalla;
        this.Disparar = Disparar;
        this.RebotarComoPelota = RebotarComoPelota;
        this.RebotarComoCaja = RebotarComoCaja;
        this.Imitar = Imitar;
        this.ImitarPosicion = ImitarPosicion;
        this.ImitarAtributosNumericos = ImitarAtributosNumericos;
    }
    return Habilidades;
})();
/**
* @class Comportamiento
*
* Representa una habilidad que un actor puede aprender.
*/
var Comportamiento = (function () {
    function Comportamiento(argumentos) {
        this.argumentos = argumentos;
    }
    Comportamiento.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
    };

    Comportamiento.prototype.actualizar = function () {
    };

    Comportamiento.prototype.eliminar = function () {
    };
    return Comportamiento;
})();

var AvanzarComoProyectil = (function (_super) {
    __extends(AvanzarComoProyectil, _super);
    function AvanzarComoProyectil() {
        _super.apply(this, arguments);
    }
    AvanzarComoProyectil.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.velocidad = this.argumentos.velocidad || 2;
        var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.receptor.rotacion);
        this.dx = Math.cos(rotacion_en_radianes);
        this.dy = Math.sin(rotacion_en_radianes);
    };

    AvanzarComoProyectil.prototype.actualizar = function () {
        this.receptor.x += this.dx * this.velocidad;
        this.receptor.y += this.dy * this.velocidad;
    };
    return AvanzarComoProyectil;
})(Comportamiento);

var Avanzar = (function (_super) {
    __extends(Avanzar, _super);
    function Avanzar() {
        _super.apply(this, arguments);
    }
    Avanzar.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.pasos = Math.abs(this.argumentos.pasos);
        this.velocidad = this.argumentos.velocidad || 5;
        var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.receptor.rotacion);
        this.dx = Math.cos(rotacion_en_radianes);
        this.dy = Math.sin(rotacion_en_radianes);
    };

    Avanzar.prototype.actualizar = function () {
        if (this.pasos > 0) {
            if (this.pasos - this.velocidad < 0) {
                var avance = this.pasos;
            } else {
                var avance = this.velocidad;
            }

            this.pasos -= avance;
            this.receptor.x += this.dx * avance;
            this.receptor.y += this.dy * avance;
        } else {
            return true;
        }
    };
    return Avanzar;
})(Comportamiento);

var Girar = (function (_super) {
    __extends(Girar, _super);
    function Girar() {
        _super.apply(this, arguments);
    }
    Girar.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.angulo = this.argumentos.angulo || 360;
        this.tiempo = this.argumentos.tiempo || 1;
        this.angulo_aux = this.receptor.rotacion + this.angulo;
    };

    Girar.prototype.actualizar = function () {
        pilas.interpolar(this.receptor, "rotacion", [this.angulo_aux], this.tiempo);
        if (this.angulo_aux == this.receptor.rotacion) {
            return true;
        }
    };
    return Girar;
})(Comportamiento);

var Saltar = (function (_super) {
    __extends(Saltar, _super);
    function Saltar() {
        _super.apply(this, arguments);
    }
    Saltar.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.suelo = this.receptor.y;
        this.velocidad_inicial = this.argumentos.velocidad_inicial || 10;
        this.velocidad = this.velocidad_inicial;
        this.velocidad_aux = this.velocidad_inicial;
        this.cuando_termina = this.argumentos.cuando_termina || null;
        this.sonido_saltar = pilas.sonidos.cargar('saltar.wav');
        this.sonido_saltar.reproducir();
    };

    Saltar.prototype.actualizar = function () {
        this.receptor.y += this.velocidad;
        this.velocidad -= 0.3;

        if (this.receptor.y <= this.suelo) {
            this.velocidad_aux /= 2.0;
            this.velocidad = this.velocidad_aux;

            if (this.velocidad_aux <= 1) {
                this.receptor.y = this.suelo;
                if (this.cuando_termina) {
                    this.cuando_termina.call(this.receptor);
                }
                return true;
            }
        }
    };
    return Saltar;
})(Comportamiento);

var Saltando = (function (_super) {
    __extends(Saltando, _super);
    function Saltando() {
        _super.apply(this, arguments);
    }
    Saltando.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.dy = 10;
        this.suelo = this.receptor.y;
        this.cuando_termina = this.argumentos.cuando_termina || null;
    };

    Saltando.prototype.actualizar = function () {
        this.receptor.y += this.dy;
        this.dy -= 0.3;

        if (this.receptor.y < this.suelo) {
            this.receptor.y = this.suelo;
            if (this.cuando_termina) {
                this.cuando_termina.call(this.receptor);
            }
            return true;
        }

        if (pilas.escena_actual().control.derecha)
            this.receptor.x += 1;
        else if (pilas.escena_actual().control.izquierda)
            this.receptor.x -= 1;
    };
    return Saltando;
})(Comportamiento);

var Orbitar = (function (_super) {
    __extends(Orbitar, _super);
    function Orbitar() {
        _super.apply(this, arguments);
    }
    Orbitar.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.punto_de_orbita_x = this.argumentos.punto_de_orbita_x || 0;
        this.punto_de_orbita_y = this.argumentos.punto_de_orbita_y || 0;
        this.radio = this.argumentos.radio || 10;
        this.velocidad = this.argumentos.velocidad || .0001;
        this.direccion = this.argumentos.direccion || "derecha";
        this.angulo = 0;

        if (this.direccion == "izquierda") {
            this.velocidad = -this.velocidad;
        } else if (this.direccion == "derecha") {
            this.velocidad;
        }
    };

    Orbitar.prototype.actualizar = function () {
        this.angulo += this.velocidad;
        this.mover_astro();
    };

    Orbitar.prototype.mover_astro = function () {
        this.receptor.x = this.punto_de_orbita_x + (Math.cos(pilas.utils.convertir_a_grados(this.angulo)) * this.radio);

        this.receptor.y = this.punto_de_orbita_y - (Math.sin(pilas.utils.convertir_a_grados(this.angulo)) * this.radio);
    };
    return Orbitar;
})(Comportamiento);

var OrbitarSobreActor = (function (_super) {
    __extends(OrbitarSobreActor, _super);
    function OrbitarSobreActor() {
        _super.apply(this, arguments);
    }
    OrbitarSobreActor.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.punto_de_orbita_x = this.argumentos.actor.x;
        this.punto_de_orbita_y = this.argumentos.actor.y;
    };

    OrbitarSobreActor.prototype.actualizar = function () {
        this.punto_de_orbita_x = this.argumentos.actor.x;
        this.punto_de_orbita_y = this.argumentos.actor.y;
        _super.prototype.actualizar.call(this);
    };
    return OrbitarSobreActor;
})(Orbitar);

var CaminarBase = (function (_super) {
    __extends(CaminarBase, _super);
    function CaminarBase() {
        _super.apply(this, arguments);
    }
    CaminarBase.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.pasos = this.argumentos.pasos || 1;
        this.velocidad = 1;
        var pasitos = 0.05;
        this.cantActualizaciones = Math.round(this.pasos / pasitos);
    };

    CaminarBase.prototype.actualizar = function () {
        this.mover();
        this.cantActualizaciones--;
        if (this.cantActualizaciones < 1) {
            this.receptor.detener_animacion();
            return true;
        }
    };

    CaminarBase.prototype.mover = function () {
    };
    return CaminarBase;
})(Comportamiento);

var CaminaArriba = (function (_super) {
    __extends(CaminaArriba, _super);
    function CaminaArriba() {
        _super.apply(this, arguments);
    }
    CaminaArriba.prototype.mover = function () {
        this.receptor.mover(0, this.velocidad);
    };
    return CaminaArriba;
})(CaminarBase);

var CaminaAbajo = (function (_super) {
    __extends(CaminaAbajo, _super);
    function CaminaAbajo() {
        _super.apply(this, arguments);
    }
    CaminaAbajo.prototype.mover = function () {
        this.receptor.mover(0, -this.velocidad);
    };
    return CaminaAbajo;
})(CaminarBase);

var CaminaIzquierda = (function (_super) {
    __extends(CaminaIzquierda, _super);
    function CaminaIzquierda() {
        _super.apply(this, arguments);
    }
    CaminaIzquierda.prototype.mover = function () {
        this.receptor.mover(-this.velocidad, 0);
    };
    return CaminaIzquierda;
})(CaminarBase);

var CaminaDerecha = (function (_super) {
    __extends(CaminaDerecha, _super);
    function CaminaDerecha() {
        _super.apply(this, arguments);
    }
    CaminaDerecha.prototype.mover = function () {
        this.receptor.mover(this.velocidad, 0);
    };
    return CaminaDerecha;
})(CaminarBase);

/**
* @class Secuencia
*
* Representa una secuencia de comportamientos que un actor realiza de forma ordenada.
*
* Espera una lista de comportamientos.
*/
var Secuencia = (function (_super) {
    __extends(Secuencia, _super);
    function Secuencia() {
        _super.apply(this, arguments);
    }
    Secuencia.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.secuencia = this.argumentos.secuencia;
        this.reiniciar = true;
    };

    Secuencia.prototype.actualizar = function () {
        if (this.reiniciar) {
            this.reiniciar = false;
            this.comando_actual = 0;
            if (this.secuencia.length > 0) {
                this.secuencia[0].iniciar(this.receptor);
            }
        }

        if (this.secuencia.length > 0 && this.comando_actual < this.secuencia.length) {
            var finished = this.secuencia[this.comando_actual].actualizar();
            if (finished) {
                this.comando_actual++;
                if (this.comando_actual < this.secuencia.length) {
                    this.secuencia[this.comando_actual].iniciar(this.receptor);
                }
            }
        } else {
            this.reiniciar = true; // para reiniciar la secuencia en la proxima ejecucion
            return true;
        }
    };
    return Secuencia;
})(Comportamiento);

/**
* @class Alternativa
*
* Representa un if-then-else entre dos comportamientos. Se ejecuta uno u otro dependiendo de una condicion.
*
* Recibe como argumentos dos comportamientos de tipo Secuencia y una funcion booleana a evaluar.
*/
var Alternativa = (function (_super) {
    __extends(Alternativa, _super);
    function Alternativa() {
        _super.apply(this, arguments);
    }
    Alternativa.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.rama_entonces = this.argumentos.entonces;
        this.rama_sino = this.argumentos.sino;
        this.condicion = this.argumentos.condicion;
        this.ejecutado = false;
    };

    Alternativa.prototype.actualizar = function () {
        if (!this.ejecutado) {
            this.ejecutado = true;
            if (this.condicion()) {
                this.rama_elegida = this.rama_entonces;
            } else {
                this.rama_elegida = this.rama_sino;
            }
            this.rama_elegida.iniciar(this.receptor);
        }

        var finished = this.rama_elegida.actualizar();
        if (finished) {
            // para que se vuelva a evaluar la condicion si vuelven a llamar a este comportamiento
            this.ejecutado = false;

            return true;
        }
    };
    return Alternativa;
})(Comportamiento);

/**
* @class RepetirHasta
*
* Representa un bucle condicional que repite un comportamiento hasta que se cumple cierta condicion.
*
* Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
*/
var RepetirHasta = (function (_super) {
    __extends(RepetirHasta, _super);
    function RepetirHasta() {
        _super.apply(this, arguments);
    }
    RepetirHasta.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.secuencia = this.argumentos.secuencia;
        this.condicion = this.argumentos.condicion;
        this.secuencia.iniciar(receptor);
        this.evaluar_condicion = true;
    };

    RepetirHasta.prototype.actualizar = function () {
        if (this.evaluar_condicion) {
            this.evaluar_condicion = false;
            if (this.condicion()) {
                this.evaluar_condicion = true; // se resetea antes de salir, para volvese a evaluar
                return true;
            }
        }

        var termino = this.secuencia.actualizar();

        if (termino) {
            this.evaluar_condicion = true;
        }
    };
    return RepetirHasta;
})(Comportamiento);

/**
* @class RepetirN
*
* Representa un bucle que repite una cierta cantidad de veces un comportamiento
*
* Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
*/
var RepetirN = (function (_super) {
    __extends(RepetirN, _super);
    function RepetirN() {
        _super.apply(this, arguments);
    }
    RepetirN.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.secuencia = this.argumentos.secuencia;
        this.cantidad = this.argumentos.cantidad;
        this.secuencia.iniciar(receptor);
        this.volver_a_evaluar = true;
    };

    RepetirN.prototype.actualizar = function () {
        if (this.volver_a_evaluar) {
            this.volver_a_evaluar = false;
            this.cantidad_actual = this.cantidad();
        }

        if (this.cantidad_actual == 0) {
            this.volver_a_evaluar = true;
            return true;
        }

        var termino = this.secuencia.actualizar();
        if (termino) {
            this.cantidad_actual--;
        }
    };
    return RepetirN;
})(Comportamiento);

/**
* @class CambiarAtributo
*
* Representa el cambio de un atributo del actor
*
* Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
*/
var CambiarAtributo = (function (_super) {
    __extends(CambiarAtributo, _super);
    function CambiarAtributo() {
        _super.apply(this, arguments);
    }
    CambiarAtributo.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;
        this.funcion_valor = this.argumentos.valor;
    };

    CambiarAtributo.prototype.actualizar = function () {
        this.receptor.set_atributo(this.nombre, this.funcion_valor());
        return true;
    };
    return CambiarAtributo;
})(Comportamiento);

/**
* @class CambiarVariableLocal
*
* Representa el cambio de una variable local del procedimiento actual
*
* Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
*/
var CambiarVariableLocal = (function (_super) {
    __extends(CambiarVariableLocal, _super);
    function CambiarVariableLocal() {
        _super.apply(this, arguments);
    }
    CambiarVariableLocal.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;
        this.funcion_valor = this.argumentos.valor;
    };

    CambiarVariableLocal.prototype.actualizar = function () {
        this.receptor.set_variable(this.nombre, this.funcion_valor());
        return true;
    };
    return CambiarVariableLocal;
})(Comportamiento);

/**
* @class LlamadaProcedimiento
*
* Representa una llamada a un procedimiento
*
* Recibe como argumentos el nombre del procedimiento y el contexto de
* definiciones
*/
var LlamadaProcedimiento = (function (_super) {
    __extends(LlamadaProcedimiento, _super);
    function LlamadaProcedimiento() {
        _super.apply(this, arguments);
    }
    LlamadaProcedimiento.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;

        // consigue parametros y nombre de esta definicion
        var p = this.argumentos.procedimientos[this.nombre];

        // construye el scope para los argumentos
        var args_evaluados = {};
        for (var i = 0; i < p.parametros.length; i++) {
            var arg_evaluado = this.argumentos.argumentos[i]();
            args_evaluados[p.parametros[i]] = arg_evaluado;
        }
        this.receptor.push_parametros(args_evaluados);

        // inicializa el scope de variables locales
        this.receptor.push_variables({});

        // genera una nueva secuencia a ejecutar
        this.secuencia = new Secuencia({ secuencia: p.secuencia });
        this.secuencia.iniciar(this.receptor);
    };

    LlamadaProcedimiento.prototype.actualizar = function () {
        var termino = this.secuencia.actualizar();
        if (termino) {
            this.receptor.pop_parametros();
            this.receptor.pop_variables();
            return true;
        }
    };
    return LlamadaProcedimiento;
})(Comportamiento);

/**
* @class LlamadaProcPrimitivo
*
* Representa una llamada a una primitiva.
*
* Existe para que se evalúen los parámetros de la primitiva
* recién al momento de ejecución y no antes.
* Es decorator de un comportamiento.
*/
var LlamadaProcPrimitivo = (function (_super) {
    __extends(LlamadaProcPrimitivo, _super);
    function LlamadaProcPrimitivo() {
        _super.apply(this, arguments);
    }
    LlamadaProcPrimitivo.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.comportamientoInstanciado = new this.argumentos.comportamiento(this.argumentos.argumentos());
        this.comportamientoInstanciado.iniciar(receptor);
    };

    LlamadaProcPrimitivo.prototype.actualizar = function () {
        return this.comportamientoInstanciado.actualizar();
    };
    return LlamadaProcPrimitivo;
})(Comportamiento);

/**
* @class Expresion
*
* Representa la evaluacion de una expresion
*
* Recibe como argumento la expresión a evaluar
*/
var Expresion = (function (_super) {
    __extends(Expresion, _super);
    function Expresion() {
        _super.apply(this, arguments);
    }
    Expresion.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.expresion = this.argumentos.expresion;
    };

    Expresion.prototype.actualizar = function () {
        this.resultado = this.expresion();
        return true;
    };
    return Expresion;
})(Comportamiento);

/**
* @class LlamadaFuncion
*
* Representa una llamada a una funcion
*
* Recibe como argumentos el nombre de la funcion, el contexto de
* definiciones de funciones y la expresión a retornar
*/
var LlamadaFuncion = (function (_super) {
    __extends(LlamadaFuncion, _super);
    function LlamadaFuncion() {
        _super.apply(this, arguments);
    }
    LlamadaFuncion.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;
        var s = this.argumentos.funciones[this.nombre].secuencia;
        this.secuencia = new Secuencia({ secuencia: s });
        this.secuencia.iniciar(this.receptor);
    };

    LlamadaFuncion.prototype.actualizar = function () {
        var termino = this.secuencia.actualizar();
        if (termino) {
            this.resultado = this.expresion();
            return true;
        }
    };
    return LlamadaFuncion;
})(Expresion);

/**
* @class ConstructorDePrograma
*
* Permite construir un comportamiento que representa un programa
*
**/
var ConstructorDePrograma = (function () {
    function ConstructorDePrograma() {
        this.stack_secuencias = [];
        this.procedimientos = {};
        this.funciones = {};
    }
    ConstructorDePrograma.prototype.empezar_secuencia = function () {
        this.stack_secuencias.push([]);
    };

    ConstructorDePrograma.prototype.hacer = function (comportamiento, argumentos) {
        this.stack_secuencias[this.stack_secuencias.length - 1].push(new comportamiento(argumentos));
    };

    ConstructorDePrograma.prototype.terminar_secuencia = function () {
        var s = this.stack_secuencias.pop();
        this.stack_secuencias.push(new Secuencia({ secuencia: s }));
    };

    ConstructorDePrograma.prototype.repetir_hasta = function (c) {
        this.terminar_secuencia();
        var s = this.stack_secuencias.pop();
        this.hacer(RepetirHasta, { secuencia: s, condicion: c });
    };

    ConstructorDePrograma.prototype.alternativa_si = function (c) {
        this.terminar_secuencia();
        var s = this.stack_secuencias.pop();
        this.hacer(Alternativa, { entonces: s, sino: new Secuencia({ secuencia: [] }), condicion: c });
    };

    ConstructorDePrograma.prototype.alternativa_sino = function (c) {
        this.terminar_secuencia();
        var s2 = this.stack_secuencias.pop();
        this.terminar_secuencia();
        var s1 = this.stack_secuencias.pop();
        this.hacer(Alternativa, { entonces: s1, sino: s2, condicion: c });
    };

    ConstructorDePrograma.prototype.repetirN = function (n) {
        this.terminar_secuencia();
        var s = this.stack_secuencias.pop();
        this.hacer(RepetirN, { secuencia: s, cantidad: n });
    };

    ConstructorDePrograma.prototype.def_proc = function (n, params) {
        // no creo un comportamiento de
        // tipo secuencia como en las estructuras de control
        // porque dicho objeto deberia crearse recien
        // en la llamada al procedimiento
        var s = this.stack_secuencias.pop();
        this.procedimientos[n] = { secuencia: s, parametros: params };
    };

    ConstructorDePrograma.prototype.llamada_proc = function (n, proc_args) {
        var procs = this.procedimientos;
        this.hacer(LlamadaProcedimiento, { nombre: n, procedimientos: procs, argumentos: proc_args });
    };

    ConstructorDePrograma.prototype.llamada_proc_primitivo = function (comportamiento, argsSinEvaluar) {
        this.hacer(LlamadaProcPrimitivo, { comportamiento: comportamiento, argumentos: argsSinEvaluar });
    };

    ConstructorDePrograma.prototype.def_func = function (n) {
        var s = this.stack_secuencias.pop();
        this.funciones[n] = s;
    };

    ConstructorDePrograma.prototype.llamada_func = function (n, exp) {
        var funcs = this.funciones;
        this.hacer(LlamadaFuncion, { nombre: n, funciones: funcs, expresion: exp });
    };

    ConstructorDePrograma.prototype.cambio_atributo = function (n, f) {
        this.hacer(CambiarAtributo, { nombre: n, valor: f });
    };

    ConstructorDePrograma.prototype.cambio_variable = function (n, f) {
        this.hacer(CambiarVariableLocal, { nombre: n, valor: f });
    };

    ConstructorDePrograma.prototype.inyectar_scopes = function (actor) {
        this.inyectar_parametros(actor);
        this.inyectar_atributos(actor);
        this.inyectar_variables_locales(actor);
    };

    ConstructorDePrograma.prototype.inyectar_parametros = function (actor) {
        actor.scope_parametros = [{}];
        actor.scope_parametros_actual = {};

        actor.push_parametros = function (ids) {
            this.scope_parametros.push(ids);
            this.scope_parametros_actual = ids;
        };

        actor.pop_parametros = function () {
            // pierdo el contexto actual (no me interesa, ya termino el procedimiento)
            this.scope_parametros.pop();

            // vuelvo al contexto anterior (que es el ultimo de la lista)
            this.scope_parametros_actual = this.scope_parametros[this.scope_parametros.length - 1];
        };

        actor.parametro = function (n) {
            return this.scope_parametros_actual[n];
        };
    };

    ConstructorDePrograma.prototype.inyectar_variables_locales = function (actor) {
        actor.scope_var_locales = [{}];
        actor.scope_var_locales_actual = {};

        actor.push_variables = function (ids) {
            this.scope_var_locales.push(ids);
            this.scope_var_locales_actual = ids;
        };

        actor.pop_variables = function () {
            this.scope_var_locales_actual = this.scope_var_locales.pop();
        };

        actor.set_variable = function (v, x) {
            actor.scope_var_locales_actual[v] = x;
        };

        actor.variable = function (n) {
            return this.scope_var_locales_actual[n];
        };
    };

    ConstructorDePrograma.prototype.inyectar_atributos = function (actor) {
        actor.atributos_programa = {};

        actor.set_atributo = function (v, x) {
            actor.atributos_programa[v] = x;
        };

        actor.atributo = function (v) {
            return actor.atributos_programa[v];
        };
    };

    ConstructorDePrograma.prototype.ejecutar = function (actor) {
        // obtiene el programa
        this.terminar_secuencia();
        var p = this.stack_secuencias.pop();

        // inyecta scopes para atributos, variables locales y parametros
        this.inyectar_scopes(actor);
        actor.hacer_luego(Programa, { programa: p });
    };
    return ConstructorDePrograma;
})();

var Programa = (function (_super) {
    __extends(Programa, _super);
    function Programa() {
        _super.apply(this, arguments);
    }
    Programa.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.programa = this.argumentos.programa;
        this.programa.iniciar(this.receptor);
    };

    Programa.prototype.actualizar = function () {
        var programa_terminado = this.programa.actualizar();
        if (programa_terminado) {
            return true;
        }
    };
    return Programa;
})(Comportamiento);

/**
* @class Comportamientos
*
* Representa todos los comportamientos que puede hacer un actor en pilas-engine.
*/
var Comportamientos = (function () {
    function Comportamientos() {
        this.CaminarBase = CaminarBase;
        this.CaminaArriba = CaminaArriba;
        this.CaminaAbajo = CaminaAbajo;
        this.CaminaIzquierda = CaminaIzquierda;
        this.CaminaDerecha = CaminaDerecha;
        this.Orbitar = Orbitar;
        this.OrbitarSobreActor = OrbitarSobreActor;
        this.Saltar = Saltar;
        this.Girar = Girar;
        this.Avanzar = Avanzar;
        this.AvanzarComoProyectil = AvanzarComoProyectil;
        this.Saltando = Saltando;
        this.Secuencia = Secuencia;
        this.Alternativa = Alternativa;
        this.RepetirHasta = RepetirHasta;
        this.RepetirN = RepetirN;
        this.ConstructorDePrograma = ConstructorDePrograma;
        this.Programa = Programa;
    }
    return Comportamientos;
})();
var Colisiones = (function () {
    function Colisiones() {
        this.colisiones = [];
    }
    Colisiones.prototype.agregar = function (grupo_a, grupo_b, funcion_a_llamar, parent) {
        if (typeof parent === "undefined") { parent = undefined; }
        if (grupo_a.length === undefined)
            grupo_a = [grupo_a];

        if (grupo_b.length === undefined)
            grupo_b = [grupo_b];

        this.colisiones.push({ grupo_a: grupo_a, grupo_b: grupo_b, callback: funcion_a_llamar, parent: parent });
    };

    Colisiones.prototype.verificar_colisiones = function () {
        for (var i = 0; i < this.colisiones.length; i++) {
            this._verificar_colisiones_en_tupla(this.colisiones[i]);
        }
    };

    Colisiones.prototype._verificar_colisiones_en_tupla = function (tupla) {
        for (var i = 0; i < tupla.grupo_a.length; i++) {
            for (var j = 0; j < tupla.grupo_b.length; j++) {
                var actor_a = tupla.grupo_a[i];
                var actor_b = tupla.grupo_b[j];

                if (actor_a.vivo && actor_b.vivo && actor_a.colisiona_con(actor_b)) {
                    tupla.callback.call(tupla.parent, actor_a, actor_b);
                    if (!actor_a.vivo)
                        tupla.grupo_a.splice(i, 1);
                    if (!actor_b.vivo)
                        tupla.grupo_b.splice(j, 1);
                }
            }
        }
    };
    return Colisiones;
})();
var colores = (function () {
    function colores() {
        //Colores principales.
        this.negro = createjs.Graphics.getRGB(0, 0, 0);
        this.blanco = createjs.Graphics.getRGB(255, 255, 255);
        this.rojo = createjs.Graphics.getRGB(255, 0, 0);
        this.verde = createjs.Graphics.getRGB(0, 255, 0);
        this.azul = createjs.Graphics.getRGB(0, 0, 255);
        this.gris = createjs.Graphics.getRGB(128, 128, 128);

        //Colores secundarios
        this.amarillo = createjs.Graphics.getRGB(255, 255, 0);
        this.magenta = createjs.Graphics.getRGB(255, 0, 255);
        this.cyan = createjs.Graphics.getRGB(0, 255, 255);
        this.grisclaro = createjs.Graphics.getRGB(192, 192, 192);
        this.grisoscuro = createjs.Graphics.getRGB(100, 100, 100);
        this.verdeoscuro = createjs.Graphics.getRGB(0, 128, 0);
        this.azuloscuro = createjs.Graphics.getRGB(0, 0, 128);
        this.naranja = createjs.Graphics.getRGB(255, 200, 0);
        this.rosa = createjs.Graphics.getRGB(255, 175, 175);
        this.violeta = createjs.Graphics.getRGB(128, 0, 255);
        this.marron = createjs.Graphics.getRGB(153, 102, 0);

        //Colores transparentes
        this.negro_transparente = createjs.Graphics.getRGB(0, 0, 0, 0.5);
        this.blanco_transparente = createjs.Graphics.getRGB(255, 255, 255, 0.5);
        this.rojo_transparente = createjs.Graphics.getRGB(255, 0, 0, 0.5);
        this.verde_transparente = createjs.Graphics.getRGB(0, 255, 0, 0.5);
        this.azul_transparente = createjs.Graphics.getRGB(0, 0, 255, 0.5);
        this.gris_transparente = createjs.Graphics.getRGB(128, 128, 128, 0.5);
    }
    return colores;
})();
var tareas = (function () {
    function tareas() {
        this.Tareas = Tareas;
    }
    return tareas;
})();

var Tarea = (function () {
    function Tarea(tiempo, funcion, una_vez, parametros, parent) {
        this.tiempo = tiempo;
        this.tiempo_aux = tiempo;
        this.funcion = funcion;
        this.una_vez = una_vez;
        this.parametros = parametros;
        this.parent = parent;
    }
    Tarea.prototype.ejecutar = function () {
        this.funcion.call(this.parent, this.parametros);
    };
    return Tarea;
})();

var Tareas = (function () {
    function Tareas() {
        this.tareas_planificadas = [];
        this.contador_de_tiempo = 0;
    }
    Tareas.prototype._agregar_tarea = function (tarea) {
        this.tareas_planificadas.push(tarea);
    };

    Tareas.prototype.siempre = function (tiempo, funcion, parametros, parent) {
        var tarea = new Tarea(this.contador_de_tiempo + tiempo, funcion, false, parametros, parent);
        tarea.tiempo_aux = tiempo;
        this._agregar_tarea(tarea);
    };

    Tareas.prototype.una_vez = function (tiempo, funcion, parametros, parent) {
        var tarea = new Tarea(this.contador_de_tiempo + tiempo, funcion, true, parametros, parent);
        this._agregar_tarea(tarea);
    };

    Tareas.prototype.actualizar = function () {
        this.contador_de_tiempo += (1 / 60);
        for (var i = 0; i < this.tareas_planificadas.length; i++) {
            if (this.contador_de_tiempo > this.tareas_planificadas[i].tiempo) {
                this.tareas_planificadas[i].ejecutar();

                if (this.tareas_planificadas[i].una_vez) {
                    this.tareas_planificadas.splice(i, 1);
                } else {
                    this.tareas_planificadas[i].tiempo += this.tareas_planificadas[i].tiempo_aux;
                }
            }
        }
    };
    return Tareas;
})();
/*
*  Modulo sonidos:
*
*  Hay una instancia de la clase sonidos al momento de iniciar pilas
*  posteriormente para cargar y reproducir un sonido se debe de hacer lo siguiente:
*
*  1.- cargar el sonido en la función cargar_recursos() con ayuda de cargar_recurso(...)
*    Por ejemplo: cargar_recurso("smile.ogg")
*
*  2.- Simulamos la carga del sonido lo más parecido a la versión Python, así que:
*    cuando deseamos usar el sonido hacemos lo siguiente:
*    var mi_sonido = pilas.sonidos.cargar("smile.ogg")
*
*  3.- Por ultima para reproducir el sonido:
*    mi_sonido.reproducir()
*/
var Sonidos = (function () {
    function Sonidos(data_path) {
        this.recursos = [];
        this.preload = new createjs.LoadQueue(true, data_path + "/");
        this.preload.installPlugin(createjs.Sound);
        this.cargar_recursos();
    }
    Sonidos.prototype.cargar_recursos = function () {
        this.cargar_recurso('audio/smile.ogg');
        this.cargar_recurso('audio/shout.ogg');
        this.cargar_recurso('audio/saltar.wav');
        this.cargar_recurso('audio/blabla.wav');
        this.preload.loadManifest(this.recursos);
    };

    Sonidos.prototype.cargar_recurso = function (nombre) {
        this.recursos.push({ id: nombre, src: nombre });
    };

    Sonidos.prototype.cargar = function (nombre) {
        return new Sonido(nombre);
    };
    return Sonidos;
})();

var Sonido = (function () {
    function Sonido(nombre) {
        this.nombre = nombre;
    }
    Sonido.prototype.reproducir = function (repetir) {
        if (typeof repetir === "undefined") { repetir = false; }
        if (repetir) {
            return createjs.Sound.play(this.nombre, createjs.Sound.INTERRUPT_ANY, 0, 0, -1);
        } else {
            return createjs.Sound.play(this.nombre, createjs.Sound.INTERRUPT_ANY);
        }
    };

    Sonido.prototype.detener = function () {
        return createjs.Sound.stop(this.nombre);
    };
    return Sonido;
})();
var Rutinas = (function () {
    function Rutinas() {
        this.lista_de_rutinas = [];
    }
    Rutinas.prototype.observar_tareas = function (elemento_id, intervalo) {
        var el = document.getElementById(elemento_id);
        var ctx = this;

        function cargar_contenido() {
            var buffer = "";

            ctx.lista_de_rutinas.forEach(function (e) {
                buffer += e.nombre + " - contador: " + e.contador + "\n";
            });

            el.innerHTML = buffer;
            setTimeout(cargar_contenido, intervalo);
        }

        cargar_contenido();
    };

    Rutinas.prototype.agregar = function (nombre, actor, init, update) {
        var time = new Date();

        var rutina = {
            id: Math.random(),
            nombre: nombre,
            init: init,
            update: update,
            tiempo: time,
            actor: actor,
            contador: 0,
            contexto: { actor: actor },
            eliminada: false
        };

        console.log(rutina);

        init.call(rutina.contexto);
        this.lista_de_rutinas.push(rutina);
    };

    Rutinas.prototype.actualizar = function () {
        var a_eliminar = [];

        this.lista_de_rutinas.forEach(function (e) {
            e.contador += 1;
            var retorno = e.update.call(e.contexto);

            if (retorno === true) {
                e.eliminada = true;
            }
        });

        this.lista_de_rutinas = this.lista_de_rutinas.filter(function (item) {
            return (!item.eliminada);
        });
    };
    return Rutinas;
})();
/// <reference path="actores.ts" />
/// <reference path="utils.ts" />
/// <reference path="grupo.ts" />
/// <reference path="fondos.ts" />
/// <reference path="imagenes.ts" />
/// <reference path="mundo.ts" />
/// <reference path="escenas.ts" />
/// <reference path="interpolaciones.ts" />
/// <reference path="habilidades.ts" />
/// <reference path="comportamientos.ts" />
/// <reference path="colisiones.ts" />
/// <reference path="colores.ts" />
/// <reference path="tareas.ts" />
/// <reference path="sonidos.ts" />
/// <reference path="evento.ts" />
/// <reference path="rutinas.ts" />

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
    function Pilas() {
    }
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
    Pilas.prototype.iniciar = function (opciones) {
        this.inicializar_opciones(opciones);
        this.actores = new Actores(this);
        this.habilidades = new Habilidades();
        this.comportamientos = new Comportamientos();
        this.obtener_canvas();
        this.definir_tamano_del_canvas();
        this.conectar_eventos();

        this.imagenes = new Imagenes(this.onready, this.opciones);
        this.fondos = new Fondos();
        this.mundo = new Mundo();
        this.interpolaciones = new Interpolaciones();
        this.utils = new Utils();
        this.grupo = new grupo();
        this.colisiones = new Colisiones();
        this.colores = new colores();
        this.sonidos = new Sonidos(this.opciones.data_path);
        this.escena = new escena();
        this.tareas = new tareas();
        this.rutinas = new Rutinas();

        this.mundo.gestor_escenas.cambiar_escena(new Normal());

        this.eventos = new ProxyEventos();

        // Deshabilita el interpolado de pixels.
        var ctx = this.canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        this.ready = false;
    };

    Pilas.prototype.observar_tareas = function (elemento_id, intervalo) {
        this.rutinas.observar_tareas(elemento_id, intervalo);
    };

    Pilas.prototype.reiniciar = function () {
        // TODO: hacer que el fondo sea un atributo de la escena y que
        // siempre se inicialice ahí, y no en la función onload del lado del
        // usuario como hace ahora...
        this.mundo.gestor_escenas.cambiar_escena(new Normal());
        var fondo = new pilas.fondos.Plano();
    };

    /**
    * @method escena_actual
    * Retorna la escena en curso.
    */
    Pilas.prototype.escena_actual = function () {
        if (this.mundo === undefined) {
            console.log("epa!");
        } else {
            var escena = this.mundo.gestor_escenas.escena_actual();
            return escena;
        }
    };

    /**
    * @method inicializar_opciones
    * @private
    *
    * Carga las opciones iniciales y define los valores por omisión si es necesario.
    */
    Pilas.prototype.inicializar_opciones = function (opciones) {
        this.opciones = opciones || {};
        this.opciones.ancho = this.opciones.ancho || 320;
        this.opciones.alto = this.opciones.alto || 240;
        this.opciones.data_path = this.opciones.data_path || 'data';
        this.opciones.canvas_id = this.opciones.canvas_id || 'canvas';
        this.opciones.canvas = this.opciones.canvas || null;
        this.opciones.imagenesExtra = this.opciones.imagenesExtra || [];
    };

    /**
    * @method definir_tamano_del_canvas
    * @private
    *
    * Cambia el tamaño del canvas HTML en base a las opciones iniciales.
    */
    Pilas.prototype.definir_tamano_del_canvas = function () {
        this.canvas.width = this.opciones.ancho;
        this.canvas.height = this.opciones.alto;
    };

    /**
    * @method obtener_codigo_y_texto_desde_evento
    * @private
    *
    * A partir del evento de teclado, obtiene su codigo y el texto de
    * la tecla presionada.
    */
    Pilas.prototype.obtener_codigo_y_texto_desde_evento = function (event) {
        var codigo;
        var texto;

        if (typeof event.which == "number") {
            codigo = event.which;
        } else {
            codigo = event.keyCode;
        }

        texto = String.fromCharCode(codigo);

        return { codigo: codigo, texto: texto };
    };

    /**
    * @method conectar_eventos
    * @private
    *
    * Conecta los eventos del mouse y teclado a los métodos manejadores
    * de eventos de la escena actual.
    */
    Pilas.prototype.conectar_eventos = function () {
        this.canvas.onmousedown = function (event) {
            var posicion = pilas.obtener_posicion_desde_evento(this, event);
            pilas.escena_actual().click_de_mouse.emitir(posicion);
        };

        this.canvas.onmouseup = function (event) {
            var posicion = pilas.obtener_posicion_desde_evento(this, event);
            pilas.escena_actual().cuando_termina_click.emitir(posicion);
        };

        this.canvas.onmousemove = function (event) {
            var posicion = pilas.obtener_posicion_desde_evento(this, event);
            pilas.escena_actual().mueve_mouse.emitir(posicion);
        };

        window.onkeydown = function (event) {
            var e = pilas.obtener_codigo_y_texto_desde_evento(event);
            pilas.escena_actual().pulsa_tecla.emitir(e);
        };

        window.onkeyup = function (event) {
            var e = pilas.obtener_codigo_y_texto_desde_evento(event);
            pilas.escena_actual().suelta_tecla.emitir(e);
        };
    };

    /**
    * @method obtener_posicion_desde_evento
    * @private
    *
    * A partir del evento del mouse, obtiene la posicion del puntero en
    * las coordenadas de Pilas.
    */
    Pilas.prototype.obtener_posicion_desde_evento = function (canvas, event) {
        var escena = pilas.escena_actual();
        var camara = escena.camara;
        var posicion = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
        posicion.boton = event.which;

        return posicion;
    };

    /**
    * @method obtener_canvas
    * @private
    *
    * Obtiene la referencia al elemento HTML canvas usando
    * el atributo *canvas_id* de las opciones iniciales.
    */
    Pilas.prototype.obtener_canvas = function () {
        if (this.opciones.canvas !== null)
            this.canvas = this.opciones.canvas;
        else
            this.canvas = document.getElementById(this.opciones.canvas_id);

        if (!this.canvas)
            throw new Error("No se encuentra el elemento canvas (id='" + this.opciones.canvas_id + "'), especificalo con opciones como {canvas_id: 'id_del_canvas'}");
    };

    /**
    * @method onready
    * Callback que se invoca una vez que pilas puede comenzar a funcionar.
    */
    Pilas.prototype.onready = function () {
        console.warn("pilas-engine ha iniciado, pero el metodo onready está vacío. Tienes que sobre-escribirlo...");
    };

    /**
    * @method ejecutar
    * Pone en funcionamiento el bucle principal.
    */
    Pilas.prototype.ejecutar = function () {
        var self = this;

        // TODO: Limpiar los listeners con un mensaje y
        //       no accediendo directamente a la propiedad.
        createjs.Ticker.setFPS(60);
        var my_tick = function (event) {
            self.actualizar();
        };
        createjs.Ticker.addEventListener('tick', my_tick);
    };

    /**
    * @method actualizar
    * Se ejecuta automáticamente 60 veces por segundo, para mantener el juego en funcionamiento.
    */
    Pilas.prototype.actualizar = function () {
        try  {
            this.mundo.actualizar();
            this.rutinas.actualizar();
        } catch (err) {
            if (/The HTMLImageElement provided is in the 'broken' state/.test(err.message)) {
                console.error(err);
                console.error("Deteniendo la ejecución de pilas a causa de errores.");
                createjs.Ticker.removeAllEventListeners('tick');
            } else {
                throw err;
            }
        }
    };

    Pilas.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolaciones.interpolar(objeto, atributo, valor_o_valores, tiempo);
    };

    Pilas.prototype.definir_modos = function (modos) {
        this.mundo.definir_modos(modos);
    };

    Pilas.prototype.mostrar = function (nombreDelModo) {
        this.actualizar_modo(nombreDelModo, true);
        return "Mostrando " + nombreDelModo;
    };

    Pilas.prototype.ocultar = function (nombreDelModo) {
        this.actualizar_modo(nombreDelModo, false);
        return "Ocultando " + nombreDelModo;
    };

    Pilas.prototype.actualizar_modo = function (nombreDelModo, bool) {
        var modos = this.mundo.obtener_modos();
        modos[nombreDelModo] = bool;
        this.definir_modos(modos);
    };

    Pilas.prototype.mostrar_posiciones = function () {
        this.mostrar("puntos_de_control");
        return "Mostrando posiciones";
    };

    Pilas.prototype.ocultar_posiciones = function () {
        this.ocultar("puntos_de_control");
        return "Ocultando posiciones";
    };

    Pilas.prototype.mostrar_fisica = function () {
        this.mostrar("fisica");
        return "Mostrando fisica";
    };

    Pilas.prototype.ocultar_fisica = function () {
        this.ocultar("fisica");
        return "Ocultando fisica";
    };

    /**
    * @method obtener_actores_en
    * Se ejecuta para conseguir una lista de todos los actores que estén en una
    * coordenanda determinada de la pantalla.
    *
    * Opcionalmente se puede espeficiar una etiqueta a modo de filtro, con el
    * parámetro "con_etiqueta".
    *
    * ejemplos de invocaciones:
    *
    *     >>> pilas.obtener_actores_en(0, 0)
    *     [Actor, Mono, Fondo]
    *
    *     >>> pilas.obtener_actores_en(0, 0, 'Mono')
    *     [Mono]
    *
    */
    Pilas.prototype.obtener_actores_en = function (x, y, con_etiqueta) {
        if (typeof con_etiqueta === "undefined") { con_etiqueta = undefined; }
        var actores = [];

        for (var i = 0; i < this.escena_actual().actores.length; i++) {
            var actor = this.escena_actual().actores[i];

            if (actor.colisiona_con_un_punto(x, y)) {
                if (con_etiqueta) {
                    if (actor.tiene_etiqueta(con_etiqueta))
                        actores.push(actor);
                } else {
                    actores.push(actor);
                }
            }
        }

        return actores;
    };

    Pilas.prototype.obtener_actores_con_etiqueta = function (etiqueta) {
        var actores = [];

        for (var i = 0; i < this.escena_actual().actores.length; i++) {
            var actor = this.escena_actual().actores[i];

            if (actor.tiene_etiqueta(etiqueta))
                actores.push(actor);
        }

        return actores;
    };

    Pilas.prototype.izquierda = function () {
        return 0 - this.opciones.ancho / 2;
    };

    Pilas.prototype.derecha = function () {
        return this.opciones.ancho / 2;
    };

    Pilas.prototype.arriba = function () {
        return this.opciones.alto / 2;
    };

    Pilas.prototype.abajo = function () {
        return 0 - this.opciones.alto / 2;
    };
    return Pilas;
})();

pilas = new Pilas();

pilasengine = {
    iniciar: function iniciar(opciones) {
        window['pilas'] = new Pilas();

        window['pilas'].iniciar(opciones);
        return window['pilas'];
    }
};
/// <reference path="actor.ts"/>
/// <reference path="../pilas.ts"/>
var Aceituna = (function (_super) {
    __extends(Aceituna, _super);
    function Aceituna(x, y) {
        this.cuadro_normal = 'aceituna.png';
        this.cuadro_reir = 'aceituna_risa.png';
        this.cuadro_burlar = 'aceituna_burla.png';
        this.cuadro_gritar = 'aceituna_grita.png';

        _super.call(this, this.cuadro_normal, x, y);
        this.radio_de_colision = 20;
    }
    Aceituna.prototype.normal = function () {
        this.imagen = this.cuadro_normal;
    };

    Aceituna.prototype.reir = function () {
        this.imagen = this.cuadro_reir;
    };

    Aceituna.prototype.gritar = function () {
        this.imagen = this.cuadro_gritar;
    };

    Aceituna.prototype.burlarse = function () {
        this.imagen = this.cuadro_burlar;
    };

    Aceituna.prototype.saltar = function () {
        this.hacer(pilas.comportamientos.Saltar);
    };
    return Aceituna;
})(Actor);
/// <reference path="actor.ts"/>
var Bomba = (function (_super) {
    __extends(Bomba, _super);
    function Bomba(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("bomba.png", 2);
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 25;
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
var Nave = (function (_super) {
    __extends(Nave, _super);
    function Nave(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("nave.png", 2);
        _super.call(this, imagen, x, y);
        this.paso = 0;
        this.enemigos = [];
        this.teclado_habilitado = false;
        this.aprender(pilas.habilidades.PuedeExplotar);
        this.aprender(pilas.habilidades.SeMantieneEnPantalla);
    }
    Nave.prototype.habilitar_teclado = function () {
        if (this.teclado_habilitado === false) {
            this.aprender(pilas.habilidades.MoverseConElTecladoConRotacion);
            this.aprender(pilas.habilidades.Disparar);
            this.teclado_habilitado = true;
            return "Habilitando el teclado";
        } else {
            return "El teclado ya estaba habilitado.";
        }
    };

    Nave.prototype.actualizar = function () {
        this.paso += 0.1;
        this._imagen.definir_cuadro(parseInt(this.paso) % 2);
        var control = pilas.escena_actual().control;
    };

    Nave.prototype.disparar = function () {
        var disparo = new pilas.actores.Proyectil(this.x, this.y, { rotacion: this.rotacion - 90 });
        disparo.enemigos = this.enemigos;
        return "Disparando ...";
    };

    Nave.prototype.avanzar = function (velocidad) {
        var rotacion_en_radianes;
        var dx;
        var dy;

        if (velocidad === undefined)
            velocidad = 10;

        var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.rotacion + 90);

        dx = Math.cos(rotacion_en_radianes) * velocidad;
        dy = Math.sin(rotacion_en_radianes) * velocidad;

        this.x += dx;
        this.y += dy;
    };

    Nave.prototype.definir_enemigos = function (enemigos) {
        this.enemigos = enemigos;
        return "Definiendo enemigos.";
    };
    return Nave;
})(Actor);
/// <reference path="actor.ts"/>
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("explosion.png", 7);
        _super.call(this, imagen, x, y);
        this.paso = 0;
    }
    Explosion.prototype.actualizar = function () {
        this.paso += 0.1;

        if (this.paso > 1) {
            if (!this._imagen.avanzar())
                this.eliminar();
            this.paso = 0;
        }
    };
    return Explosion;
})(Actor);
/// <reference path="actor.ts"/>
var Proyectil = (function (_super) {
    __extends(Proyectil, _super);
    function Proyectil(x, y, atributos) {
        var imagen = pilas.imagenes.cargar_grilla("disparos/misil.png", 3);
        _super.call(this, imagen, x, y, atributos);
        this.hacer(pilas.comportamientos.AvanzarComoProyectil);
        this.paso = 0;
        this.enemigos = [];
    }
    Proyectil.prototype.actualizar = function () {
        this.paso += 0.1;
        this._imagen.definir_cuadro(parseInt(this.paso) % 2);

        this.analizar_colisiones();
    };

    Proyectil.prototype.analizar_colisiones = function () {
        for (var i = 0; i < this.enemigos.length; i++) {
            var enemigo = this.enemigos[i];

            if (enemigo.vivo && enemigo.colisiona_con_un_punto(this.x, this.y)) {
                enemigo.eliminar();
                this.eliminar();
            }
        }
    };
    return Proyectil;
})(Actor);
/// <reference path="actor.ts"/>
var Piedra = (function (_super) {
    __extends(Piedra, _super);
    function Piedra(x, y, tamano, dx, dy) {
        this.dx = dx || 0;
        this.dy = dy || 0;

        var tamano = tamano || "grande";
        var imagen = "piedra_" + tamano + ".png";

        _super.call(this, imagen, x, y);

        switch (tamano) {
            case 'chica':
                this.radio_de_colision = 10;
                break;

            case 'media':
                this.radio_de_colision = 15;
                break;

            case 'grande':
                this.radio_de_colision = 20;
                break;

            default:
                throw "El tamaño " + tamano + "no está permitido. Use 'chica', 'media' o 'grande'.";
                break;
        }

        this.rotacion = 0;
        this.aprender(pilas.habilidades.SeMantieneEnPantalla);
        this.aprender(pilas.habilidades.PuedeExplotar);
    }
    Piedra.prototype.actualizar = function () {
        this.x += this.dx;
        this.y += this.dy;
        this.rotacion += 1;
    };

    Piedra.prototype.empujar = function (dx, dy) {
        dx = dx || 0;
        dy = dy || 0;

        this.dx = dx / 10;
        this.dy = dy / 10;
        return "Empujando al actor";
    };

    Piedra.prototype.clonar = function (veces) {
        veces = veces || 0;
        veces = Math.min(veces, 5);

        for (var i = 0; i < veces; i++) {
            var dx = (Math.random() * 2) - 1;
            var dy = (Math.random() * 2) - 1;
            var tamano = this.obtener_tamano_al_azar();

            var tmp = new Piedra(this.x, this.y, tamano, 0, 0);
            tmp.empujar(dx, dy);

            if (window['enemigos'] === undefined) {
                window['enemigos'] = [this];
            }

            window['enemigos'].push(tmp);
        }

        return "Clonando el actor piedra.";
    };

    Piedra.prototype.obtener_tamano_al_azar = function () {
        var valores = ['chica', 'media', 'grande'];
        var max = 2;
        var min = 0;
        var indice = Math.floor((Math.random() * ((max + 1) - min)) + min);

        return valores[indice];
    };
    return Piedra;
})(Actor);
/// <reference path="actor.ts"/>
var Eje = (function (_super) {
    __extends(Eje, _super);
    function Eje(x, y) {
        var imagen = "ejes.png";
        _super.call(this, imagen, x, y);
    }
    return Eje;
})(Actor);
/// <reference path="actor.ts"/>
var Maton = (function (_super) {
    __extends(Maton, _super);
    function Maton(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("rpg/maton.png", 3 * 4, 1);
        _super.call(this, imagen, x, y);
        this.paso = 0;
        this.aprender(pilas.habilidades.PuedeExplotar);
        this.cuadros = [
            [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
            [4, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
            [7, 7, 7, 7, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],
            [10, 10, 10, 10, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11]
        ];
        this.direccion = 0;
        this.velocidad = 1;
        window['maton'] = this;
        this.animar = false;
        this._imagen.definir_cuadro(7);
        this.obstaculos = [];
        this.teclado_habilitado = false;
    }
    Maton.prototype.actualizar = function () {
        if (this.animar)
            this.avanzar_animacion();
    };

    Maton.prototype.iniciar_animacion = function () {
        this.animar = true;
    };

    Maton.prototype.detener_animacion = function () {
        this.animar = false;
        this.paso = 0;
        this.avanzar_animacion();
    };

    Maton.prototype.avanzar_animacion = function () {
        this.paso += 0.3;

        if (this.paso >= this.cuadros[this.direccion].length) {
            this.paso = 0;
        }

        var cuadro_a_mostrar = this.cuadros[this.direccion][parseInt(this.paso, 10)];

        this._imagen.definir_cuadro(cuadro_a_mostrar);
    };

    Maton.prototype.mover = function (x, y) {
        if (x < 0)
            this.direccion = 3;

        if (x > 0)
            this.direccion = 1;

        if (y > 0)
            this.direccion = 0;

        if (y < 0)
            this.direccion = 2;

        if (this.puede_moverse_a(this.x + x * this.velocidad, this.y))
            this.x += x * this.velocidad;

        if (this.puede_moverse_a(this.x, this.y + y * this.velocidad))
            this.y += y * this.velocidad;

        this.avanzar_animacion(); // TODO:
        this.z = this.y;
    };

    Maton.prototype.puede_moverse_a = function (x, y) {
        for (var i = 0; i < this.obstaculos.length; i++) {
            if (this.obstaculos[i].colisiona_con_un_punto(x, y))
                return false;
        }

        return true;
    };

    Maton.prototype.caminar_arriba = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaArriba, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.caminar_abajo = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaAbajo, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.caminar_izquierda = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaIzquierda, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.caminar_derecha = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaDerecha, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.saludar = function () {
        this.decir("¡ Hola !");
        return "saludando ...";
    };

    Maton.prototype.habilitar_teclado = function () {
        if (this.teclado_habilitado === false) {
            this.aprender(pilas.habilidades.MoverseConElTeclado);
            this.teclado_habilitado = true;
            return "Habilitando el teclado";
        } else {
            return "El teclado ya estaba habilitado.";
        }
    };

    Maton.prototype.inspeccionar = function () {
        console.log("inspeccionando ...");

        return "Métodos del actor Maton: \n" + "\n" + "- saludar() \n" + "- caminar_arriba(pasos) \n" + "- caminar_abajo(pasos) \n" + "- caminar_izquierda(pasos) \n" + "- caminar_derecha(pasos) \n" + "- mover(x, y) \n" + "- habilitar_teclado() \n" + "";
    };
    return Maton;
})(Actor);
/// <reference path="actor.ts"/>
/// <reference path="../pilas.ts"/>
var Globo = (function (_super) {
    __extends(Globo, _super);
    function Globo(actor, mensaje, eliminarPrevio, anchoMaximo) {
        if (typeof eliminarPrevio === "undefined") { eliminarPrevio = true; }
        if (typeof anchoMaximo === "undefined") { anchoMaximo = 150; }
        _super.call(this, "balloon.png", 0, 0);
        this.mensaje = mensaje;
        this.actor = actor;
        this.margen = 10;
        this.anchoMaximo = anchoMaximo;
        this.nombreImagen = "balloon.png";

        this.crearTexto(0, 0, 9999); //Hardcodeo por necesidad de usar datos del texto
        _super.call(this, this.nombreImagen, this.calcularX(), this.calcularY());
        this.setZ(-5000);
        this.crearTexto(this.x, this.y, this.getZ() - 1); //Creo el texto de posta
        this.actualizarMedidas();
        this.ponerPuntita();
        this.agregar_habilidad(ImitarPosicion, { objeto_a_imitar: this.actor });

        if (eliminarPrevio && this.actor.globoActual)
            this.actor.globoActual.eliminar();
        this.actor.globoActual = this;
        pilas.mundo.agregar_tarea_una_vez(this.duracion(), this.eliminar, {}, this);
    }
    Globo.prototype.duracion = function () {
        return this.actor_texto.cantidadDeLineas() * 3;
    };

    Globo.prototype.eliminar = function () {
        if (!this.vivo)
            return;

        this.actor_texto.eliminar();
        this.puntita.eliminar();
        _super.prototype.eliminar.call(this);
    };

    Globo.prototype.crearTexto = function (x, y, z) {
        if (this.actor_texto)
            this.actor_texto.eliminar();
        this.actor_texto = new pilas.actores.Texto(x, y, this.mensaje, { anchoMaximo: this.anchoMaximo });
        this.actor_texto.setZ(z);
        this.actor_texto.agregar_habilidad(ImitarPosicion, { objeto_a_imitar: this });
    };

    Globo.prototype.actualizarMedidas = function () {
        this.ancho = this.actor_texto.ancho + (this.margen * 2);
        this.alto = Math.max(this.actor_texto.alto + (this.margen * 2), 35); //Alto minimo
    };

    Globo.prototype.calcularY = function () {
        var yIdeal = this.actor.y + (this.actor.alto / 4) + (this.actor_texto.alto / 2);
        yIdeal = Math.min(yIdeal, pilas.arriba() - (this.actor_texto.alto / 2));
        yIdeal = Math.max(yIdeal, pilas.abajo() + (this.actor_texto.alto / 2));

        return yIdeal;
    };

    Globo.prototype.calcularX = function () {
        var xIdeal;
        if (this.voyAIzquierda()) {
            xIdeal = this.xADerechaDelActor();
        } else {
            xIdeal = this.xAIzquierdaDelActor();
        }
        xIdeal = Math.min(xIdeal, pilas.derecha() - (this.actor_texto.ancho / 2));
        xIdeal = Math.max(xIdeal, pilas.izquierda() + (this.actor_texto.ancho / 2));

        return xIdeal;
    };

    Globo.prototype.xADerechaDelActor = function () {
        return this.actor.derecha + this.dimPuntita().ancho + (this.actor_texto.ancho / 2);
    };

    Globo.prototype.xAIzquierdaDelActor = function () {
        return this.actor.izquierda - this.dimPuntita().ancho - (this.actor_texto.ancho / 2);
    };

    Globo.prototype.ponerPuntita = function () {
        if (this.voyAIzquierda()) {
            this.ponerPuntitaAIzquierda();
        } else {
            this.ponerPuntitaADerecha();
        }
        this.puntita.setZ(this.getZ() - 1);
        this.puntita.agregar_habilidad(ImitarPosicion, { objeto_a_imitar: this });
    };

    Globo.prototype.ponerPuntitaAIzquierda = function () {
        this.puntita = new Actor(this.imagenPuntita().izquierda, this.izquierda + this.margen - (this.dimPuntita().ancho / 2), this.abajo + (this.dimPuntita().alto / 2));
    };

    Globo.prototype.ponerPuntitaADerecha = function () {
        this.puntita = new Actor(this.imagenPuntita().derecha, this.derecha - this.margen + (this.dimPuntita().ancho / 2), this.abajo + (this.dimPuntita().alto / 2));
    };

    Globo.prototype.voyAIzquierda = function () {
        return this.actor.derecha + this.dimPuntita().ancho + this.anchoMaximo < pilas.derecha();
    };

    Globo.prototype.imagenPuntita = function () {
        return {
            izquierda: "balloon-tip-left.png",
            derecha: "balloon-tip-right.png" };
    };

    Globo.prototype.dimPuntita = function () {
        return { ancho: 30, alto: 34 };
    };
    return Globo;
})(Actor);

var GloboPensar = (function (_super) {
    __extends(GloboPensar, _super);
    function GloboPensar() {
        _super.apply(this, arguments);
    }
    GloboPensar.prototype.imagenPuntita = function () {
        return {
            izquierda: "balloon-tip-think-left.png",
            derecha: "balloon-tip-think-right.png" };
    };
    return GloboPensar;
})(Globo);
/// <reference path="actor.ts"/>
var Texto = (function (_super) {
    __extends(Texto, _super);
    function Texto(x, y, elString, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = {}; }
        _super.call(this, argumentos.imagenFondo || "invisible.png", x, y);
        this.elString = elString || "Sin texto";
        this.color = argumentos.color || "black";
        this.margen = argumentos.margen || 0;
        this.crear_texto(argumentos.anchoMaximo || 200);
        if (!argumentos.imagenFondo)
            this.transparencia = 100;
    }
    Texto.prototype.crear_texto = function (anchoMaximo) {
        this.spriteCJS = new createjs.Text(this.elString, "14px sans-serif", this.color);
        this.setAnchoMaximo(anchoMaximo);
        this.setX(this.x);
        this.setY(this.y);
        this.spriteCJS.textBaseline = "top";
        this.spriteCJS.textAlign = "center";
        pilas.escena_actual().stage.addChild(this.spriteCJS);
    };

    Texto.prototype.eliminar_texto = function () {
        pilas.escena_actual().stage.removeChild(this.spriteCJS);
    };

    Texto.prototype.eliminar = function () {
        this.eliminar_texto();
        _super.prototype.eliminar.call(this);
    };

    Texto.prototype.actualizarMedidas = function () {
        this.alto = this.spriteCJS.getBounds().height + (this.margen * 2);
        this.ancho = this.spriteCJS.getBounds().width + (this.margen * 2);
    };

    Texto.prototype.anchoString = function () {
        return this.ancho - (this.margen * 2);
    };

    Texto.prototype.altoString = function () {
        return this.alto - (this.margen * 2);
    };

    Texto.prototype.setAnchoMaximo = function (anchoMax) {
        this.spriteCJS.lineWidth = anchoMax - (this.margen * 2);
        this.actualizarMedidas();
    };

    Texto.prototype.setX = function (x) {
        _super.prototype.setX.call(this, x);
        this.spriteCJS.x = pilas.escena_actual().obtener_posicion_pantalla(x, this.y).x;
    };

    Texto.prototype.setY = function (y) {
        _super.prototype.setY.call(this, y);
        this.spriteCJS.y = pilas.escena_actual().obtener_posicion_pantalla(this.x, y + (this.altoString() / 2)).y;
    };

    Texto.prototype.setZ = function (z) {
        _super.prototype.setZ.call(this, z);
        this.spriteCJS.z = z - 1;
    };

    Texto.prototype.cantidadDeLineas = function () {
        return this.altoString() / this.spriteCJS.getMeasuredLineHeight();
    };

    Texto.prototype.setString = function (elString) {
        this.elString = elString;
        this.spriteCJS.text = elString;
        this.actualizarMedidas();
    };
    return Texto;
})(Actor);
/// <reference path="actor.ts"/>
var Bloque = (function (_super) {
    __extends(Bloque, _super);
    function Bloque(x, y, nombre_imagen) {
        var imagen = nombre_imagen || "bloque.png";
        _super.call(this, imagen, x, y);
        this.z = y;
    }
    return Bloque;
})(Actor);
/// <reference path="actor.ts"/>
var Manzana = (function (_super) {
    __extends(Manzana, _super);
    function Manzana(x, y) {
        var imagen = "manzana_chica.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 11;
    }
    return Manzana;
})(Actor);
/// <reference path="actor.ts"/>
var Cofre = (function (_super) {
    __extends(Cofre, _super);
    function Cofre(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("cofre.png", 4);
        _super.call(this, imagen, x, y);
        this.z = y;
        this._imagen.definir_cuadro(0);
        this.paso = 0;
        this.esta_abierto = false;
    }
    Cofre.prototype.abrir = function () {
        this.esta_abierto = true;
    };

    Cofre.prototype.actualizar = function () {
        // TODO: temporal para el tutorial
        if (this.esta_abierto) {
            this.paso += 0.1;

            if (this.paso > 3)
                this.paso = 3;

            this._imagen.definir_cuadro(parseInt(this.paso));
        }
    };
    return Cofre;
})(Actor);
/// <reference path="actor.ts"/>
var Llave = (function (_super) {
    __extends(Llave, _super);
    function Llave(x, y) {
        var imagen = "llave.png";
        _super.call(this, imagen, x, y);
        this.z = y;
    }
    return Llave;
})(Actor);
/// <reference path="actor.ts"/>
var Caja = (function (_super) {
    __extends(Caja, _super);
    function Caja(x, y) {
        var imagen = "caja.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 25;

        this.aprender(pilas.habilidades.RebotarComoCaja);
    }
    return Caja;
})(Actor);
/// <reference path="actor.ts"/>
var Cesto = (function (_super) {
    __extends(Cesto, _super);
    function Cesto(x, y) {
        if (typeof x === "undefined") { x = 120; }
        if (typeof y === "undefined") { y = 0; }
        var ancho = 40;
        var imagen = "cesto.png";
        _super.call(this, imagen, x, y);
        this.centro_x = ancho;
        this.centro_y = ancho;
        this.radio_de_colision = 20;

        var fisica = pilas.escena_actual().fisica;

        this.figura1 = fisica.crear_rectangulo(x - ancho, 0, y + 10, 30, { dinamico: false });
        this.figura2 = fisica.crear_rectangulo(x + ancho - 15, y + 0, 20, 20, { dinamico: false });
        this.figura3 = fisica.crear_rectangulo(x + ancho - 5, y + 20, 5, 40, { dinamico: false });
    }
    return Cesto;
})(Actor);
/// <reference path="actor.ts"/>
var Pelota = (function (_super) {
    __extends(Pelota, _super);
    function Pelota(x, y) {
        var imagen = "pelota.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 25;

        this.aprender(pilas.habilidades.RebotarComoPelota);
    }
    Pelota.prototype.empujar = function (dx, dy) {
        this.figura.empujar(dx * 100, -dy * 100);
        return "empujando hacia (" + dx + ", " + dy + ") ...";
    };

    Pelota.prototype.posicion = function (x, y) {
        if (this.figura !== undefined) {
            this.figura.definir_posicion(x, y);
        } else {
            this.x = x;
            this.y = y;
        }
    };
    return Pelota;
})(Actor);
/// <reference path="actor.ts"/>
var Zanahoria = (function (_super) {
    __extends(Zanahoria, _super);
    function Zanahoria(x, y) {
        this.cuadro_normal = "zanahoria_normal.png";
        this.cuadro_sonrie = "zanahoria_sonrie.png";
        _super.call(this, this.cuadro_normal, x, y);
        this.radio_de_colision = 25;
    }
    Zanahoria.prototype.normal = function () {
        this.imagen = this.cuadro_normal;
    };

    Zanahoria.prototype.sonreir = function () {
        this.imagen = this.cuadro_sonrie;
    };

    Zanahoria.prototype.saltar = function () {
        this.sonreir();
        this.hacer(pilas.comportamientos.Saltar, { cuando_termina: this.normal });
    };

    Zanahoria.prototype.decir = function () {
        this.sonreir();
        _super.prototype.decir.call(this, "hola");
        pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
    };
    return Zanahoria;
})(Actor);
var Boton = (function (_super) {
    __extends(Boton, _super);
    function Boton(x, y, ruta_normal, ruta_press, ruta_over) {
        if (typeof ruta_normal === "undefined") { ruta_normal = 'boton/boton_normal.png'; }
        if (typeof ruta_press === "undefined") { ruta_press = 'boton/boton_press.png'; }
        if (typeof ruta_over === "undefined") { ruta_over = 'boton/boton_over.png'; }
        this.ruta_normal = ruta_normal;
        this.ruta_press = ruta_press;
        this.ruta_over = ruta_over;

        this.funciones_normal = [];
        this.funciones_press = [];
        this.funciones_over = [];

        this.estado = true;

        _super.call(this, ruta_normal, x, y);

        pilas.escena_actual().click_de_mouse.conectar(this);
        pilas.escena_actual().mueve_mouse.conectar(this);
    }
    Boton.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this.detectar_clic(evento);
        }
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this.detectar_movimiento(evento);
        }
    };

    Boton.prototype.conectar_normal = function (funcion, args) {
        if (typeof args === "undefined") { args = undefined; }
        var temp = [funcion, args];
        this.funciones_normal.push(temp);
    };

    Boton.prototype.conectar_presionado = function (funcion, args) {
        if (typeof args === "undefined") { args = undefined; }
        var temp = [funcion, args];
        this.funciones_press.push(temp);
    };

    Boton.prototype.conectar_sobre = function (funcion, args) {
        if (typeof args === "undefined") { args = undefined; }
        var temp = [funcion, args];
        this.funciones_over.push(temp);
    };

    Boton.prototype.desconectar_normal_todo = function () {
        this.funciones_normal = [];
    };

    Boton.prototype.desconectar_presionado_todo = function () {
        this.funciones_press = [];
    };

    Boton.prototype.desconectar_sobre_todo = function () {
        this.funciones_over = [];
    };

    Boton.prototype.desconectar_normal = function (funcion, args) {
        for (var i = 0; i < this.funciones_normal.length; i++) {
            if (this.funciones_normal[i][0] == funcion) {
                if (this.funciones_normal[i][1] == args) {
                    this.funciones_normal.splice(i, 1);
                }
            }
        }
    };

    Boton.prototype.desconectar_presionado = function (funcion, args) {
        for (var i = 0; i < this.funciones_press.length; i++) {
            if (this.funciones_press[i][0] == funcion) {
                if (this.funciones_press[i][1] == args) {
                    this.funciones_press.splice(i, 1);
                }
            }
        }
    };

    Boton.prototype.desconectar_sobre = function (funcion, args) {
        for (var i = 0; i < this.funciones_over.length; i++) {
            if (this.funciones_over[i][0] == funcion) {
                if (this.funciones_over[i][1] == args) {
                    this.funciones_over.splice(i, 1);
                }
            }
        }
    };

    Boton.prototype.ejecutar_funciones_normal = function () {
        if (this.estado) {
            for (var i = 0; i < this.funciones_normal.length; i++) {
                if (this.funciones_normal[i][1] == undefined) {
                    this.funciones_normal[i][0]();
                } else {
                    this.funciones_press[i][0](this.funciones_normal[i][1]);
                }
            }
        }
    };

    Boton.prototype.ejecutar_funciones_press = function () {
        if (this.estado) {
            for (var i = 0; i < this.funciones_press.length; i++) {
                if (this.funciones_press[i][1] == undefined) {
                    this.funciones_press[i][0]();
                } else {
                    this.funciones_press[i][0](this.funciones_press[i][1]);
                }
            }
        }
    };

    Boton.prototype.ejecutar_funciones_over = function () {
        if (this.estado) {
            for (var i = 0; i < this.funciones_over.length; i++) {
                if (this.funciones_over[i][1] == undefined) {
                    this.funciones_over[i][0]();
                } else {
                    this.funciones_over[i][0](this.funciones_over[i][1]);
                }
            }
        }
    };

    Boton.prototype.activar = function () {
        this.estado = true;
    };

    Boton.prototype.desactivar = function () {
        this.estado = false;
    };

    Boton.prototype.pintar_normal = function () {
        this.imagen = this.ruta_normal;
    };

    Boton.prototype.pintar_presionado = function () {
        this.imagen = this.ruta_press;
    };

    Boton.prototype.pintar_sobre = function () {
        this.imagen = this.ruta_over;
    };

    Boton.prototype.detectar_clic = function (click) {
        if (this.colisiona_con_un_punto(click.x, click.y)) {
            this.ejecutar_funciones_press();
        }
    };

    Boton.prototype.detectar_movimiento = function (evento) {
        if (this.colisiona_con_un_punto(evento.x, evento.y)) {
            this.ejecutar_funciones_over();
        } else {
            this.ejecutar_funciones_normal();
        }
    };
    return Boton;
})(Actor);
/// <reference path="actor.ts"/>
/// <reference path="texto.ts"/>
var Puntaje = (function (_super) {
    __extends(Puntaje, _super);
    function Puntaje(x, y, puntaje, argumentos) {
        this.valor = puntaje || 0;
        _super.call(this, x, y, this.valor.toString(), argumentos);
    }
    Puntaje.prototype.aumentar = function (aumento) {
        this.valor += aumento;
        this.setString(this.valor.toString());
    };

    Puntaje.prototype.obtener = function () {
        return this.valor;
    };
    return Puntaje;
})(Texto);
/// <reference path="actor.ts"/>
var Mono = (function (_super) {
    __extends(Mono, _super);
    function Mono(x, y) {
        this.image_normal = 'monkey_normal.png';
        this.image_smile = 'monkey_smile.png';
        this.image_shout = 'monkey_shout.png';

        this.sound_smile = pilas.sonidos.cargar('smile.ogg');
        this.sound_shout = pilas.sonidos.cargar('shout.ogg');
        _super.call(this, this.image_normal, x, y);

        this.radio_de_colision = 50;
    }
    Mono.prototype.sonreir = function () {
        this.sound_smile.reproducir();
        this.imagen = this.image_smile;
        pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
    };

    Mono.prototype.gritar = function () {
        this.sound_shout.reproducir();
        this.imagen = this.image_shout;
        pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
    };

    Mono.prototype.normal = function () {
        this.imagen = this.image_normal;
    };

    Mono.prototype.decir = function (mensaje) {
        this.sonreir;
        _super.prototype.decir.call(this, mensaje);
    };

    Mono.prototype.saltar = function () {
        this.sonreir();
        this.hacer(pilas.comportamientos.Saltar);
    };
    return Mono;
})(Actor);
var Banana = (function (_super) {
    __extends(Banana, _super);
    function Banana(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_grilla('banana.png', 2);
        _super.call(this, imagen, x, y);
        this._imagen.definir_cuadro(0);
    }
    Banana.prototype.cerrar = function () {
        this._imagen.definir_cuadro(0);
    };

    Banana.prototype.abrir = function () {
        this._imagen.definir_cuadro(1);
    };
    return Banana;
})(Actor);
var Tortuga = (function (_super) {
    __extends(Tortuga, _super);
    function Tortuga(x, y, dibuja) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof dibuja === "undefined") { dibuja = true; }
        var imagen = 'tortuga.png';
        _super.call(this, imagen, x, y);

        this.pizarra = new pilas.actores.Pizarra();

        if (dibuja)
            this.bajalapiz();
        else
            this.subelapiz();

        this.color = pilas.colores.negro;
    }
    Tortuga.prototype.avanzar = function (pasos) {
        this.hacer_luego(pilas.comportamientos.Avanzar, { pasos: pasos, velocidad: 2 });
    };

    Tortuga.prototype.girarderecha = function (delta) {
        this.hacer_luego(pilas.comportamientos.Girar, { angulo: delta, tiempo: .5 });
    };

    Tortuga.prototype.girarizquierda = function (delta) {
        this.hacer_luego(pilas.comportamientos.Girar, { angulo: -delta, tiempo: .5 });
    };

    Tortuga.prototype.actualizar = function () {
        if (this.x != this.anterior_x || this.y != this.anterior_y) {
            if (this.lapiz_bajo) {
                this.pizarra.linea(this.anterior_x, this.anterior_y, this.x, this.y, this.color, 4);
            }

            this.anterior_x = this.x;
            this.anterior_y = this.y;
        }
    };

    Tortuga.prototype.bajalapiz = function () {
        this.lapiz_bajo = true;
    };

    Tortuga.prototype.subelapiz = function () {
        this.lapiz_bajo = false;
    };

    Tortuga.prototype.crear_poligono = function (lados, escala, sentido) {
        if (typeof lados === "undefined") { lados = 3; }
        if (typeof escala === "undefined") { escala = 100; }
        if (typeof sentido === "undefined") { sentido = -1; }
        var rotacion = 360 / lados;

        for (var i = 0; i < lados; i++) {
            this.avanzar(escala);

            if (sentido == 1)
                this.girarderecha(rotacion);
            else
                this.girarizquierda(rotacion);
        }
    };

    Tortuga.prototype.crear_circulo = function (radio, sentido) {
        if (typeof sentido === "undefined") { sentido = -1; }
        for (var i = 0; i < 36; i++) {
            this.avanzar(radio);
            if (sentido == 1)
                this.girarderecha(10);
            else
                this.girarizquierda(10);
        }
    };


    Object.defineProperty(Tortuga.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (_color) {
            this._color = _color;
        },
        enumerable: true,
        configurable: true
    });
    return Tortuga;
})(Actor);
var Pizarra = (function (_super) {
    __extends(Pizarra, _super);
    function Pizarra(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = 'invisible.png';
        _super.call(this, imagen, x, y);

        this._ancho = pilas.opciones.ancho;
        this._alto = pilas.opciones.alto;

        //crear lienzo
        this.container = new createjs.Container();
        this.lienzo = new createjs.Shape(this.x, this.y); // TODO: Permitir que acepte ancho y alto de la pizarra
        this.container.addChild(this.lienzo);
        pilas.escena_actual().stage.addChild(this.container);
    }
    Pizarra.prototype.dibujar_punto = function (x, y, color) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        var pos = pilas.escena_actual().obtener_posicion_pantalla(x, y);

        this.lienzo.graphics.beginStroke(color);
        this.lienzo.graphics.beginFill(color);
        this.lienzo.graphics.drawCircle(pos.x, pos.y, 3).endStroke();
    };

    Pizarra.prototype.linea = function (x, y, x2, y2, color, grosor) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        if (typeof grosor === "undefined") { grosor = 1; }
        var pos = pilas.escena_actual().obtener_posicion_pantalla(x, y);
        var pos2 = pilas.escena_actual().obtener_posicion_pantalla(x2, y2);

        this.lienzo.graphics.setStrokeStyle(grosor);
        this.lienzo.graphics.beginStroke(color);
        this.lienzo.graphics.moveTo(pos.x, pos.y);
        this.lienzo.graphics.lineTo(pos2.x, pos2.y).endStroke();
    };

    Pizarra.prototype.rectangulo = function (x, y, ancho, alto, color, relleno, grosor) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        if (typeof relleno === "undefined") { relleno = false; }
        if (typeof grosor === "undefined") { grosor = 1; }
        if (!relleno)
            var color_relleno = createjs.Graphics.getRGB(255, 255, 255, 0);
        else
            var color_relleno = relleno;

        var pos = pilas.escena_actual().obtener_posicion_pantalla(x, y);

        this.lienzo.graphics.setStrokeStyle(grosor);
        this.lienzo.graphics.beginStroke(color);
        this.lienzo.graphics.beginFill(color_relleno);
        this.lienzo.graphics.drawRect(pos.x, pos.y, ancho, alto).endStroke();
    };

    Pizarra.prototype.poligono = function (puntos, color, grosor) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        if (typeof grosor === "undefined") { grosor = 1; }
        for (var i = 1; i < puntos.length; i++) {
            this.linea(puntos[i - 1][0], puntos[i - 1][1], puntos[i][0], puntos[i][1], color = color, grosor = grosor);
        }
    };

    Pizarra.prototype.limpiar = function () {
        this.lienzo.graphics.clear();
    };

    Pizarra.prototype.pintar = function (color) {
        this.rectangulo(this.x - 320, this.y + 240, this._ancho, this._alto, color, color, 1);
    };

    /*=================== Desde aca para sacar info de lo dibujado ======================*/
    Pizarra.prototype.puntosDeLineas = function () {
        var _this = this;
        var instruccionesLineas = this.lienzo.graphics._instructions.filter(function (instruccion) {
            return instruccion.f.name === "lineTo";
        });
        return instruccionesLineas.map(function (instruccion) {
            return _this.cambioCoordenadas(instruccion.params);
        });
    };

    Pizarra.prototype.cambioCoordenadas = function (punto) {
        return pilas.escena_actual().obtener_posicion_escenario(Math.round(punto[0]), Math.round(punto[1]));
    };

    Pizarra.prototype.mismosPuntosQue = function (puntos) {
        var _this = this;
        var misPuntos = this.puntosSinRepetirDe(this.puntosDeLineas());
        var punts = this.puntosSinRepetirDe(puntos);
        return punts.length == misPuntos.length && misPuntos.every(function (p) {
            return _this.estaPuntoEn(p, punts);
        });
    };

    Pizarra.prototype.tieneIgualDibujoQue = function (otraPizarra) {
        return this.mismosPuntosQue(otraPizarra.puntosDeLineas());
    };

    Pizarra.prototype.puntosSinRepetirDe = function (puntos) {
        return this.sacarPuntosRepetidosDe(this.ordenarPuntosDe(puntos));
    };

    Pizarra.prototype.ordenarPuntosDe = function (puntos) {
        return puntos.sort(this.compararPuntos);
    };

    Pizarra.prototype.compararPuntos = function (p1, p2) {
        if (p1.x == p2.x)
            return p1.y - p2.y;
        return p1.x - p2.x;
    };

    Pizarra.prototype.sacarPuntosRepetidosDe = function (puntos) {
        var _this = this;
        var sinReps = [];
        puntos.forEach(function (pto) {
            if (!_this.estaPuntoEn(pto, sinReps))
                sinReps.push(pto);
        });
        return sinReps;
    };

    Pizarra.prototype.estaPuntoEn = function (pto, ptos) {
        return ptos.some(function (elemento) {
            return pto.x == elemento.x && pto.y == elemento.y;
        });
    };
    return Pizarra;
})(Actor);
var Pingu = (function (_super) {
    __extends(Pingu, _super);
    function Pingu(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_grilla('pingu.png', 10);
        _super.call(this, imagen, x, y);
        this._imagen.definir_cuadro(4);
        this.paso = 0;
        this.centro_y = 50;
        this.cuadros_correr = [5, 6, 7, 8, 9];
        this.saltando = false;
    }
    Pingu.prototype.actualizar = function () {
        if (!this.saltando) {
            if (pilas.escena_actual().control.derecha) {
                this.hacer(pilas.comportamientos.CaminaDerecha);
            } else if (pilas.escena_actual().control.izquierda) {
                this.hacer(pilas.comportamientos.CaminaIzquierda);
            }

            if (pilas.escena_actual().control.arriba) {
                this.saltando = true;
                this.hacer(pilas.comportamientos.Saltando, { cuando_termina: this.puede_saltar });
                this._imagen.definir_cuadro(0);
            }
        }
    };

    Pingu.prototype.puede_saltar = function () {
        this.saltando = false;
        this.detener_animacion();
    };

    Pingu.prototype.mover = function (x, y) {
        this.x += x;
        this.animacion_correr();
    };

    Pingu.prototype.animacion_correr = function () {
        this.paso += .3;
        if (this.paso > this.cuadros_correr.length) {
            this.paso = 0;
        }
        this._imagen.definir_cuadro(this.cuadros_correr[parseInt(this.paso)]);
    };

    Pingu.prototype.detener_animacion = function () {
        this._imagen.definir_cuadro(4);
    };
    return Pingu;
})(Actor);
// <reference path="comportamientos.ts />
var Alien = (function (_super) {
    __extends(Alien, _super);
    function Alien(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_animacion('alien.png', 14);
        _super.call(this, imagen, x, y);

        window['alien'] = this;

        imagen.definir_animacion("parado", [11, 11], 5);
        imagen.definir_animacion("hablar", [12, 13, 11, 12, 11, 13], 15);
        imagen.definir_animacion("recoger", [12, 10, 10, 10, 10, 12], 5);
        imagen.definir_animacion("camina", [0, 1, 2, 3, 4, 3, 2, 1], 15);
        imagen.cargar_animacion("parado");

        this.radio_de_colision = 30;

        this.sonido_blabla = pilas.sonidos.cargar('blabla.wav');
        this.cuando_busca_recoger = undefined;
    }
    Alien.prototype.iniciar = function () {
        this.sombra = new pilas.actores.Sombra();
        this.sombra.escala = 0.5;
        this.limitar_movimientos = true;

        this.centro_y = 'abajo';
        this.centro_y -= 10;
    };

    Alien.prototype.decir = function (mensaje) {
        this.hacer_luego(Hablar, { mensaje: mensaje, tiempo: 1 });
    };

    Alien.prototype.super_decir = function (mensaje) {
        _super.prototype.decir.call(this, mensaje);
        this.sonido_blabla.reproducir();
    };

    Alien.prototype.actualizar = function () {
        this.z = this.y;

        this.sombra.x = this.x;
        this.sombra.y = this.y;
        this.sombra.z = this.z + 1;
    };

    Alien.prototype.avanzar_animacion = function () {
        return this._imagen.avanzar();
    };

    Alien.prototype.ir_derecha = function () {
        this.hacer_luego(MoverHaciaDerecha, { cantidad: 68, tiempo: 1 });
    };

    Alien.prototype.ir_izquierda = function () {
        this.hacer_luego(MoverHaciaIzquierda, { cantidad: 68, tiempo: 1 });
    };

    Alien.prototype.ir_arriba = function () {
        this.hacer_luego(MoverHaciaArriba, { cantidad: 80, tiempo: 1 });
    };

    Alien.prototype.ir_abajo = function () {
        this.hacer_luego(MoverHaciaAbajo, { cantidad: 80, tiempo: 1 });
    };

    Alien.prototype.esperar = function (tiempo) {
        if (typeof tiempo === "undefined") { tiempo = 2; }
        this.hacer_luego(Esperar, { tiempo: tiempo });
    };

    Alien.prototype.detener = function () {
        this.esperar(0);
    };

    Alien.prototype.recoger = function () {
        this.hacer_luego(Recoger, { tiempo: 1 });
    };

    Alien.prototype.colisiona_con_item = function (item_name) {
        var _this = this;
        return pilas.escena_actual().actores.filter(function (i) {
            return i.getClassName() === item_name;
        }).some(function (i) {
            return _this.colisiona_con(i);
        });
    };
    return Alien;
})(Actor);

var Movimiento = (function () {
    function Movimiento(argumentos) {
        this.argumentos = argumentos;
    }
    Movimiento.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.tiempo = this.argumentos.tiempo || 2;
        this.cantidad = this.argumentos.cantidad || 32;

        this._contador_de_tiempo = 0;
        this._velocidad = (this.cantidad / 60.0) / this.tiempo;
        this.iniciar_animacion();
    };

    Movimiento.prototype.iniciar_animacion = function () {
    };

    Movimiento.prototype.supero_el_tiempo = function () {
        return (this._contador_de_tiempo > this.tiempo * 60);
    };

    Movimiento.prototype.al_terminar = function () {
    };
    return Movimiento;
})();

var MoverHaciaDerecha = (function (_super) {
    __extends(MoverHaciaDerecha, _super);
    function MoverHaciaDerecha() {
        _super.apply(this, arguments);
    }
    MoverHaciaDerecha.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
        this.receptor.espejado = false;
    };

    MoverHaciaDerecha.prototype.actualizar = function () {
        this.receptor.avanzar_animacion();
        this.realizar_movimiento();

        if (this.supero_el_tiempo()) {
            this.receptor._imagen.cargar_animacion('parado');
            this.al_terminar();
            return true;
        }

        this._contador_de_tiempo += 1;
    };

    MoverHaciaDerecha.prototype.realizar_movimiento = function () {
        this.receptor.x += this._velocidad;
    };
    return MoverHaciaDerecha;
})(Movimiento);

var MoverHaciaIzquierda = (function (_super) {
    __extends(MoverHaciaIzquierda, _super);
    function MoverHaciaIzquierda() {
        _super.apply(this, arguments);
    }
    MoverHaciaIzquierda.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
        this.receptor.espejado = true;
    };

    MoverHaciaIzquierda.prototype.realizar_movimiento = function () {
        this.receptor.x -= this._velocidad;
    };
    return MoverHaciaIzquierda;
})(MoverHaciaDerecha);

var MoverHaciaArriba = (function (_super) {
    __extends(MoverHaciaArriba, _super);
    function MoverHaciaArriba() {
        _super.apply(this, arguments);
    }
    MoverHaciaArriba.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
    };

    MoverHaciaArriba.prototype.realizar_movimiento = function () {
        this.receptor.y += this._velocidad;
    };
    return MoverHaciaArriba;
})(MoverHaciaDerecha);

var MoverHaciaAbajo = (function (_super) {
    __extends(MoverHaciaAbajo, _super);
    function MoverHaciaAbajo() {
        _super.apply(this, arguments);
    }
    MoverHaciaAbajo.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
    };

    MoverHaciaAbajo.prototype.realizar_movimiento = function () {
        this.receptor.y -= this._velocidad;
    };
    return MoverHaciaAbajo;
})(MoverHaciaDerecha);

var Esperar = (function (_super) {
    __extends(Esperar, _super);
    function Esperar() {
        _super.apply(this, arguments);
    }
    Esperar.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("parado");
        this.receptor.espejado = true;
    };

    Esperar.prototype.realizar_movimiento = function () {
    };
    return Esperar;
})(MoverHaciaDerecha);

var Recoger = (function (_super) {
    __extends(Recoger, _super);
    function Recoger() {
        _super.apply(this, arguments);
    }
    Recoger.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("recoger");
    };

    Recoger.prototype.actualizar = function () {
        if (this.receptor.avanzar_animacion() === false) {
            this.receptor._imagen.cargar_animacion('parado');

            if (this.receptor.cuando_busca_recoger) {
                this.receptor.cuando_busca_recoger.call(this);
            }

            return true;
        }

        return false;
    };
    return Recoger;
})(Movimiento);

var Hablar = (function (_super) {
    __extends(Hablar, _super);
    function Hablar() {
        _super.apply(this, arguments);
    }
    Hablar.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("hablar");
        this.receptor.super_decir(this.argumentos.mensaje);
        this.contador = 0;
    };

    Hablar.prototype.realizar_movimiento = function () {
    };
    return Hablar;
})(MoverHaciaDerecha);
// <reference path="comportamientos.ts />
var AlienMarron = (function (_super) {
    __extends(AlienMarron, _super);
    function AlienMarron(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_animacion('alien_marron.png', 14);
        _super.call(this, imagen, x, y);

        window['alien'] = this;

        imagen.definir_animacion("parado", [11, 11], 5);
        imagen.definir_animacion("hablar", [12, 13, 11, 12, 11, 13], 15);
        imagen.definir_animacion("recoger", [12, 10, 10, 10, 10, 12], 5);
        imagen.definir_animacion("camina", [0, 1, 2, 3, 4, 3, 2, 1], 15);
        imagen.cargar_animacion("parado");

        this.sonido_blabla = pilas.sonidos.cargar('blabla.wav');
        this.cuando_busca_recoger = undefined;
    }
    AlienMarron.prototype.iniciar = function () {
        this.sombra = new pilas.actores.Sombra();
        this.sombra.escala = 0.5;
        this.limitar_movimientos = true;

        this.centro_y = 'abajo';
        this.centro_y -= 10;
    };

    AlienMarron.prototype.decir = function (mensaje) {
        //this.hacer_luego(Hablar, {mensaje: mensaje, tiempo: 1});
    };

    AlienMarron.prototype.super_decir = function (mensaje) {
        _super.prototype.decir.call(this, mensaje);
        this.sonido_blabla.reproducir();
    };

    AlienMarron.prototype.actualizar = function () {
        this.z = this.y;

        this.sombra.x = this.x;
        this.sombra.y = this.y;
        this.sombra.z = this.z + 1;
    };

    AlienMarron.prototype.avanzar_animacion = function () {
        return this._imagen.avanzar();
    };

    AlienMarron.prototype.ir_derecha = function () {
        //this.hacer_luego(MoverHaciaDerecha, {cantidad: 68, tiempo: 1});
    };

    AlienMarron.prototype.ir_izquierda = function () {
        //this.hacer_luego(MoverHaciaIzquierda, {cantidad: 68, tiempo: 1});
    };

    AlienMarron.prototype.ir_arriba = function () {
        //this.hacer_luego(MoverHaciaArriba, {cantidad: 80, tiempo: 1});
    };

    AlienMarron.prototype.ir_abajo = function () {
        //this.hacer_luego(MoverHaciaAbajo, {cantidad: 80, tiempo: 1});
    };

    AlienMarron.prototype.esperar = function (tiempo) {
        if (typeof tiempo === "undefined") { tiempo = 2; }
        //this.hacer_luego(Esperar, {tiempo: tiempo});
    };

    AlienMarron.prototype.detener = function () {
        //this.esperar(0);
    };

    AlienMarron.prototype.recoger = function () {
        //this.hacer_luego(Recoger, {tiempo: 1});
    };
    return AlienMarron;
})(Actor);
/// <reference path="actor.ts"/>
var Tuerca = (function (_super) {
    __extends(Tuerca, _super);
    function Tuerca(x, y) {
        var imagen = "tuerca.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 11;
        this.y_original = y + 20;
        this.x = x + 10;
        this.contador = Math.random() * 3;
        this.sombra = new pilas.actores.Sombra();
        this.sombra.escala = 0.25;
    }
    Tuerca.prototype.actualizar = function () {
        this.contador += 0.025;
        this.y = this.y_original + Math.sin(this.contador) * 5;
        this.sombra.x = this.x;
        this.sombra.y = this.y_original - 20;
        this.sombra.z = this.z + 1;
    };
    return Tuerca;
})(Actor);
/// <reference path="actor.ts"/>
var Sombra = (function (_super) {
    __extends(Sombra, _super);
    function Sombra(x, y) {
        _super.call(this, "sombra.png", x, y);
        this.radio_de_colision = 20;
    }
    return Sombra;
})(Actor);
/// <reference path='actores/aceituna.ts' />
/// <reference path='actores/bomba.ts' />
/// <reference path='actores/nave.ts' />
/// <reference path='actores/explosion.ts' />
/// <reference path='actores/proyectil.ts' />
/// <reference path='actores/piedra.ts' />
/// <reference path='actores/eje.ts' />
/// <reference path='actores/maton.ts' />
/// <reference path='actores/globo.ts' />
/// <reference path='actores/texto.ts' />
/// <reference path='actores/bloque.ts' />
/// <reference path='actores/manzana.ts' />
/// <reference path='actores/cofre.ts' />
/// <reference path='actores/llave.ts' />
/// <reference path='actores/caja.ts' />
/// <reference path='actores/cesto.ts' />
/// <reference path='actores/pelota.ts' />
/// <reference path='actores/zanahoria.ts' />
/// <reference path='actores/boton.ts' />
/// <reference path='actores/puntaje.ts' />
/// <reference path='actores/mono.ts' />
/// <reference path='actores/banana.ts' />
/// <reference path='actores/tortuga.ts' />
/// <reference path='actores/pizarra.ts' />
/// <reference path='actores/pingu.ts' />
/// <reference path='actores/alien.ts' />
/// <reference path='actores/alien_marron.ts' />
/// <reference path='actores/tuerca.ts' />
/// <reference path='actores/sombra.ts' />
/**
* @class Actores
*
* Módulo Actores
* ==============
*
* Representa todos los actores conocidos en pilas-engine.
*/
var Actores = (function () {
    function Actores(pilas) {
        this.pilas = pilas;
        this.Aceituna = Aceituna;
        this.Actor = Actor;
        this.Bomba = Bomba;
        this.Nave = Nave;
        this.Explosion = Explosion;
        this.Proyectil = Proyectil;
        this.Piedra = Piedra;
        this.Eje = Eje;
        this.Maton = Maton;
        this.Globo = Globo;
        this.GloboPensar = GloboPensar;
        this.Texto = Texto;
        this.Bloque = Bloque; // TODO: eliminar, es solo para implementar tutorial.
        this.Manzana = Manzana;
        this.Cofre = Cofre;
        this.Llave = Llave;
        this.Caja = Caja;
        this.Cesto = Cesto;
        this.Pelota = Pelota;
        this.Zanahoria = Zanahoria;
        this.Boton = Boton;
        this.Puntaje = Puntaje;
        this.Mono = Mono;
        this.Banana = Banana;
        this.Tortuga = Tortuga;
        this.Pizarra = Pizarra;
        this.Pingu = Pingu;
        this.Alien = Alien;
        this.AlienMarron = AlienMarron;
        this.Tuerca = Tuerca;
        this.Sombra = Sombra;
    }
    return Actores;
})();
