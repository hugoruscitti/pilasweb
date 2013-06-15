class GestorDeEscenas {
  //escenas;
  escena;

  constructor() {
    //this.escenas = [];
    this.escena = null;
  }

  cambiar_escena(nueva_escena) {
    this.escena = nueva_escena;
  }

  actualizar() {
    var escena = this.escena_actual();
    escena.actualizar();
  }

  escena_actual() {
    return this.escena;
  }
}
