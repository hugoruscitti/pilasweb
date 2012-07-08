define(['mootools'], function(mootools) {
    var Imagenes = new Class({

        initialize: function(prefijo) {
            this.prefijo = prefijo || "data/";
        },

        cargar: function(ruta) {
            var imagen = new Bitmap(this.prefijo + ruta);
            return imagen;
        }
    });


    /*
    var Imagenes = new Class({

        initialize: function() {
            this.loader = new PxLoader()
            this.loader.addCompletionListener(function(){
                console.log("Listo, se cargaron todas las imagenes")
            })
        },

        comenzar: function() {
            this.loader.start()
        },

        cargar: function(archivo, inmediatamente, callback) {
            inmediatamente = inmediatamente || true

            //var rutas = [archivo, "data/" + archivo, "/data/" + archivo, 
            //            "http://github.com/hugoruscitti/pilasweb/raw/master/data/" + archivo]
            
            var imagen = this.loader.addImage(archivo)

            if (inmediatamente)
                this.comenzar()

            return imagen;
        },
    })
    */

        /*
        _deprecated: function() {

            // Ejecuta el método callback_ready cuando la imagen se carga satisfactoriamente
            image.onload = function() {
                callback_ready(obj, image)
            }

            // Intenta cargar la imagen buscando en distintas rutas.
            // La imagen se busca primero en el directorio del código HTML, pero
            // si no está busca en distintas rutas (incluso en el repositorio de pilas-engine).
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
    })
    */

    return {
        Imagenes: Imagenes
    };
});
