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
  callbacks_cuando_hace_click;
  callbacks_cuando_mueve_mouse;

  constructor(imagen, x, y, atributos = {}) {
		/* patch para permitir la instancia sin anteponer new */
		if (!(this instanceof Actor)) 
			return new Actor(imagen, x, y, atributos);
		
    super();
    this.imagen = imagen || 'sin_imagen.png';
    atributos = atributos || {};
    this.vivo = true;
    this.radio_de_colision = 10;
    this.id = pilas.utils.obtener_uuid();
		
    this.crear_sprite();
    this.x = x || 0;
    this.y = y || 0;
    this.centro_x = 0;
    this.centro_y = 0;

    if (atributos['rotacion'])
      this.rotacion = atributos['rotacion'];

    if (atributos['centro_x'])
      this.centro_x = atributos['centro_x'];

    if (atributos['centro_x'])
      this.centro_y = atributos['centro_y'];

    this.z = 0;
    pilas.escena_actual().agregar_actor(this);

    //eventos
    pilas.escena_actual().click_de_mouse.conectar(this);
    pilas.escena_actual().mueve_mouse.conectar(this);

    this.callbacks_cuando_hace_click = [];
    this.callbacks_cuando_mueve_mouse = [];
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
    if (this.tiene_fisica()) {
      this.figura.eliminar();
    }
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
      pilas.interpolar(this, 'x', _x, 1);
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
      pilas.interpolar(this, 'y', _y, 1);
    else {
      var pos = pilas.escena_actual().obtener_posicion_pantalla(0, _y);
      this.sprite.y = pos.y;
    }
  }

  get centro_x() {return this.sprite.regX}
  set centro_x(_x) {this.sprite.regX = (this.ancho/2) + _x}

  get centro_y() {return this.sprite.regY}
  set centro_y(_y) {this.sprite.regY = (this.alto/2) + _y}

  get escala_x() {return this.sprite.scaleX}
  set escala_x(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite, 'scaleX', valor, 1);
    else
      this.sprite.scaleX = valor;
  }

  get escala_y() {return this.sprite.scaleY}
  set escala_y(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite, 'scaleY', valor, 1);
    else
      this.sprite.scaleY = valor;
  }

  get escala() {return this.escala_x}
  set escala(valor) {

    if (valor instanceof Array) {
      var nuevo_radio_de_colision = [] 
      for (var i=0; i<valor.length; i++) {
        nuevo_radio_de_colision.push((this.radio_de_colision * valor[i]) / this.escala);
      }
      pilas.interpolar(this, 'radio_de_colision', nuevo_radio_de_colision, 1);
      this.radio_de_colision = nuevo_radio_de_colision[0];
    }
    else {
      this.radio_de_colision = (this.radio_de_colision * valor) / this.escala;
    }
    
    this.escala_x = valor;
    this.escala_y = valor;
  }

  get rotacion() {return this.sprite.rotation}
  set rotacion(valor) {
    if (valor instanceof Array)
      pilas.interpolar(this.sprite, 'rotation', valor, 1);
    else
      this.sprite.rotation = valor;
  }

  get transparencia() {return (-100 * this.sprite.alpha) + 100}
  set transparencia(_t) {this.sprite.alpha = (_t - 100) / -100}

  get ancho() {
    if (this._imagen instanceof Grilla) {
      return this._imagen.ancho/this._imagen.columnas
    }
    else {
      return this._imagen.ancho;
    }
  }
  get alto() {
    if (this._imagen instanceof Grilla) {
      return this._imagen.alto/this._imagen.filas
    }
    else {
      return this._imagen.alto;
    }
  }

  set imagen(_i) {
    if (_i.substring)
      this._imagen = pilas.imagenes.cargar(_i)
    else
      this._imagen = _i;

    /* Si el actor ya tenía imagen, entonces se encarga de reemplazar
       la imagen actual, y vuelve a definir el punto de control en el
       centro. */
    if (this.sprite !== undefined) {
      this.sprite.image = this._imagen.instanciar().image;
      this.centro_x = 0;
      this.centro_y = 0;
    }
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

  ejecutar_callbacks_clicks() {
    for(var i=0; i<this.callbacks_cuando_hace_click.length; i++) {
      this.callbacks_cuando_hace_click[i]();
    }
  }

  ejecutar_callbacks_over() {
    for(var i=0; i<this.callbacks_cuando_mueve_mouse.length; i++) {
      this.callbacks_cuando_mueve_mouse[i]();
    }
  }

  get cuando_hace_click() {return this.callbacks_cuando_hace_click;}
  set cuando_hace_click(funcion) {
    //Esta funcion no admite parametros
    this.callbacks_cuando_hace_click.push(funcion);
  }

  get cuando_mueve_mouse() {return this.callbacks_cuando_mueve_mouse;}
  set cuando_mueve_mouse(funcion) {
    //Esta funcion no admite parametros
    this.callbacks_cuando_mueve_mouse.push(funcion);    
  }

  //metodo recibir() para gestionar los eventos
  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().click_de_mouse) {
      this._cuando_hace_click(evento);
    }
    if (tipo == pilas.escena_actual().mueve_mouse) {
      this._cuando_mueve_mouse(evento);
    }
  }

  _cuando_hace_click(click) {
    if (this.colisiona_con_un_punto(click.x, click.y)) {
      this.ejecutar_callbacks_clicks();
    }
  }

  _cuando_mueve_mouse(evento) {
    if (this.colisiona_con_un_punto(evento.x, evento.y)) {
      this.ejecutar_callbacks_over();
    }
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
    var globo = new pilas.actores.Globo(this.izquierda+(this.ancho/2), this.arriba, mensaje);
  }

  imitar(actor_o_figura) {
    this.aprender(pilas.habilidades.Imitar, {objeto_a_imitar:actor_o_figura});
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

  /*
  * Comprueba si el actor se encuentra dentro del area visible de la pantalla
  */
  esta_fuera_de_la_pantalla() {
    var area_visible = pilas.escena_actual().camara.obtener_area_visible();
    return this.derecha < area_visible.izquierda || this.izquierda > area_visible.derecha ||
      this.abajo > area_visible.arriba || this.arriba < area_visible.abajo;
  }

}
