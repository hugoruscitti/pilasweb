class GestorDeEscenas {
  //escenas;
  escena;

  constructor() {
    //this.escenas = [];
    this.escena = null;
  }

  cambiar_escena(nueva_escena) {
    this.escena = nueva_escena;
    if (pilas.ready) {
      this.escena.iniciar();
    }
		this.actualizar(); // NOTA: se ejecuta para que los actores
		                   //       tomen su posición inicial.
  }

  actualizar() {
    var escena = this.escena_actual();
    escena.actualizar();
  }

  escena_actual() {
    return this.escena;
  }
}
