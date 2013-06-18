/// <reference path="gestor_escenas.ts />
/// <reference path="depurador.ts />

class Mundo {
  gestor_escenas;
  depurador;

  constructor() {
    this.gestor_escenas = new GestorDeEscenas();
    this.depurador = new DepuradorDeshabilitado()
  }

  actualizar() {
    this.gestor_escenas.actualizar();
    this.depurador.actualizar();
  }

  definir_modos(modos) {
    this.depurador.definir_modos(modos);
  }
}
