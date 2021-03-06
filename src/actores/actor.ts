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
    this.radio_de_colision = Math.min(this.ancho, this.alto) / 2;
    this.id = pilas.utils.obtener_uuid();
    this.x = x || 0;
    this.y = y || 0;
    this.espejado = false;
    this.centro = ['centro', 'centro'];

    this.etiquetas = [];
    this.agregarEtiqueta(this.getClassName());

    if (atributos['rotacion'])
      this.rotacion = atributos['rotacion'];

    if (atributos['centro_x'])
      this.centro_x = atributos['centro_x'];

    if (atributos['centro_x'])
      this.centro_y = atributos['centro_y'];

    if (atributos['z']) {
      this.z = atributos['z'];
    } else {
      this.z = 0;
    }

    pilas.escena_actual().agregar_actor(this);

    //eventos
    pilas.escena_actual().click_de_mouse.conectar(this);
    pilas.escena_actual().mueve_mouse.conectar(this);

    this.callbacks_cuando_hace_click = [];
    this.callbacks_cuando_mueve_mouse = [];


    this.iniciar();
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

    if (this.sprite === undefined) {
      var x = 0;
      var y = 0;
      var rotacion = 0;
      var escala = 1;
    } else {
      var x:number = this.x;
      var y:number = this.y;
      var rotacion:number = this.rotacion;
      var escala: number = this.escala;
    }

    if (this.sprite === undefined) {
      this.sprite = this._imagen.instanciar();
    } else {
      pilas.escena_actual().eliminar_actor(this);
      this.sprite = this._imagen.instanciar();
      pilas.escena_actual().agregar_actor(this);
    }

    this.x = x;
    this.y = y;
    this.rotacion = rotacion;
    this.escala = escala;

    /*
    if (this.sprite !== undefined) {
      this.sprite.image = this._imagen.instanciar().image;

      if (! this.sprite.image) {
        this.sprite = this._imagen.instanciar();
      }

    } else {
      this.sprite = this._imagen.instanciar();
    }
    */
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

  getZ(){
    return this.z;
  }

  set z(_z) {
    this.sprite.z = _z;
    this.evto_se_movio.emitir();
  }

  setZ(z) {
    this.z = z;
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

  getX(){
    return this.x;
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

  setX(x){
    this.x = x;
  }

  get y() {
    var pos = pilas.escena_actual().obtener_posicion_escenario(0, this.sprite.y);
    return pos.y;
  }

  getY(){
    return this.y;
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

  setY(y) {
    this.y = y;
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

  escalarProporcionalALimites(anchoLimite,altoLimite){
      this.escala = 1;
      var escalaAlto = altoLimite / this.alto;
      var escalaAncho = anchoLimite / this.ancho;
      this.escala = Math.min(escalaAncho,escalaAlto);
  }

  escalarAAncho(anchoDeseado){
      this.escala = 1;
      this.escala = anchoDeseado / this.ancho;
  }
  escalarAAlto(altoDeseado){
      this.escala = 1;
      this.escala = altoDeseado / this.alto;
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
    return Math.abs(this._imagen.ancho * this.escala_x);
  }

  getAncho(){
    return this.ancho;
  }

  set ancho(nuevo){
      var signo = this.escala_x / Math.abs(this.escala_x);
      this.escala_x = nuevo / this._imagen.ancho * signo;
  }

  setAncho(a){
    this.ancho = a;
  }

  get alto() {
    return Math.abs(this._imagen.alto * this.escala_y);
  }

  getAlto(){
    return this.alto;
  }

  set alto(nuevo){
    var signo = this.escala_y / Math.abs(this.escala_y);
      this.escala_y = nuevo / this._imagen.alto * signo;
  }

  setAlto(a){
    this.alto = a;
  }

  set imagen(_i) {
    if (_i.substring)
      this._imagen = pilas.imagenes.cargar(_i)
    else
      this._imagen = _i;

    //alert(_i);

    this._crear_sprite();
    this.centro = ['centro', 'centro'];
  }

  /* TODO: hacer que se puedan interpolar
           las propiedades: izquierda, derecha, arriba, abajo.
  */
  get izquierda() {
    return this.x - (this.centro_x * Math.abs(this.escala));
  }
  set izquierda(x) {
    this.setX(x + (this.centro_x * Math.abs(this.escala)));
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
    this.setY(y - (this.centro_y * this.escala_y));
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
    new pilas.actores.Globo(this, mensaje);
  }
  pensar(mensaje) {
    new pilas.actores.GloboPensar(this, mensaje);
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
  
  agregarEtiqueta(etiqueta): void {
    this.etiquetas.push(etiqueta);
  }

  tiene_etiqueta(etiqueta) {
    return this.etiquetas.indexOf(etiqueta) > -1;
  }

  notificar_evento_comienza_a_mover_un_actor(actor) {
    if (parent) {
      let mensaje = {
        tipo: "comienzaAMoverUnActor",
        actorID: actor.id
      };

      parent.postMessage(mensaje, window.location.origin);
    }
  }

  notificar_evento_termino_de_mover_un_actor(actor) {
    if (parent) {
      let mensaje = {
        tipo: "terminaDeMoverUnActor",
        actorID: actor.id
      };

      parent.postMessage(mensaje, window.location.origin);
    }
  }

  activar_el_modo_edicion() {
    this.sprite.mouseEnabled = true;

    /* Posición inicial del mouse cuando se comienza a arrastrar */
    let x_posicion_anterior;
    let y_posicion_anterior;

    this.sprite.on("mousedown", (evento) => {
      var pos = pilas.escena_actual().obtener_posicion_escenario(evento.stageX, evento.stageY);
      x_posicion_anterior = pos.x;
      y_posicion_anterior = pos.y;

      this.sprite.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 5, 5, 2);
      this.notificar_evento_comienza_a_mover_un_actor(this);
      this.traer_al_frente();
    });

    this.sprite.on("pressmove", (evento) => {
      var pos = pilas.escena_actual().obtener_posicion_escenario(evento.stageX, evento.stageY);
      this.x += pos.x - x_posicion_anterior;
      this.y += pos.y - y_posicion_anterior;

      x_posicion_anterior = pos.x;
      y_posicion_anterior = pos.y;

      this.sprite.cursor = "-webkit-grabbing";
    });

    this.sprite.on("pressup", (evento) => {
      this.sprite.shadow = null;
      this.sprite.cursor = null;
      this.notificar_evento_termino_de_mover_un_actor(this);
    });

    this.sprite.on("mouseover", (evento) => {
      this.sprite.cursor = "-webkit-grab";
    });

    this.sprite.on("mouseout", (evento) => {
      this.sprite.shadow = null;
      this.sprite.cursor = null;
    });

  }

  desactivar_el_modo_edicion() {
    this.sprite.mouseEnabled = false;
  }

  esFondo() {
    return false;
  }

  serializar() {
    var atributos = {
      x: this.x,
      y: this.y,
      z: this.z,
      rotacion: this.rotacion,
      esFondo: this.esFondo(),
      escala: this.escala,
      clase: this.getClassName(),
    };

    return atributos;
  }

  conectar_al_mensaje(identificador_del_mensaje, funcion_de_respuesta) {
    pilas.mensajes.conectar_al_mensaje(this.id, identificador_del_mensaje, funcion_de_respuesta);
  }

  emitir_mensaje(identificador_del_mensaje, datos = {}) {
    pilas.mensajes.emitir(this.id, identificador_del_mensaje, datos);
  }

  desconectar_mensajes() {
    pilas.mensajes.desconectar_mensajes(this.id);
  }

  traer_al_frente() {
    let actor = pilas.obtener_actor_mas_cercano_a_la_camara();

    if (actor !== this) {
      this.z = actor.z - 1;
    }
  }

  acelerarLaVelocidadDeLasAnimaciones() {
    this._imagen.acelerarLaVelocidad();
  }

  restaurarLaVelocidadDeLasAnimaciones() {
    this._imagen.restaurarLaVelocidad();
  }

}
