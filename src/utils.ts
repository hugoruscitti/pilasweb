class Utils {
  
  convertir_a_grados(angulo_en_radianes) {
    return angulo_en_radianes * (180 / Math.PI);
  }
  
  convertir_a_radianes(angulo_en_grados) {
    return angulo_en_grados * (Math.PI / 180);
  }
  
  colisionan(a, b) {
    return (this.distancia_entre_dos_actores(a, b) < a.radio_de_colision + b.radio_de_colision);
  }

  distancia_entre_dos_actores(a, b) {
    return this.distancia_entre_dos_puntos(a.x, a.y, b.x, b.y);
  }

  distancia_entre_dos_puntos(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(this.distancia(x1, x2), 2) + Math.pow(this.distancia(y1, y2), 2));
  }

  distancia(a, b) {
    return Math.abs(b - a);
  }
}
