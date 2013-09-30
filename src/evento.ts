class Evento {
  respuestas;
  nombre;

  constructor(nombre) {
    this.respuestas = {};
    this.nombre = nombre;
  }

  public emitir(evento) {
    for (var nombre_respuesta in this.respuestas) {
      var respuesta = this.respuestas[nombre_respuesta];
      if (typeof(respuesta) == 'object') {
        respuesta.recibir(evento, this);
      }
      else {
        respuesta(evento);
      }
    }
  }

  public conectar(respuesta) {
    this.respuestas[respuesta.toString() + Math.random().toString()] = respuesta;
  }

  public desconectar(respuesta) {
    delete this.respuestas[respuesta.toString()];
  }
}
