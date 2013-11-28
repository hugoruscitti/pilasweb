class Estudiante {
  habilidades;
  comportamiento; // TODO: convertir en una lista como las habilidades.

  constructor() {
    this.habilidades = [];
    this.comportamiento = undefined;
  }

  public aprender(clase_de_habilidad) {
    this.agregar_habilidad(clase_de_habilidad);
    return "Enseñando una habilidad ...";
  }

  public agregar_habilidad(clase_de_habilidad) {
    // TODO chequear si la clase de habilidad ya se ha agregado y eliminarla.
    var habilidad = new clase_de_habilidad(this);

    // TODO permitir que se puedan enviar habiliades ya instanciadas.
    this.habilidades.push(habilidad);
  }

  hacer(comportamiento, argumentos) {
    this.comportamiento = new comportamiento(argumentos);
    this.comportamiento.iniciar(this);
  }

  public actualizar_comportamientos() {
    if (this.comportamiento !== undefined) {
      var termina = this.comportamiento.actualizar();

      if (termina)
        this.comportamiento = undefined;
    }
  }
}
