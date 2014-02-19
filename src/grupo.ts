//modulo grupo
class grupo {
	Grupo;
	constructor() {
		this.Grupo = Grupo;
	}
}


class HGrupo {
	/*Se utiliza para que la clase Grupo pueda extender de ella y por ende
	extender propiedades y metodos de la clase Array */
	constructor() {
		Array.apply(this, arguments);
		return new Array();	
	} 

	pop(): any {return "";}
	push(val): number {return 0;}
	length: number;
	/*TODO: Añadir métodos faltantes*/
}

HGrupo["prototype"] = new Array();

class Grupo extends HGrupo {
	constructor(actor_o_array) {
		super();
		if (actor_o_array instanceof Array) {
			this.agregar_grupo(actor_o_array)
		}

		else if (actor_o_array instanceof Object) {
			this.agregar_actor(actor_o_array)
		}
	}

	agregar_grupo(grupo) {
		for(var i=0;i<grupo.length;i++) {
			this.agregar_actor(grupo[i]);
		}
	}

	agregar_actor(actor) {
		this.push(actor);
	}

	get x() {
		return this.__getattr__("x");
	}

	set x(x) {
		this.__setattr__("x", x);
	}

	get y() {
		return this.__getattr__("y");
	}
	
	set y(y) {
		this.__setattr__("y",y);
	}

	get escala() {
		return this.__getattr__("escala");
	}
	
	set escala(escala) {
		this.__setattr__("escala",escala);
	}

	get rotacion() {
		return this.__getattr__("rotacion");
	}
	
	set rotacion(rotacion) {
		this.__setattr__("rotacion",rotacion);
	}

	aprender(habilidad, argumentos=undefined) {
		this.ejecutar_funcion("aprender", habilidad, argumentos);
	}

	hacer(comportamiento, argumentos=undefined) {
		this.ejecutar_funcion("hacer", comportamiento, argumentos);
	}

	hacer_luego(comportamiento, argumentos=undefined) {
		this.ejecutar_funcion("hacer_luego", comportamiento, argumentos);
	}

	decir(mensaje) {
		this.ejecutar_funcion("decir",mensaje);
	}

	eliminar() {
		this.ejecutar_funcion("eliminar");
	}

	__getattr__(attr) {
		var valores = [];
		for(var i=0;i<this.length;i++) {
			valores.push(this[i][attr]);
		}
		return valores;
	}

	__setattr__(attr, valor) {
		for(var i=0; i<this.length; i++) {
			this[i][attr] = valor;
		}
	}

	ejecutar_funcion(id, argumentos1=undefined, argumentos2=undefined) {
		for(var i=0; i<this.length; i++) {
			this[i][id](argumentos1, argumentos2);
		}
	}
}
