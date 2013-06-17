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

  constructor() {
    this.x = 0;
    this.y = 0;
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
    return {x: x + 160, y: 120 - y};
  }

  /**
   * @method obtener_posicion_escenario
   *
   * Convierte una posición dada en un sistema de coordenadas 
   * tradicional, en una posición de escenario, donde el punto (0, 0)
   * es el centro de la pantalla.
   */
  obtener_posicion_escenario(x, y) {
    return {x: x - 160, y: 120 -y};
  }

}
