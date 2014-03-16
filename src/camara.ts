/**
 * @class Camara
 *
 * Representa la cámara que visualiza el escenario y permite hacer movimientos
 * de pantalla.
 *
 * Esta clase también se encarga de transformar el sistema de referencia
 * entre coordenadas de pantalla y coordenadas de escenario.
 */
class Camara {
  escenario;
  centro_x;
  centro_y;

  constructor(escenario) {
    this.centro_x = pilas.opciones.ancho / 2;
    this.centro_y = pilas.opciones.alto / 2;

    this.escenario = escenario;
  }

  get x() {
    return this.escenario.x;
  }

  set x(_x) {
    if (_x instanceof Array)
      pilas.interpolar(this.escenario,"x",[-_x],1);
    else {
      this.escenario.x = -_x;
    }
  }

  get y() {
    return this.escenario.y;
  }

  set y(_y) {
    if (_y instanceof Array)
      pilas.interpolar(this.escenario,"y",[-_y],1);
    else {
      this.escenario.y = -_y
    }
  }


  get zoom() {
    return this.escenario.scaleX;
  }

  set zoom(_z) {
    if (_z instanceof Array) {
      pilas.interpolar(this.escenario,"scaleX",[1+_z*0.1],1)
      pilas.interpolar(this.escenario,"scaleY",[1+_z*0.1],1)
    }
    else {
      this.escenario.scaleX = 1+_z*0.1;
      this.escenario.scaleY = 1+_z*0.1;
    }
  }

  /**
   * @method obtener_posicion_pantalla
   *
   * Convierte una posición del escenario de pilas al formato
   * de coordenadas del navegador.
   *
   * Por ejemplo, el punto (0, 0) es el centro del escenario para
   * pilas, pero el navegador lo interpreta como el punto (160, 120).
   */
  obtener_posicion_pantalla(x, y) {
    return {x: x + this.centro_x, y: this.centro_y - y};
  }

  /**
   * @method obtener_posicion_escenario
   *
   * Convierte una posición dada en un sistema de coordenadas 
   * tradicional, en una posición de escenario, donde el punto (0, 0)
   * es el centro de la pantalla.
   */
  obtener_posicion_escenario(x, y) {
    return {x: x - this.centro_x, y: this.centro_y -y};
  }

  obtener_posicion() {
    return {x: this.centro_x - this.x, 
            y: this.centro_y + this.y};
  }

  /*
   * Convierte una coordenada de pilas (donde 0,0 es el centro de pantalla)
   * en una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda).
   */
  convertir_de_posicion_relativa_a_fisica(x, y) {
    var centro = this.obtener_posicion();
    return {x: centro.x + x,
            y: centro.y - y}
  }

  /*
   * Convierte una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda)
   * en una coordenada de pilas (donde 0,0 es el centro de pantalla).
   */
  convertir_de_posicion_fisica_a_relativa(x, y) {
    var centro = this.obtener_posicion();
    return {x: - centro.x + x,
            y: + centro.y - y}
  }


  /*
  * Obtiene el area visible de la pantalla.
  * return: object
  */
  obtener_area_visible() {
    var ancho = pilas.opciones.ancho;
    var alto = pilas.opciones.alto;

    return {izquierda:this.x - ancho/2, derecha:this.x + 
      ancho/2, arriba:this.y + alto/2, abajo: this.y - alto/2};
  }

}
