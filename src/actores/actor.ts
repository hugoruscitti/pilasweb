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
  _espejado;
  callbacks_cuando_hace_click;
  callbacks_cuando_mueve_mouse;
  etiquetas;
  evto_se_movio;

  constructor(imagen, x, y, atributos = {}) {

    super();
    this.evto_se_movio = new Evento("se_movio");
    this.imagen = imagen || 'sin_imagen.png';
    atributos = atributos || {};
    this.vivo = true;
    this.radio_de_colision = 10;
    this.id = pilas.utils.obtener_uuid();
    this.x = x || 0;
    this.y = y || 0;
    this.espejado = false;
    this.centro = ['centro', 'centro'];

    this.etiquetas = [];
    this.etiquetas.push(this.getClassName());

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


    this.iniciar();
  }

  public getClassName() {
    var funcNameRegex = /function (.{1,})\(/;
      var results  = (funcNameRegex).exec(this["constructor"].toString());
      return (results && results.length > 1) ? results[1] : "";
  }

  public iniciar() {
  }

  public tiene_fisica() {
    return (this.figura !== undefined);
  }

  private _crear_sprite() {
    /* Si el actor ya tenía imagen, entonces se encarga de reemplazar
    la imagen actual, y vuelve a definir el punto de control en el
    centro. */

    if (this.sprite !== undefined) {
      this.sprite.image = this._imagen.instanciar().image;
    } else {
      this.sprite = this._imagen.instanciar();
    }
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
    this.evto_se_movio.emitir();
  }

  get espejado() {
    return this._espejado;
  }

  set espejado(_espejado) {
    this._espejado = _espejado;

    if (_espejado)
      this.sprite.scaleX = -Math.abs(this.sprite.scaleX);
    else
      this.sprite.scaleX = Math.abs(this.sprite.scaleX);
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
      this.evto_se_movio.emitir({});
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
      this.evto_se_movio.emitir({});
    }
  }

  get centro() {
    return [this.centro_x, this.centro_y];
  }
  set centro(_valor) {
    if (typeof _valor === 'object' && _valor.length) {
      var x = _valor[0];
      var y = _valor[1];
      this.centro_x = x;
      this.centro_y = y;
    } else {
      throw Error("Solo se permite centrar usando un array de dos elementos.")
    }
  }

  get centro_x() {return this.sprite.regX}
  set centro_x(_x) {

    if (_x === 'centro')
      _x = this.ancho / 2;

    if (_x === 'derecha')
      _x = this.ancho;

    if (_x === 'izquierda')
      _x = 0;

    if (typeof _x !== 'number')
      throw new Error("Solo se permite asignar números o las cadenas 'centro', 'izquierda' y 'derecha'");

    this.sprite.regX = _x;
  }

  get centro_y() {return this.sprite.regY}
  set centro_y(_y) {

    if (_y === 'centro')
      _y = this.alto / 2;

    if (_y === 'abajo')
      _y = this.alto;

    if (_y === 'arriba')
      _y = 0;

    if (typeof _y !== 'number')
      throw new Error("Solo se permite asignar números o las cadenas 'centro', 'abajo' y 'arriba'");

    this.sprite.regY = _y;
  }

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

  get rotacion() {return -this.sprite.rotation}
  set rotacion(valor:any) {
    if (valor instanceof Array) {
      for (var i in valor) {
        valor[i] = -1 * (((valor[i]%360)+360)%360);
      }
      pilas.interpolar(this.sprite, 'rotation', valor, 1);
    }
    else
      this.sprite.rotation = -1 * (((valor%360)+360)%360);
  }

  get transparencia() {return (-100 * this.sprite.alpha) + 100}
  set transparencia(_t) {this.sprite.alpha = (_t - 100) / -100}

  get ancho() {
    return this._imagen.ancho * this.escala_x;
  }
    
  set ancho(nuevo){
      this.escala_x = nuevo / this._imagen.ancho;
  }
    
  get alto() {
    return this._imagen.alto * this.escala_y;
  }
    
  set alto(nuevo){
      this.escala_y = nuevo / this._imagen.alto;
  }

  set imagen(_i) {
    if (_i.substring)
      this._imagen = pilas.imagenes.cargar(_i)
    else
      this._imagen = _i;

    this._crear_sprite();
    this.centro = ['centro', 'centro'];
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
    return this.izquierda + this.ancho;
  }
  set derecha(x) {
    this.izquierda = x - this.ancho;
  }

  get arriba() {
    return this.y + (this.centro_y * this.escala_y);
  }

  set arriba(y) {
    this.y = y - (this.centro_y * this.escala_y);
  }

  get abajo() {
    return this.arriba - this.alto;
  }

  set abajo(y) {
    this.arriba = y + this.alto;
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

  tiene_etiqueta(etiqueta) {
    return this.etiquetas.indexOf(etiqueta) > -1;
  }
}
