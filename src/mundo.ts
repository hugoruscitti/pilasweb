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

  obtener_modos() {
    return this.depurador.obtener_modos();
  }

  agregar_tarea_una_vez(tiempo, funcion, parametros=undefined, parent=undefined) {
    pilas.escena_actual().tareas.una_vez(tiempo, funcion, parametros, parent);
  }

  agregar_tarea_siempre(tiempo, funcion, parametros=undefined, parent=undefined) {
    pilas.escena_actual().tareas.siempre(tiempo, funcion, parametros, parent);
  }
}
