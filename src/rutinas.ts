class Rutinas {
  lista_de_rutinas;

  constructor() {
    this.lista_de_rutinas = [];
  }

  observar_tareas(elemento_id, intervalo) {
    var el = document.getElementById(elemento_id);
    var ctx = this;

    function cargar_contenido() {
      var buffer = ""

      ctx.lista_de_rutinas.forEach(function(e) {
        buffer += e.nombre + " - contador: " + e.contador + "\n";
      });

      el.innerHTML = buffer;
      setTimeout(cargar_contenido, intervalo);
    }

    cargar_contenido();
  }

  agregar(nombre, actor, init, update) {
    var time = new Date();

    var rutina = {
      id: Math.random(),
      nombre: nombre,
      init: init,
      update: update,
      tiempo: time,
      actor: actor,
      contador: 0,
      contexto: {actor: actor},
      eliminada: false,
    };

    console.log(rutina);

    init.call(rutina.contexto);
    this.lista_de_rutinas.push(rutina);

  }

  actualizar() {
    var a_eliminar = [];

    this.lista_de_rutinas.forEach(function(e) {
      e.contador += 1;
      var retorno = e.update.call(e.contexto);

      if (retorno === true) {
        e.eliminada = true;
      }

    });

    this.lista_de_rutinas = this.lista_de_rutinas.filter(function(item) {
      return (!item.eliminada);
    });

  }
}
