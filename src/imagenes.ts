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
      throw "No se puede encontrar la imagen: " + nombre;
  }

  cargar_grilla(nombre, columnas=1, filas=1) {
    return new Grilla(this.recursos[nombre], columnas, filas);
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

  avanzar() {
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
