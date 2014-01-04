class tareas {
	Tareas;
	constructor() {
		this.Tareas = Tareas;
	}
}

class Tarea {
	tiempo;
	tiempo_aux;	
	funcion;
	una_vez;
	parametros;
	parent;

	constructor(tiempo, funcion, una_vez, parametros, parent) {
		this.tiempo = tiempo;
		this.tiempo_aux = tiempo;
		this.funcion = funcion;
		this.una_vez = una_vez;
		this.parametros = parametros;
		this.parent = parent;
	}

	ejecutar() {
		this.funcion.call(this.parent, this.parametros);
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

	siempre(tiempo, funcion, parametros, parent) {
		var tarea = new Tarea(this.contador_de_tiempo + tiempo, funcion, false, parametros, parent);
		tarea.tiempo_aux = tiempo;
		this._agregar_tarea(tarea);
	}

	una_vez(tiempo, funcion, parametros, parent) {
		var tarea = new Tarea(this.contador_de_tiempo + tiempo, funcion, true, parametros, parent);
		this._agregar_tarea(tarea);
	}

	actualizar() {
		this.contador_de_tiempo += (1/60);
		for(var i=0; i<this.tareas_planificadas.length; i++) {
			if (this.contador_de_tiempo > this.tareas_planificadas[i].tiempo) {		
				this.tareas_planificadas[i].ejecutar();

				if (this.tareas_planificadas[i].una_vez) {
					this.tareas_planificadas.splice(i,1);
				}

				else {
					this.tareas_planificadas[i].tiempo += this.tareas_planificadas[i].tiempo_aux; 
				}
			}
		}
	}

}
