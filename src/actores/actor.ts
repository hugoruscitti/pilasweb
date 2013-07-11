/// <reference path="estudiante.ts"/>

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
class Actor extends Estudiante {
  sprite;
  _imagen;

  constructor(imagen, x, y) {
    super();
    this.imagen = imagen || 'sin_imagen.png';
    this.crear_sprite();
    this.x = x || 0;
    this.y = y || 0;
    this.centro_x = this.ancho / 2;
    this.centro_y = this.alto / 2;
    pilas.escena_actual().agregar_actor(this);
  }

  public crear_sprite() {
    this.sprite = this._imagen.instanciar();
  }

  public eliminar() {
    pilas.escena_actual().eliminar_actor(this);
  }

  get x() {
    var pos = pilas.escena_actual().obtener_posicion_escenario(this.sprite.x, 0);
    return pos.x;
  }

  set x(_x) {

    if (_x instanceof Array)
      pilas.interpolar(this, 'x', _x, 1000);
    else {
      var pos = pilas.escena_actual().obtener_posicion_pantalla(_x, 0);
      this.sprite.x = pos.x;
    }
  }

  get y() {
    var pos = pilas.escena_actual().obtener_posicion_escenario(0, this.sprite.y);
    return pos.y;
  }

  set y(_y) {
    if (_y instanceof Array)
      pilas.interpolar(this, 'y', _y, 1000);
    else {
      var pos = pilas.escena_actual().obtener_posicion_pantalla(0, _y);
      this.sprite.y = pos.y;
    }
  }

  get centro_x() {return this.sprite.regX}
  set centro_x(_x) {this.sprite.regX = _x}

  get centro_y() {return this.sprite.regY}
  set centro_y(_y) {this.sprite.regY = _y}

  get escala_x() {return this.sprite.scaleX}
  set escala_x(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite, 'scaleX', valor, 1000);
    else
      this.sprite.scaleX = valor;
  }

  get escala_y() {return this.sprite.scaleY}
  set escala_y(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite, 'scaleY', valor, 1000);
    else
      this.sprite.scaleY = valor;
  }

  get escala() {return this.escala_x}
  set escala(valor) {
    this.escala_x = valor;
    this.escala_y = valor;
  }

  get rotacion() {return this.sprite.rotation}
  set rotacion(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite, 'rotation', valor, 1000);
    else
      this.sprite.rotation = valor;
  }

  get transparencia() {return (-100 * this.sprite.alpha) + 100}
  set transparencia(_t) {this.sprite.alpha = (_t - 100) / -100}

  get ancho() {return this._imagen.ancho}
  get alto() {return this._imagen.alto}

  set imagen(_i) {
    if (_i.substring)
      this._imagen = pilas.imagenes.cargar(_i)
    else
      this._imagen = _i;
  }

  actualizar() {
  }

  pre_actualizar() {
    this.actualizar_habilidades(); // definida en estudiante.ts
  }
}
