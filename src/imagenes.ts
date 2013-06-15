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

    this.loader.start();
  }

  cargar_recurso(nombre) {
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

  cargar_grilla(nombre, columnas, filas) {
    return new Grilla(this.recursos[nombre], columnas, filas);
  }
}

class Imagen {
  imagen;

  constructor(imagen) {
    this.imagen = imagen;
  }

  dibujar(painter, x, y, dx, dy, escala_x, escala_y, rotacion, transparencia) {
    painter.save();
    painter.translate(x, y);
    painter.scale(escala_x, escala_y);
    painter.rotate(rotacion * (Math.PI / 180));
    painter.drawImage(this.imagen, -dx, -dy, this.imagen.width, this.imagen.height);
    painter.restore()
  }
}

class Grilla extends Imagen {
  columnas;
  filas;

  constructor(imagen, columnas, filas) {
    super(imagen);
    this.columnas = columnas;
    this.filas = filas;
  }
}
