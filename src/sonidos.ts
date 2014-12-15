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
class Sonidos {
  recursos;
  preload;

  constructor(data_path) {
    this.recursos = [];
    this.preload = new createjs.LoadQueue(true, data_path+"/");
    this.preload.installPlugin(createjs.Sound);
    this.cargar_recursos();
  }

  private cargar_recursos() {
    this.cargar_recurso('smile.ogg');
    this.cargar_recurso('shout.ogg');
    this.cargar_recurso('saltar.wav');
    this.cargar_recurso('blabla.wav');
    this.preload.loadManifest(this.recursos);
  }

  private cargar_recurso(nombre) {
    this.recursos.push({id:nombre, src:nombre});
  }

  public cargar(nombre) {
    return new Sonido(nombre)
  }
}

class Sonido {
  nombre;
  constructor(nombre) {
    this.nombre = nombre;
  }

  reproducir(repetir=false) {
    if (repetir) {
      return createjs.Sound.play(this.nombre, createjs.Sound.INTERRUPT_ANY, 0, 0, -1);
    }
    else {
      return createjs.Sound.play(this.nombre, createjs.Sound.INTERRUPT_ANY);
    }
  }

  detener() {
    return createjs.Sound.stop(this.nombre);
  }

}
