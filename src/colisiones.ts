class Colisiones {
  colisiones;

  constructor() {
    this.colisiones = [];
  }

  agregar(grupo_a, grupo_b, funcion_a_llamar) {

    if (grupo_a.length === undefined)
      grupo_a = [grupo_a];

    if (grupo_b.length === undefined)
      grupo_b = [grupo_b];

    this.colisiones.push({grupo_a: grupo_a, grupo_b: grupo_b, callback: funcion_a_llamar});
  }

  verificar_colisiones() {
    for (var i=0; i<this.colisiones.length; i++) {
      this._verificar_colisiones_en_tupla(this.colisiones[i]);
    }
  }

  _verificar_colisiones_en_tupla(tupla) {

    for (var i=0; i<tupla.grupo_a.length; i++) {
      for (var j=0; j<tupla.grupo_b.length; j++) {
        var actor_a = tupla.grupo_a[i];
        var actor_b = tupla.grupo_b[j];

        if (actor_a.vivo && actor_b.vivo && actor_a.colisiona_con(actor_b)) {
          tupla.callback.call(this, actor_a, actor_b);

          // TODO: implementar alguna forma para quitar a los actores del
          //       grupo si es que ya no están vivos.
        }
      }
    }

  }
}
