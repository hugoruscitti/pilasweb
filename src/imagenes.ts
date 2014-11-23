class Imagenes {
  data_path: string;
  recursos;
  imagenes_solicitadas;
  loader;

  constructor(callback_onready, data_path) {
    this.recursos = {}
    this.data_path = data_path;
    this.loader = new PxLoader();
    this.imagenes_solicitadas = 0;

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
    this.cargar_recurso('alien_camina.png');
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
    this.cargar_recurso('boton/boton_normal.png');
    this.cargar_recurso('boton/boton_over.png');
    this.cargar_recurso('boton/boton_press.png');

    this.cargar_recurso('fondos/tarde.jpg');
    this.cargar_recurso('monkey_normal.png');
    this.cargar_recurso('monkey_smile.png');
    this.cargar_recurso('monkey_shout.png');
    this.cargar_recurso('tortuga.png');

    this.cargar_recurso('pingu.png');
    this.cargar_recurso('sombra.png');

    //this.cargar_recurso('cooperativista/alerta.png');
    //this.cargar_recurso('cooperativista/camina.png');
    //this.cargar_recurso('cooperativista/camina_sujeta.png');
    //this.cargar_recurso('cooperativista/ok.png');
    //this.cargar_recurso('cooperativista/parado.png');
    //this.cargar_recurso('cooperativista/parado_sujeta.png');
    //this.cargar_recurso('cooperativista/trabajando.png');
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
       frames: {width: this.ancho / this.columnas, height: this.alto / this.filas},
    };
    var spritesheet = new createjs.SpriteSheet(data);

    this.sprite = new createjs.BitmapAnimation(spritesheet);
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
    this._ticks_acumulados += velocidad_de_animacion
    var ha_avanzado = true

    if (this._ticks_acumulados > 1000.0) {
      this._ticks_acumulados -= 1000.0

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
