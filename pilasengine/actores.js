define(['require', 'singleton', 'mootools', 'singleton'], function(require, singleton, mootools, singleton){

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
                this.imagen = new Bitmap("../data/" + imagen)
                this.inicializar(x, y, centro_x, centro_y, escala_x, escala_y, rotacion)

                singleton.get().agregar_actor(this)
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
                singleton.get().camara.fijar_posicion(contexto)
                //contexto.rotate(singleton.get().utils.convertir_a_radianes(this._rotacion))
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
                console.log("Solicitando imagen.");
                var imagen = singleton.get().imagenes.cargar("aceituna.png", this, this.listo);
                console.log("Imagen lista");
            },
            listo: function(actor, imagen) {
                console.log(this)
                console.log(actor.imagen)
                actor.imagen = new Bitmap(imagen.src)
                actor.definir_centro("centro", "centro")
            },
        });


    return {
        Actor: Actor,
        Aceituna: Aceituna,
        Texto: Texto,
    }
})
