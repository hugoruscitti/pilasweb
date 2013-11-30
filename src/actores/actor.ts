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
  vivo;
  radio_de_colision;
  id;
  figura;

  constructor(imagen, x, y, atributos = {}) {
    super();
    this.imagen = imagen || 'sin_imagen.png';
    atributos = atributos || {};
    this.vivo = true;
    this.radio_de_colision = 10;
    this.id = pilas.utils.obtener_uuid();
		
		/* Se ejecuta si el usuario intenta llamar al constructor sin usar 'new' 
		
			 Por ejemplo, si escribe "pilas.actores.Nave()" da un error. Si el usuario
			 escribe "new pilas.actores.Nave()" sale bien :)
		*/
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

  public tiene_fisica() {
    return (this.figura !== undefined);
  }

  public crear_sprite() {
    this.sprite = this._imagen.instanciar();
  }

  eliminar() {
    this.vivo = false;
    pilas.escena_actual().eliminar_actor(this);
  }

  get z() {
    return this.sprite.z;
  }

  set z(_z) {
    this.sprite.z = _z;
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
    this.definir_radio(this.radio_de_colision * valor);
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
	
	/* TODO: hacer que se puedan interpolar
		       las propiedades: izquierda, derecha, arriba, abajo.
	*/
	get izquierda() {
		return this.x - (this.centro_x * this.escala);
	}
	set izquierda(x) {
		this.x = x + (this.centro_x * this.escala);
	}
	
	get derecha() {
		return this.izquierda + (this.ancho * this.escala);
	}
	set derecha(x) {
		this.izquierda = x - (this.ancho * this.escala);
	}
	
	get arriba() {
		return this.y + (this.centro_y * this.escala);
	}
	
	set arriba(y) {
		this.y = y - (this.centro_y * this.escala);
	}
	
	get abajo() {
		return this.arriba - (this.alto * this.escala);
	}
	
	set abajo(y) {
		this.arriba = y + (this.alto * this.escala);
	}
	

  /**
   * @method colisiona_con_un_punto
   *
   * Determina si un punto colisiona con el area del actor.
   */
  colisiona_con_un_punto(x, y) {
    if (x >= ((this.x - this.centro_x * this.escala_x)) &&
        (x <= (this.x + this.centro_x * this.escala_x))) {
      if (y >= ((this.y - this.centro_y * this.escala_y)) &&
          (y <= (this.y + this.centro_y * this.escala_y))) {
        return true;
      }
    }
    return false;
  }

  decir(mensaje) {
    var globo = new pilas.actores.Globo(this.x, this.y, mensaje);
  }

  pre_actualizar() {
    this.actualizar_comportamientos();
    this.actualizar_habilidades();
  }

  actualizar() {
  }

  colisiona_con(otro_actor) {
    return pilas.utils.colisionan(this, otro_actor);
  }

  definir_radio(radio) {
    if (this.figura !== undefined) {
      this.figura.definir_radio(radio);
    }

    //this.radio_de_colision = radio;
  }

  obtener_radio(radio) {
    return this.radio_de_colision;
  }


}
