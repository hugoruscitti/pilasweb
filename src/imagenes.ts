class Imagenes {
    nombresImagenes = [
        'aceituna.png', 'aceituna_grita.png', 'aceituna_risa.png',
        'aceituna_burla.png',

        'banana.png', 'bomba.png', 'caja.png', 'explosion.png',
        'sin_imagen.png',
        'plano.png', 'alien.png', 'alien_marron.png', 'tuerca.png', 'nave.png',
        'piedra_chica.png', 'piedra_grande.png', 'piedra_media.png', 'ejes.png',
        'disparos.misil.png', 'rpg.maton.png', 'pasto.png',
        'pasto_cuadriculado.png', 
        'globo.png', 'balloon.png', 'balloon-tip-right.png', 'balloon-tip-left.png',
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
        'cooperativista.trabajando.png',
    ];
  data_path: string;
  recursos;
  imagenes_solicitadas;
  loader;

  constructor(callback_onready, opciones) {
    this.recursos = {}
    this.data_path = opciones.data_path;
    this.loader = new PxLoader();
    this.imagenes_solicitadas = 0;

    this.nombresImagenes = this.nombresImagenes.concat(opciones.imagenesExtra);
    this.cargar_recursos();

    //loader.addProgressListener(function (e) {
    //    this.actualizar_progreso(e);
    //            return true
    // });

    this.loader.addCompletionListener(function(e) {
      pilas.ready = true;
      pilas.escena_actual().iniciar();
      pilas.onready();
      pilas.ejecutar();
    });

    this.loader.start();
  }

  private cargar_recursos() {
    var _this = this;
    this.nombresImagenes.forEach(function(nombre){
            _this.cargar_recurso(nombre);
        });
  }

  private cargar_recurso(nombre) {
    var path = this.data_path + '/' + nombre;
    this.recursos[nombre] = this.loader.addImage(path);
    this.imagenes_solicitadas += 1;
  }

  cargar(nombre) {
    if (nombre in this.recursos)
      return new Imagen(this.recursos[nombre]);
    else
      throw "No se puede encontrar la imagen: '" + nombre + "' ¿ha sido pre-cargada en el archivo imagenes.ts?";
  }

  cargar_grilla(nombre, columnas=1, filas=1) {
    return new Grilla(this.recursos[nombre], columnas, filas);
  }

  cargar_animacion(nombre, columnas=1, filas=1) {
    return new Animacion(this.recursos[nombre], columnas, filas);
  }
}

class Imagen {
  ruta;
  imagen;

  constructor(imagen) {
    this.ruta = imagen;
    this.imagen = imagen;
  }

  instanciar() {
    return new createjs.Bitmap(this.imagen);
  }

  avanzar(velocidad=60) {
    return false;
  }

  get ancho() {return this.imagen.width}
  get alto() {return this.imagen.height}
}

class Grilla extends Imagen {
  columnas;
  filas;
  sprite;
  cuadro;

  constructor(imagen, columnas=1, filas=1) {
    super(imagen);
    this.columnas = columnas;
    this.filas = filas;
    this.cuadro = 0;
  }

  instanciar() {
    var data = {
       images: [this.ruta.src],
       frames: {width: this.ancho, height: this.alto},
    };
    var spritesheet = new createjs.SpriteSheet(data);

    this.sprite = new createjs.Sprite(spritesheet);
    this.definir_cuadro(0);
    return this.sprite;
  }

  get cantidad_cuadros() {
    return this.filas * this.columnas;
  }

  definir_cuadro(numero_de_cuadro) {
    this.cuadro = numero_de_cuadro;
    this.sprite.gotoAndStop(numero_de_cuadro);
  }

  avanzar(velocidad=60) {
    var ha_avanzado = true;
    this.cuadro +=1;

    if (this.cuadro >= this.cantidad_cuadros) {
      this.cuadro = 0;
      ha_avanzado = false;
    }

    this.definir_cuadro(this.cuadro);
    return ha_avanzado;
  }

  get ancho() {return this.imagen.width / this.columnas;}
  get alto() {return this.imagen.height / this.filas;}
}


class Animacion extends Grilla {
  animaciones;
  animacion_en_curso;
  cuadro_en_la_animacion;
  _ticks_acumulados;

  constructor(imagen, columnas=1, filas=1) {
    super(imagen, columnas, filas);
    this.animaciones = {};
    this.animacion_en_curso = null
    this.cuadro_en_la_animacion = 0
    this._ticks_acumulados = 0;
  }

  definir_animacion(nombre, cuadros, velocidad) {
    this.animaciones[nombre] = {
      cuadros: cuadros,
      velocidad: velocidad
    };
  }

  cargar_animacion(nombre) {
    if (this.animacion_en_curso !== this.animaciones[nombre]) {
      this._ticks_acumulados = 0;
      this.animacion_en_curso = this.animaciones[nombre];
      this.cuadro_en_la_animacion = 0;
      this.definir_cuadro(this.animacion_en_curso["cuadros"][this.cuadro_en_la_animacion])
    }
  }

  avanzar(velocidad=-1) {
    if (velocidad !== -1)
      throw new Error("Tienes que definir la velocidad usando 'definir_animacion' no llamando al metodo avanzar con un numero.");

    if (! this.animacion_en_curso)
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

      this.definir_cuadro(this.animacion_en_curso['cuadros'][this.cuadro_en_la_animacion])
      this.cuadro_en_la_animacion += 1;
    }

    return ha_avanzado;
  }
}
