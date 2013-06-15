/// <reference path="gestor_escenas.ts />

class Mundo {
  gestor_escenas;

  constructor() {
    this.gestor_escenas = new GestorDeEscenas();
  }

  actualizar() {
    this.gestor_escenas.actualizar();
  }
}
