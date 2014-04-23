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


class ProxyEventos {
  click_de_mouse;
  cuando_termina_click;
  mueve_mouse;
  actualiza;
  pulsa_tecla;
  suelta_tecla;
  Evento;
  constructor() {
    this.click_de_mouse = pilas.escena_actual().click_de_mouse;
    this.cuando_termina_click = pilas.escena_actual().cuando_termina_click;
    this.mueve_mouse = pilas.escena_actual().mueve_mouse;
    this.actualiza = pilas.escena_actual().actualiza;
    this.pulsa_tecla = pilas.escena_actual().pulsa_tecla;
    this.suelta_tecla = pilas.escena_actual().suelta_tecla;
    this.Evento = Evento;
  }
}