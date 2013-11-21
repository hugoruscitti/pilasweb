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
  x;
  y;
  centro_x;
  centro_y;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.centro_x = 320 / 2;
    this.centro_y = 240 / 2;
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

  convertir_de_posicion_relativa_a_fisica(x, y) {
    var centro = this.obtener_posicion();
    return {x: centro.x + x,
            y: centro.y - y}
  }

  convertir_de_posicion_fisica_a_relativa(x, y) {
    var centro = this.obtener_posicion();
    return {x: - centro.x + x,
            y: + centro.y - y}
  }

}
