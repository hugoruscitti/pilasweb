class Plano {
  constructor() {
    pilas.escena_actual().agregar_actor(this);
  }

  actualizar() {
  }
}

class Fondos {
  Plano;

  constructor() {
    this.Plano = Plano;
  }
}
