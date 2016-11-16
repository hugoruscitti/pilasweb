class Mensajes {
  pilas: Pilas;
  manejadores_conectados: Array<any> = [];

  constructor(pilas: Pilas) {
    this.pilas = pilas;
  }

  /**
   * Permite conectar un actor y una función como respuesta a un mensaje
   * particular.
   *
   * La función quedará conectada todo el tiempo mientras el actor viva.
   */
  conectar_al_mensaje(actor_id, identificador_del_mensaje, funcion_de_respuesta) {
    let id = this.manejadores_conectados.length;

    console.log(`Conectando mensaje ${identificador_del_mensaje} al actor ${actor_id}`);

    this.manejadores_conectados.push({
      id: id,
      actor_id: actor_id,
      identificador_del_mensaje: identificador_del_mensaje,
      funcion_de_respuesta: funcion_de_respuesta,
      eliminar: false,
    });

  }

  /**
   * Emite un mensaje junto a un grupo de datos. Este mensaje lanzará la
   * ejecución de todas las funciones conectadas de los actores vivos.
   */
  emitir(actor_id, identificador_del_mensaje, datos) {
    let cantidad_de_manejadores = this.manejadores_conectados.length;

    console.log(`El actor id ${actor_id} emite el mensaje ${identificador_del_mensaje} con los datos ${datos}.`);

    if (this._el_actor_sigue_vivo(actor_id)) {
      console.log("Se emitirá el mensaje a todos los manejadores conectados.");
    } else {
      console.log("Se descartará el mensaje, porque el actor emisor ya no está vivo.");
      return;
    }

    console.log(`Hay ${cantidad_de_manejadores} manejadores de mensajes conectados.`);

    this.manejadores_conectados.forEach((manejador) => {
      if (manejador['identificador_del_mensaje'] === identificador_del_mensaje) {
        if (this._el_actor_sigue_vivo(manejador.actor_id)) {
          manejador['funcion_de_respuesta'].call(this, datos);
        } else {
          console.log("Se eliminará un manejador porque su actor ya no está vivo...");
          manejador.eliminar = true;
        }
      }
    });

    this.manejadores_conectados = this.manejadores_conectados.filter(function(m) {
      return (! m.eliminar);
    });

  }

  _el_actor_sigue_vivo(actor_id) {
    return (pilas.obtener_actor_por_id(actor_id) !== null);
  }

  /**
   * Desconecta a un actor de todos los mensajes.
   */
  desconectar_mensajes(actor_id) {
    this.manejadores_conectados = this.manejadores_conectados.filter(function(m) {
      return m.actor_id !== actor_id;
    });
  }

}
