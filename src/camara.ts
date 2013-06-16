class Camara {
  x;
  y;

  constructor() {
    this.x = 0;
    this.y = 0;
  }

  /**
   * Convierte una posicion del escenario de pilas al formato
   * de coordenadas del navegador.
   *
   * Por ejemplo, el punto (0, 0) es el centro del escenario para
   * pilas, pero el navegador lo interpreta como el punto (160, 120).
   */
  obtener_posicion_pantalla(x, y) {
    return {x: x + 160, y: 120 - y};
  }

  obtener_posicion_escenario(x, y) {
    return {x: x - 160, y: y + 120};
  }

}
