class Evento {
  respuestas;
  nombre;

  constructor(nombre) {
    this.respuestas = {};
    this.nombre = nombre;
  }

  public emitir(evento) {
    for (var respuesta in this.respuestas) {
      this.respuestas[respuesta](evento);
    }
  }

  public conectar(respuesta) {
    this.respuestas[respuesta.toString()] = respuesta;
  }

  public desconectar(respuesta) {
    delete this.respuestas[respuesta.toString()];
  }
}
