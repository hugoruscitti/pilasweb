class Estudiante {
	habilidades;
	
	constructor() {
		this.habilidades = [];
		
	}

  public aprender(clase_de_habilidad) {
    this.agregar_habilidad(clase_de_habilidad);
  }

  public agregar_habilidad(clase_de_habilidad) {
    // TODO chequear si la clase de habilidad ya se ha agregado y eliminarla.
    var habilidad = new clase_de_habilidad(this);
		
		// TODO permitir que se puedan enviar habiliades ya instanciadas.
		this.habilidades.push(habilidad);
  }
}
