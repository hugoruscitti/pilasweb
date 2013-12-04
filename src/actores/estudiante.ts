class Estudiante {
  habilidades;
  comportamiento; // TODO: convertir en una lista como las habilidades.

  constructor() {
    this.habilidades = [];
    this.comportamiento = undefined;
  }

  public aprender(clase_de_habilidad, argumentos=null) {
    this.agregar_habilidad(clase_de_habilidad, argumentos);
    return "Enseñando una habilidad ...";
  }

  public agregar_habilidad(clase_de_habilidad, argumentos) {
    // TODO chequear si la clase de habilidad ya se ha agregado y eliminarla.
    if(argumentos==null) {
      var habilidad = new clase_de_habilidad(this);
    }
    else {
      var habilidad = new clase_de_habilidad(this, argumentos);
    }

    // TODO permitir que se puedan enviar habiliades ya instanciadas.
    this.habilidades.push(habilidad);
  }

  actualizar_habilidades() {
    for (var i=0;i<this.habilidades.length;i++) {
      this.habilidades[i].actualizar()
    }
  }

  hacer(comportamiento, argumentos={}) {
    this.comportamiento = new comportamiento(argumentos);
    this.comportamiento.iniciar(this);
  }

  actualizar_comportamientos() {
    if (this.comportamiento !== undefined) {
      var termina = this.comportamiento.actualizar();

      if (termina)
        this.comportamiento = undefined;
    }
  }
}
