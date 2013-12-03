/// <reference path="actores/aceituna.ts />
/// <reference path="actores/bomba.ts />
/// <reference path="actores/explosion.ts />
/// <reference path="actores/nave.ts />
/// <reference path="actores/piedra.ts />
/// <reference path="actores/eje.ts />
/// <reference path="actores/maton.ts />
/// <reference path="actores/caja.ts />
/// <reference path="actores/cesto.ts />
/// <reference path="actores/pelota.ts />
/// <reference path="actores/zanahoria.ts />
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
        this.Nave = Nave;
        this.Explosion = Explosion;
        this.Proyectil = Proyectil;
        this.Piedra = Piedra;
        this.Eje = Eje;
        this.Maton = Maton;
        this.Globo = Globo;
        this.Texto = Texto;
        this.Bloque = Bloque;
        this.Manzana = Manzana;
        this.Cofre = Cofre;
        this.Llave = Llave;
        this.Caja = Caja;
        this.Cesto = Cesto;
        this.Pelota = Pelota;
        this.Zanahoria = Zanahoria;
    }
    return Actores;
})();
var Estudiante = (function () {
    function Estudiante() {
        this.habilidades = [];
        this.comportamiento = undefined;
    }
    Estudiante.prototype.aprender = function (clase_de_habilidad, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = null; }
        this.agregar_habilidad(clase_de_habilidad, argumentos);
        return "Enseñando una habilidad ...";
    };

    Estudiante.prototype.agregar_habilidad = function (clase_de_habilidad, argumentos) {
        if (argumentos == null) {
            var habilidad = new clase_de_habilidad(this);
        } else {
            var habilidad = new clase_de_habilidad(this, argumentos);
        }

        // TODO permitir que se puedan enviar habiliades ya instanciadas.
        this.habilidades.push(habilidad);
    };

    Estudiante.prototype.actualizar_habilidades = function () {
        for (var i = 0; i < this.habilidades.length; i++) {
            this.habilidades[i].actualizar();
        }
    };

    Estudiante.prototype.hacer = function (comportamiento, argumentos) {
        this.comportamiento = new comportamiento(argumentos);
        this.comportamiento.iniciar(this);
    };

    Estudiante.prototype.actualizar_comportamientos = function () {
        if (this.comportamiento !== undefined) {
            var termina = this.comportamiento.actualizar();

            if (termina)
                this.comportamiento = undefined;
        }
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
        this.imagen = imagen || 'sin_imagen.png';
        atributos = atributos || {};
        this.vivo = true;
        this.radio_de_colision = 10;
        this.id = pilas.utils.obtener_uuid();

        if (this === pilas.actores)
            throw Error("Lo siento, tienes que anteponer 'new' para crear actores en esta versión.");

        this.crear_sprite();
        this.x = x || 0;
        this.y = y || 0;
        this.centro_x = this.ancho / 2;
        this.centro_y = this.alto / 2;

        if (atributos['rotacion'])
            this.rotacion = atributos['rotacion'];

        if (atributos['centro_x'])
            this.centro_x = atributos['centro_x'];

        if (atributos['centro_x'])
            this.centro_y = atributos['centro_y'];

        this.z = 0;
        pilas.escena_actual().agregar_actor(this);
    }
    Actor.prototype.tiene_fisica = function () {
        return (this.figura !== undefined);
    };

    Actor.prototype.crear_sprite = function () {
        this.sprite = this._imagen.instanciar();
    };

    Actor.prototype.eliminar = function () {
        this.vivo = false;
        pilas.escena_actual().eliminar_actor(this);
    };

    Object.defineProperty(Actor.prototype, "z", {
        get: function () {
            return this.sprite.z;
        },
        set: function (_z) {
            this.sprite.z = _z;
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
                pilas.interpolar(this, 'x', _x, 1000);
else {
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
            if (_y instanceof Array)
                pilas.interpolar(this, 'y', _y, 1000);
else {
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
            if (valor instanceof Array)
                pilas.interpolar(this.sprite, 'scaleX', valor, 1000);
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
                pilas.interpolar(this.sprite, 'scaleY', valor, 1000);
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
                pilas.interpolar(this, 'radio_de_colision', nuevo_radio_de_colision, 1000);
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

    Object.defineProperty(Actor.prototype, "rotacion", {
        get: function () {
            return this.sprite.rotation;
        },
        set: function (valor) {
            if (valor instanceof Array)
                pilas.interpolar(this.sprite, 'rotation', valor, 1000);
else
                this.sprite.rotation = valor;
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
            if (_i.substring)
                this._imagen = pilas.imagenes.cargar(_i);
else
                this._imagen = _i;

            if (this.sprite !== undefined) {
                this.sprite.image = this._imagen.instanciar().image;
                this.centro_x = this.ancho / 2;
                this.centro_y = this.alto / 2;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "izquierda", {
        get: /* TODO: hacer que se puedan interpolar
        las propiedades: izquierda, derecha, arriba, abajo.
        */
        function () {
            return this.x - (this.centro_x * this.escala);
        },
        set: function (x) {
            this.x = x + (this.centro_x * this.escala);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "derecha", {
        get: function () {
            return this.izquierda + (this.ancho * this.escala);
        },
        set: function (x) {
            this.izquierda = x - (this.ancho * this.escala);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "arriba", {
        get: function () {
            return this.y + (this.centro_y * this.escala);
        },
        set: function (y) {
            this.y = y - (this.centro_y * this.escala);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "abajo", {
        get: function () {
            return this.arriba - (this.alto * this.escala);
        },
        set: function (y) {
            this.arriba = y + (this.alto * this.escala);
        },
        enumerable: true,
        configurable: true
    });


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
        var globo = new pilas.actores.Globo(this.x, this.y, mensaje);
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
        this.radio_de_colision = 20;
    }
    return Aceituna;
})(Actor);
/// <reference path="actor.ts"/>
var Bloque = (function (_super) {
    __extends(Bloque, _super);
    function Bloque(x, y, nombre_imagen) {
        var imagen = nombre_imagen || "bloque.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 13;
        this.centro_y = this.alto;
        this.z = y;
    }
    return Bloque;
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
var Caja = (function (_super) {
    __extends(Caja, _super);
    function Caja(x, y) {
        var imagen = "caja.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 24;
        this.centro_y = 24;
        this.radio_de_colision = 45;

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
var Cofre = (function (_super) {
    __extends(Cofre, _super);
    function Cofre(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("cofre.png", 4);
        _super.call(this, imagen, x, y);
        this.centro_x = 10;
        this.centro_y = 17;
        this.z = y;
        this._imagen.definir_cuadro(0);
        this.paso = 0;
        this.esta_abierto = false;
    }
    Cofre.prototype.abrir = function () {
        this.esta_abierto = true;
    };

    Cofre.prototype.actualizar = function () {
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
var Eje = (function (_super) {
    __extends(Eje, _super);
    function Eje(x, y) {
        var imagen = "ejes.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 256;
        this.centro_y = 256;
    }
    return Eje;
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

        if (this.paso > 1) {
            if (!this._imagen.avanzar())
                this.eliminar();
            this.paso = 0;
        }
    };
    return Explosion;
})(Actor);
/// <reference path="actor.ts"/>
var Globo = (function (_super) {
    __extends(Globo, _super);
    function Globo(x, y, mensaje) {
        var imagen = "globo.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 85;
        this.centro_y = 80;
        this.mensaje = mensaje;
        this.actor_texto = new pilas.actores.Texto(x, y, mensaje);

        // TODO: Reemplazar por tareas, como hace pilas-python.
        var _this = this;
        setTimeout(function () {
            _this.eliminar();
        }, 3000);
    }
    Globo.prototype.eliminar = function () {
        this.actor_texto.eliminar();
        _super.prototype.eliminar.call(this);
    };
    return Globo;
})(Actor);
/// <reference path="actor.ts"/>
var Llave = (function (_super) {
    __extends(Llave, _super);
    function Llave(x, y) {
        var imagen = "llave.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 9;
        this.centro_y = 13;
        this.z = y;
    }
    return Llave;
})(Actor);
/// <reference path="actor.ts"/>
var Manzana = (function (_super) {
    __extends(Manzana, _super);
    function Manzana(x, y) {
        var imagen = "manzana_chica.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 11;
        this.centro_y = 20;
    }
    return Manzana;
})(Actor);
/// <reference path="actor.ts"/>
var Maton = (function (_super) {
    __extends(Maton, _super);
    function Maton(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("rpg/maton.png", 3 * 4, 1);
        _super.call(this, imagen, x, y);
        this.centro_x = 36;
        this.centro_y = 31;
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
        this.centro_x = 18;
        this.centro_y = 40;
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

        this.avanzar_animacion();
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
var Nave = (function (_super) {
    __extends(Nave, _super);
    function Nave(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("nave.png", 2);
        _super.call(this, imagen, x, y);
        this.centro_x = 23;
        this.centro_y = 23;
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
var Pelota = (function (_super) {
    __extends(Pelota, _super);
    function Pelota(x, y) {
        var imagen = "pelota.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 25;
        this.centro_y = 25;
        this.radio_de_colision = 25;

        this.aprender(pilas.habilidades.RebotarComoPelota);
        window['aaa'] = this;
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
                this.centro_x = 7;
                this.centro_y = 7;
                break;

            case 'media':
                this.centro_x = 16;
                this.centro_y = 16;
                break;

            case 'grande':
                this.centro_x = 26;
                this.centro_y = 26;
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
var Proyectil = (function (_super) {
    __extends(Proyectil, _super);
    function Proyectil(x, y, atributos) {
        var imagen = pilas.imagenes.cargar_grilla("disparos/misil.png", 3);
        atributos['centro_x'] = 20;
        atributos['centro_y'] = 8;
        _super.call(this, imagen, x, y, atributos);

        this.paso = 0;
        this.enemigos = [];
    }
    Proyectil.prototype.actualizar = function () {
        this.paso += 0.1;
        this._imagen.definir_cuadro(parseInt(this.paso) % 2);

        // TODO: Convertir en una habilidad.
        this.avanzar_respecto_del_angulo();
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

    Proyectil.prototype.avanzar_respecto_del_angulo = function () {
        var velocidad = 2;
        var rotacion_en_radianes;
        var dx;
        var dy;

        var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.rotacion + 90 - 90);

        dx = Math.cos(rotacion_en_radianes) * velocidad;
        dy = Math.sin(rotacion_en_radianes) * velocidad;

        this.x += dx;
        this.y += dy;
    };
    return Proyectil;
})(Actor);
/// <reference path="actor.ts"/>
var Texto = (function (_super) {
    __extends(Texto, _super);
    function Texto(x, y, texto) {
        var imagen = "invisible.png";
        _super.call(this, imagen, x, y);
        this.centro_x = 18;
        this.centro_y = 18;
        this.texto = texto || "Sin texto";
        this.crear_texto();
        this.transparencia = 100;
    }
    Texto.prototype.crear_texto = function () {
        var s = new createjs.Text(this.texto, "12px Arial", "black");
        var pos = pilas.escena_actual().obtener_posicion_pantalla(this.x, this.y);
        s.x = pos.x - 25;
        s.y = pos.y - (35 + 15);
        s.textBaseline = "bottom";
        s.textAlign = "center";

        pilas.escena_actual().stage.addChild(s);
        this.sprite_texto = s;
    };

    Texto.prototype.eliminar_texto = function () {
        pilas.escena_actual().stage.removeChild(this.sprite_texto);
    };

    Texto.prototype.eliminar = function () {
        this.eliminar_texto();
        _super.prototype.eliminar.call(this);
    };
    return Texto;
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
    };
    return Zanahoria;
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
        this.centro_x = 320 / 2;
        this.centro_y = 240 / 2;
    }
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
            y: this.centro_y + this.y
        };
    };

    /*
    * Convierte una coordenada de pilas (donde 0,0 es el centro de pantalla)
    * en una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda).
    */
    Camara.prototype.convertir_de_posicion_relativa_a_fisica = function (x, y) {
        var centro = this.obtener_posicion();
        return {
            x: centro.x + x,
            y: centro.y - y
        };
    };

    /*
    * Convierte una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda)
    * en una coordenada de pilas (donde 0,0 es el centro de pantalla).
    */
    Camara.prototype.convertir_de_posicion_fisica_a_relativa = function (x, y) {
        var centro = this.obtener_posicion();
        return {
            x: -centro.x + x,
            y: +centro.y - y
        };
    };
    return Camara;
})();
var Colisiones = (function () {
    function Colisiones() {
        this.colisiones = [];
    }
    Colisiones.prototype.agregar = function (grupo_a, grupo_b, funcion_a_llamar) {
        if (grupo_a.length === undefined)
            grupo_a = [grupo_a];

        if (grupo_b.length === undefined)
            grupo_b = [grupo_b];

        this.colisiones.push({ grupo_a: grupo_a, grupo_b: grupo_b, callback: funcion_a_llamar });
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
                    tupla.callback.call(this, actor_a, actor_b);
                    // TODO: implementar alguna forma para quitar a los actores del
                    //       grupo si es que ya no están vivos.
                }
            }
        }
    };
    return Colisiones;
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
    };

    CaminarBase.prototype.actualizar = function () {
        this.mover();
        this.pasos -= 0.05;

        if (this.pasos <= 0.05) {
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
    }
    return Comportamientos;
})();
/// <reference path="simbolos.ts />
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

        this.eliminar_todos_los_modos();

        if (modos.radios_de_colision)
            this.modos.push(new ModoRadiosDeColision());

        if (modos.puntos_de_control)
            this.modos.push(new ModoPuntosDeControl());

        if (modos.fisica)
            this.modos.push(new ModoFisica());

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

var ModoRadiosDeColision = (function () {
    function ModoRadiosDeColision() {
        this.container = new createjs.Container();

        this.shape = new createjs.Shape();
        this.container.addChild(this.shape);

        this.text_modo = new createjs.Text("F9 ModoRadiosDeColision habilitado", "12px Arial", "white");
        this.container.addChild(this.text_modo);

        pilas.escena_actual().stage.addChild(this.container);
    }
    ModoRadiosDeColision.prototype.eliminar = function () {
        pilas.escena_actual().stage.removeChild(this.container);
    };

    ModoRadiosDeColision.prototype.actualizar = function () {
        var escena = pilas.escena_actual();
        this.shape.graphics.clear();

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

            this.shape.graphics.beginStroke("#FFF").drawCircle(posicion.x, posicion.y, actor.radio_de_colision).endStroke();
        }
    };
    return ModoRadiosDeColision;
})();

var ModoPuntosDeControl = (function () {
    function ModoPuntosDeControl() {
        this.container = new createjs.Container();

        this.shape = new createjs.Shape();
        this.container.addChild(this.shape);

        this.text_modo = new createjs.Text("F12 ModoPosición habilitado", "12px Arial", "white");
        this.text_modo.y = 15;
        this.container.addChild(this.text_modo);

        this.text_coordenada = new createjs.Text("Posición del mouse: x=12 y=33", "12px Arial", "white");
        this.text_coordenada.y = 220;
        this.text_coordenada.x = 120;
        this.container.addChild(this.text_coordenada);
        this.eje = new pilas.actores.Eje();

        pilas.escena_actual().stage.addChild(this.container);
    }
    ModoPuntosDeControl.prototype.eliminar = function () {
        pilas.escena_actual().stage.removeChild(this.container);
        this.eje.eliminar();
    };

    ModoPuntosDeControl.prototype.actualizar = function () {
        var escena = pilas.escena_actual();
        this.shape.graphics.clear();

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
            var size = 3;

            // Dibuja una cruz
            this.shape.graphics.beginStroke("#ffffff").moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
            this.shape.graphics.beginStroke("#ffffff").moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();
        }

        var pos = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
        this.text_coordenada.text = "Posición del mouse: x=" + Math.floor(pos.x) + " y=" + Math.floor(pos.y);
    };
    return ModoPuntosDeControl;
})();

var ModoFisica = (function () {
    function ModoFisica() {
        this.container = new createjs.Container();

        this.shape = new createjs.Shape();
        this.container.addChild(this.shape);

        this.text_modo = new createjs.Text("F11 ModoFisica habilitado", "12px Arial", "white");
        this.container.addChild(this.text_modo);

        pilas.escena_actual().stage.addChild(this.container);
    }
    ModoFisica.prototype.eliminar = function () {
        pilas.escena_actual().stage.removeChild(this.container);
    };

    ModoFisica.prototype.actualizar = function () {
        var escena = pilas.escena_actual();
        this.shape.graphics.clear();
        this.shape.graphics.setStrokeStyle(3);
        escena.fisica.dibujar_figuras_sobre_lienzo(this.shape.graphics);
    };
    return ModoFisica;
})();
/// <reference path="camara.ts />
/// <reference path="evento.ts />
/// <reference path="control.ts />
var Base = (function () {
    function Base() {
        this.click_de_mouse = new Evento('click_de_mouse');
        this.cuando_termina_click = new Evento('cuando_termina_click');
        this.mueve_mouse = new Evento('mueve_mouse');
        this.pulsa_tecla = new Evento('pulsa_tecla');
        this.suelta_tecla = new Evento('suelta_tecla');
        this.actualiza = new Evento('actualiza');
        this.stage = new createjs.Stage(pilas.canvas);
        this.camara = new Camara();
        this.fisica = new Fisica(this.camara);
        this.control = new Control(this);
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
    }
    Normal.prototype.actualizar = function () {
        this.fisica.actualizar();

        for (var i = 0; i < this.actores.length; i++) {
            this.actores[i].pre_actualizar();
            this.actores[i].actualizar();
        }

        //this.ordenar_actores_por_valor_z();
        this.stage.update();
        this.actualiza.emitir();
        pilas.colisiones.verificar_colisiones();
    };

    Normal.prototype.ordenar_actores_por_valor_z = function () {
        var sortFunction = function (item1, item2, options) {
            if (item1.z < item2.z)
                return -1;

            if (item1.z > item2.z)
                return 1;

            return 0;
        };
        this.stage.sortChildren(sortFunction);
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
    b2DebugDraw: Box2D.Dynamics.b2DebugDraw
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

    Figura.prototype.definir_radio = function (radio) {
        var fixture = this.cuerpo.GetFixtureList();

        if (fixture) {
            var shape = fixture.GetShape();
            shape.SetRadius(convertir_a_metros(radio));
        }
    };

    Figura.prototype.obtener_radio = function () {
        var fixture = this.cuerpo.GetFixtureList();

        if (fixture) {
            var shape = fixture.GetShape();
            return convertir_a_pixels(shape.GetRadius());
        }
    };
    return Figura;
})();

var Rectangulo = (function (_super) {
    __extends(Rectangulo, _super);
    function Rectangulo(fisica, x, y, ancho, alto, opciones) {
        _super.call(this, fisica);

        if (opciones.dinamico === undefined)
            opciones.dinamico = true;

        var bodyDef = new box2d.b2BodyDef();

        if (opciones.dinamico)
            bodyDef.type = box2d.b2Body.b2_dynamicBody;
else
            bodyDef.type = box2d.b2Body.b2_staticBody;

        var pos = this.fisica.camara.convertir_de_posicion_relativa_a_fisica(x, y);
        bodyDef.position.Set(convertir_a_metros(pos.x), convertir_a_metros(pos.y));

        //bodyDef.userData=data;
        var polygonShape = new box2d.b2PolygonShape();
        polygonShape.SetAsBox(convertir_a_metros(ancho / 2), convertir_a_metros(alto / 2));

        var fixtureDef = new box2d.b2FixtureDef();
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
        opciones.dinamico = opciones.dinamico || true;
        var fixDef = new Box2D.Dynamics.b2FixtureDef();

        fixDef.density = opciones.densidad || 1.0;
        fixDef.friction = opciones.friccion || 0.5;
        fixDef.restitution = opciones.restitucion || 0.2;

        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(convertir_a_metros(radio));

        // crear el body dinamico
        var bodyDef = new Box2D.Dynamics.b2BodyDef();

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
    return Circulo;
})(Figura);

var Fisica = (function () {
    function Fisica(camara) {
        this.camara = camara;
        this.mundo = new box2d.b2World(new box2d.b2Vec2(0, 10), false);
        this.Rectangulo = Rectangulo;
        this.Circulo = Circulo;
        this.velocidad = 1.0;
        this.timeStep = this.velocidad / 120.0;

        // Bordes del escenario
        this.crear_rectangulo(0, -118, 320, 5, { dinamico: false });
        this.crear_rectangulo(0, 118, 320, 5, { dinamico: false });
        this.crear_rectangulo(-158, 0, 5, 240, { dinamico: false });
        this.crear_rectangulo(158, 0, 5, 240, { dinamico: false });
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
            y: vector_salida.y * PPM + y
        };
    };

    Fisica.prototype.createBox = function (width, height, pX, pY, type, data) {
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = type;
        bodyDef.position.Set(pX / PPM, pY / PPM);

        //bodyDef.userData=data;
        var polygonShape = new box2d.b2PolygonShape();
        polygonShape.SetAsBox(width / 2 / PPM, height / 2 / PPM);

        var fixtureDef = new box2d.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;

        var body = this.mundo.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);
    };

    Fisica.prototype.crear_rectangulo = function (x, y, ancho, alto, opciones) {
        return new this.Rectangulo(this, x, y, ancho, alto, opciones);
    };

    Fisica.prototype.crear_circulo = function (x, y, radio, opciones) {
        return new this.Circulo(this, x, y, radio, opciones);
    };
    return Fisica;
})();
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
        _super.call(this, "fondos/tarde.jpg", 0, 0);
        this.z = 1000;
        this.y = 120;
    }
    return Tarde;
})(Fondo);

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
        s.graphics.drawRect(-160, -120, 320, 240);
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
        this.centro_x = 0;
        this.centro_y = 0;
    }
    Pasto.prototype.crear_sprite = function () {
        var img = this._imagen.imagen;
        var s = new createjs.Shape();

        s.graphics.beginBitmapFill(img, 'repeat');
        s.graphics.drawRect(-160, -120, 320, 240);
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

var Fondos = (function () {
    function Fondos() {
        this.Plano = Plano;
        this.Pasto = Pasto;
        this.PastoCuadriculado = PastoCuadriculado;
        this.Tarde = Tarde;
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
        this.con_rotacion = this.argumentos.con_rotacion || true;

        receptor.id = this.argumentos.objeto_a_imitar.id;
        receptor.figura = this.argumentos.objeto_a_imitar;
    }
    Imitar.prototype.actualizar = function () {
        this.receptor.x = this.objeto_a_imitar.x;
        this.receptor.y = this.objeto_a_imitar.y;
        if (this.con_rotacion == true) {
            this.receptor.rotacion = this.objeto_a_imitar.rotacion;
        }
    };
    return Imitar;
})(Habilidad);

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
                this.comienza_a_arrastrar();
            }
        }
    };

    Arrastrable.prototype.cuando_arrastra = function (evento) {
        if (this.receptor.colisiona_con_un_punto(evento.x, evento.y))
            document.body.style.cursor = "move";
else
            document.body.style.cursor = "default";

        if (this.debe_arrastrar === true) {
            if (this.receptor.tiene_fisica()) {
                this.receptor.figura.definir_posicion(evento.x, evento.y);
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

    Arrastrable.prototype.comienza_a_arrastrar = function () {
        if (this.receptor.tiene_fisica())
            this.receptor.figura.cuerpo.SetType(0);

        this.debe_arrastrar = true;
    };

    Arrastrable.prototype.termina_de_arrastrar = function () {
        if (this.receptor.tiene_fisica())
            this.receptor.figura.cuerpo.SetType(2);

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
        var rectangulo = pilas.escena_actual().fisica.crear_rectangulo(receptor.x, receptor.y, receptor.radio_de_colision, receptor.radio_de_colision, {});
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
            if (this.receptor.izquierda > 160)
                this.receptor.derecha = -160;

            if (this.receptor.derecha < -160)
                this.receptor.izquierda = 160;

            if (this.receptor.abajo > 120)
                this.receptor.arriba = -120;

            if (this.receptor.arriba < -120)
                this.receptor.abajo = 120;
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
    }
    return Habilidades;
})();
var Imagenes = (function () {
    function Imagenes(callback_onready, data_path) {
        this.recursos = {};
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

        this.cargar_recurso('sin_imagen.png');

        this.cargar_recurso('plano.png');
        this.cargar_recurso('nave.png');

        this.cargar_recurso('piedra_chica.png');
        this.cargar_recurso('piedra_grande.png');
        this.cargar_recurso('piedra_media.png');
        this.cargar_recurso('ejes.png');

        this.cargar_recurso('disparos/misil.png');
        this.cargar_recurso('rpg/maton.png');
        this.cargar_recurso('pasto.png');
        this.cargar_recurso('pasto_cuadriculado.png');
        this.cargar_recurso('globo.png');
        this.cargar_recurso('bloque.png');
        this.cargar_recurso('manzana_chica.png');
        this.cargar_recurso('invisible.png');
        this.cargar_recurso('cofre.png');
        this.cargar_recurso('llave.png');
        this.cargar_recurso('cesto.png');
        this.cargar_recurso('pelota.png');
        this.cargar_recurso('zanahoria_normal.png');
        this.cargar_recurso('zanahoria_sonrie.png');

        this.cargar_recurso('fondos/tarde.jpg');
        //this.cargar_recurso('cooperativista/alerta.png');
        //this.cargar_recurso('cooperativista/camina.png');
        //this.cargar_recurso('cooperativista/camina_sujeta.png');
        //this.cargar_recurso('cooperativista/ok.png');
        //this.cargar_recurso('cooperativista/parado.png');
        //this.cargar_recurso('cooperativista/parado_sujeta.png');
        //this.cargar_recurso('cooperativista/trabajando.png');
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
            throw "No se puede encontrar la imagen: " + nombre + " ¿ha sido pre-cargada en el archivo imagenes.ts?";
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
            images: [this.ruta.src],
            frames: { width: this.ancho / this.columnas, height: this.alto / this.filas }
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

        if (this.cuadro >= this.cantidad_cuadros) {
            this.cuadro = 0;
            ha_avanzado = false;
        }

        this.definir_cuadro(this.cuadro);
        return ha_avanzado;
    };
    return Grilla;
})(Imagen);
var Interpolaciones = (function () {
    function Interpolaciones() {
    }
    Interpolaciones.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo) {
        var tiempo = tiempo || 1000;
        var step = tiempo / valor_o_valores.length;
        var tween = createjs.Tween.get(objeto);

        for (var i = 0; i < valor_o_valores.length; i++) {
            var attr = atributo.toString();
            var diccionario = {};
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

    Mundo.prototype.obtener_modos = function () {
        return this.depurador.obtener_modos();
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
/// <reference path="comportamientos.ts />
/// <reference path="colisiones.ts />
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
        this.actores = new Actores();
        this.habilidades = new Habilidades();
        this.comportamientos = new Comportamientos();
        this.obtener_canvas();
        this.definir_tamano_del_canvas();
        this.conectar_eventos();

        this.imagenes = new Imagenes(this.onready, this.opciones.data_path);
        this.fondos = new Fondos();
        this.mundo = new Mundo();
        this.interpolaciones = new Interpolaciones();
        this.utils = new Utils();
        this.colisiones = new Colisiones();

        this.mundo.gestor_escenas.cambiar_escena(new Normal());
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
        this.opciones.ancho = opciones.ancho || 320;
        this.opciones.alto = opciones.alto || 240;
        this.opciones.data_path = opciones.data_path || 'data';
        this.opciones.canvas_id = opciones.canvas_id || 'canvas';
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
        this.canvas = document.getElementById(this.opciones.canvas_id);

        if (!this.canvas)
            throw new Error("No se encuentra el elemento canvas (id='" + this.opciones.canvas_id + "')");
    };

    /**
    * @method onready
    * Callback que se invoca una vez que pilas puede comenzar a funcionar.
    */
    Pilas.prototype.onready = function () {
        throw "pilas-engine ha iniciado, pero el metodo onready está vacío. Tienes que sobre-escribirlo...";
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
        this.mundo.actualizar();
    };

    Pilas.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolaciones.interpolar(objeto, atributo, valor_o_valores, tiempo);
    };

    Pilas.prototype.definir_modos = function (modos) {
        this.mundo.definir_modos(modos);
    };

    Pilas.prototype.mostrar_posiciones = function () {
        var modos = this.mundo.obtener_modos();
        modos.puntos_de_control = true;
        this.definir_modos(modos);
        return "Mostrando posiciones";
    };

    Pilas.prototype.ocultar_posiciones = function () {
        var modos = this.mundo.obtener_modos();
        modos.puntos_de_control = false;
        this.definir_modos(modos);
        return "Ocultando posiciones";
    };

    Pilas.prototype.mostrar_fisica = function () {
        var modos = this.mundo.obtener_modos();
        modos.fisica = true;
        this.definir_modos(modos);
        return "Mostrando fisica";
    };

    Pilas.prototype.ocultar_fisica = function () {
        var modos = this.mundo.obtener_modos();
        modos.fisica = false;
        this.definir_modos(modos);
        return "Ocultando fisica";
    };
    return Pilas;
})();

pilas = new Pilas();
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
        return Math.uuid();
    };

    Utils.prototype.distancia = function (a, b) {
        return Math.abs(b - a);
    };

    Utils.prototype.fabricar = function (clase, cantidad, posiciones_al_azar) {
        if (typeof cantidad === "undefined") { cantidad = 1; }
        if (typeof posiciones_al_azar === "undefined") { posiciones_al_azar = true; }
        var objetos_creados = [];

        for (var i = 0; i < cantidad; i++) {
            if (posiciones_al_azar) {
                var x = Math.floor(Math.random() * (100 - (-100 + 1))) - 100;
                var y = Math.floor(Math.random() * (100 - (-100 + 1))) - 100;
            } else {
                var x = 0;
                var y = 0;
            }

            var nuevo = new clase(x, y);
            objetos_creados.push(nuevo);
        }

        return objetos_creados;
    };
    return Utils;
})();
