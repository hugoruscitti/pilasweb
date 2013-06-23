class Estudiante {

  public aprender(clase_de_habilidad) {
    // FIXME, hacer una lista de habilidades, chequear si la clase de
    // habilidad ya se ha agregado y eliminarla.

    this.agregar_habilidad(clase_de_habilidad);
  }

  public agregar_habilidad(clase_de_habilidad) {
    var habilidad = new clase_de_habilidad(this);
  }
}
