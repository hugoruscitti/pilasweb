class tareas {
	Tareas;
	constructor() {
		this.Tareas = Tareas;
	}
}

class Tarea {
	tiempo;
	funcion;
	una_vez;

	constructor(tiempo, funcion,una_vez=false) {
		this.tiempo = tiempo;
		this.funcion = funcion;
		this.una_vez = una_vez;
	}

	ejecutar() {
		this.funcion();
	}
}

class Tareas {
	tareas_planificadas;
	contador_de_tiempo;

	constructor() {
		this.tareas_planificadas = [];
		this.contador_de_tiempo = 0;
	}

	_agregar_tarea(tarea) {
		this.tareas_planificadas.push(tarea);
	}

	siempre(tiempo, funcion) {
		var tarea = new Tarea(tiempo, funcion);
		this._agregar_tarea(tarea);
	}

	una_vez(tiempo, funcion) {
		var tarea = new Tarea(tiempo, funcion, true);
		this._agregar_tarea(tarea);
	}

	actualizar() {
		this.contador_de_tiempo += (1/60);
		for(var i=0; i<this.tareas_planificadas.length; i++) {
			if (this.contador_de_tiempo > this.tareas_planificadas[i]["tiempo"]) {

				this.tareas_planificadas[i]["ejecutar"]();

				if (this.tareas_planificadas[i]["una_vez"]) {
					console.log("tarea de una vez");
					this.tareas_planificadas.splice(i,1);
				}

				else {
					this.tareas_planificadas[i]["tiempo"] += (0,032 - 
						((this.contador_de_tiempo-this.tareas_planificadas[i]["tiempo"])-0,016));
				}
			}
		}
	}

}