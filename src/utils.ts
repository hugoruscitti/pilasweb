class Utils {
  
  convertir_a_grados(angulo_en_radianes) {
    return angulo_en_radianes * (180 / Math.PI);
  }
  
  convertir_a_radianes(angulo_en_grados) {
    return angulo_en_grados * (Math.PI / 180);
  }
  
}
