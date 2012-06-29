define(['actores', 'mootools', 'utils', 'libs/easeljs-0.4.2.min', 'libs/Box2dWeb-2.1.a.3.min'], function(actores, mootools, utils, easel, box2d){

    var Fisica = new Class({

        initialize: function() {
            var Vector = Box2D.Common.Math.b2Vec2;
            var World = Box2D.Dynamics.b2World;

            this.world = new World(new Vector(0, 10), true);
        },
        crear_circulo: function() {
            return "pepe"
        },
    });



    var Estudiante = new Class({
        habilidades: [],
        aprender: function(habilidad) {
            habilidad.iniciar(this)
            this.habilidades.push(habilidad)
        },

        actualizar_habilidades: function() {
            for (var i=0; i<this.habilidades.length; i++) {
                this.habilidades[i].actualizar()
            }
        }
    })

    var Habilidad = new Class({
        iniciar: function(actor) {
            this.actor = actor;
        },
        actualizar: function() {
        },
    })

    var Girar = new Class({
        Extends: Habilidad,
        actualizar: function() {
            this.actor.rotacion += 1
        },
    })

    var RebotarComoPelota = new Class({
        Extends: Habilidad,
        initialize: function() {
            this.figura = pilas.fisica.crear_circulo();
        },
        actualizar: function() {
            //this.actor.x = this.figura.GetWorldCenter().x;
            //this.actor.y = this.figura.GetWorldCenter().y;
        },
    })

    var Actor = new Class({
        Implements: [Estudiante],

        initialize: function(imagen, x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
            this.imagen = new Bitmap(imagen)
            this.inicializar(x, y, centro_x, centro_y, escala_x, escala_y, rotacion)
            pilas.agregar_actor(this)
        },

        inicializar: function(x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
            this.x = x || 0
            this.y = y || 0
            this.centro_x = centro_x || 0
            this.centro_y = centro_y || 0

            this.escala_x = escala_x || 1
            this.escala_y = escala_y || 1
            this._rotacion = rotacion || 0
        },

        actualizar: function() {
            this.actualizar_habilidades()
        },

        dibujar: function(contexto) {
            contexto.save()

            contexto.translate(this.x, -this.y)
            pilas.camara.fijar_posicion(contexto)
            contexto.rotate(pilas.utils.convertir_a_radianes(this._rotacion))
            contexto.scale(this.escala_x, this.escala_y)
            contexto.translate(-this.centro_x, -this.centro_y)
            this.imagen.draw(contexto)

            contexto.restore()
        },

        eliminar: function() {
            pilas.eliminar_actor(this)
        },


        definir_centro: function(dx, dy) {
            if (dx === "centro")
                dx = this.imagen.image.width / 2

            if (dy === "centro")
                dy = this.imagen.image.height / 2

            this.centro_x = Math.round(dx)
            this.centro_y = Math.round(dy)
        }
    });

    var Texto = new Class({
        Extends: Actor,
        initialize: function(texto, x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
            this.texto = texto
            this.imagen = new Text(this.texto, "22px arial")
            this.imagen.textBaseline = "top"
            this.inicializar(x, y, centro_x, centro_y, escala_x, escala_y, rotacion)
            pilas.agregar_actor(this)
        },

    });

    var Aceituna = new Class({
        Extends: Actor,
        initialize: function(x, y, centro_x, centro_y, escala_x, escala_y, rotacion) {
            this.parent("sin_imagen.png", x, y, centro_x, centro_y, escala_x, escala_y, rotacion)
            pilas.imagenes.cargar("aceituna.png", this, this.listo);
        },
        listo: function(actor, imagen) {
            console.log(this)
            console.log(actor.imagen)
            actor.imagen = new Bitmap(imagen.src)
            actor.definir_centro("centro", "centro")
        },
    });


    function alias(obj, longcut, shortcut) {
        obj.__defineGetter__(shortcut, function(){return this[longcut]});
        obj.__defineSetter__(shortcut, function(v){this[longcut] = v;});
    }


    alias(Texto.prototype, 'escala_x', 'es');

    function get_rotacion() {
        return this._rotacion
    }

    function set_rotacion(value) {
        this._rotacion = value;
    }

    function accesors(obj, name, getter, setter) {
        obj.__defineGetter__(name, getter)
        obj.__defineSetter__(name, setter)
    }

    accesors(Actor.prototype, 'rotacion', get_rotacion, set_rotacion)

    /* for(var v in Actor.prototype) {console.log(v)} */

    /*
    Texto.prototype.__defineSetter__("escala", function(valor) {
        this.escala_x = valor;
        this.escala_y = valor;
    });
    */

    var Camara = new Class({
        initialize: function(canvas) {
            this.canvas = canvas
            this.x = 0
            this.y = 0
            this.centro_x = canvas.width / 2
            this.centro_y = canvas.height / 2
        },

        fijar_posicion: function(contexto) {
            contexto.translate(this.centro_x - this.x, this.centro_y + this.y);
        },
    })

    var Imagenes = new Class({
        cargar: function(archivo, obj, callback_ready) {
            var image = new Image()
            var rutas = [archivo, "data/" + archivo, "/data/" + archivo, "http://github.com/hugoruscitti/pilasweb/raw/master/data/" + archivo]

            /* Ejecuta el método callback_ready cuando la imagen se carga satisfactoriamente */
            image.onload = function() {
                callback_ready(obj, image)
            }

            /* Intenta cargar la imagen buscando en distintas rutas.
             * La imagen se busca primero en el directorio del código HTML, pero
             * si no está busca en distintas rutas (incluso en el repositorio de pilas-engine).
             */
            image.onerror = function(e) {
                image.onerror = function(e) {
                    image.onerror = function(e) {
                        image.onerror = function(e) {
                            throw "Error, no se pudo obtener la imagen '" + archivo + "'"
                        }
                        image.src = rutas[3]
                    }
                    image.src = rutas[2]
                }
                image.src = rutas[1];
            }
            image.src = rutas[0];
        },
    });

    var Pilas = new Class({

        initialize: function(id_canvas) {
            this.canvas = document.id(id_canvas)
            this.stage = new Stage(this.canvas)
            this.contexto = this.canvas.getContext("2d")
            this.lista_actores = []
            this.camara = new Camara(this.canvas)
            this.imagenes = new Imagenes()
            this.utils = new Utils()
            this.fisica = new Fisica()

            Ticker.setFPS(60)
            Ticker.addListener(this)
        },

        /*
         * Agrega un actor a la lista de actores a dibujar y actualizar.
         */
        agregar_actor: function(actor) {
            this.lista_actores.push(actor)
        },

        eliminar_actor: function(actor) {
            this.lista_actores.erase(actor)
        },

        _actualizar_y_dibujar_actores: function(c) {

            this._limpiar(c)

            for (var i=0; i<this.lista_actores.length; i++) {
                var actor = this.lista_actores[i]
                actor.actualizar();
                actor.dibujar(c)
            }
        },

        /* Borra toda la pantalla */
        _limpiar: function(c) {
            c.clearRect(0, 0, this.canvas.width, this.canvas.height)
        },

        /* 
         * Función de respuesta que se llama 60 veces por segundo.
         */
        tick: function() {
            this._actualizar_y_dibujar_actores(this.contexto)
        },

        /* Submodulo de actores */
        actores: {
            Actor: Actor,
            Texto: Texto,
            Aceituna: Aceituna,
            },

        habilidades: {
            Girar: Girar,
            RebotarComoPelota: RebotarComoPelota,
        },
    });

    var Utils = new Class({

        convertir_a_radianes: function (grados) {
            return grados * (Math.PI / 180);
        },

        convertir_a_grados: function (radianes) {
            return radianes * (180 / Math.PI);
        },

    });





    return {
        Pilas:Pilas,
    }
})
