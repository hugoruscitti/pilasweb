declare var Math:Math;

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

  obtener_uuid() {
    var uuid = Math['uuid'];
    return uuid();
  }

  distancia(a, b) {
    return Math.abs(b - a);
  }

  fabricar(clase, cantidad=1, posiciones_al_azar=true) { //Mover a ../actores/utils.ts

    var actores = []

    for (var i=0;i<cantidad;i++) {
      if (posiciones_al_azar) {
        var x = Math.floor(Math.random() * (320 - (-320 + 1)))  - 320;
        var y = Math.floor(Math.random() * (240 - (-240 + 1)))  - 240;
      }
      else {
        var x = 0;
        var y = 0;
      }

      var nuevo = new clase(x, y);
      actores.push(nuevo);
    }
    
    return new pilas.grupo.Grupo(actores);
  }
}
