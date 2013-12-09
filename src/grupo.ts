//modulo grupo
class grupo {
	Grupo;
	constructor() {
		this.Grupo = Grupo;
	}
}

class Grupo {
	//TODO: encontrar una forma de llamar implicitamente a las funciones y propiedades de los actores
	//		parecido a __getattr__ y __setattr__ de Python
	lista;
	constructor(lista=[]) {
		this.lista = lista;
	}

	agregar_grupo(grupo) {
		for(var i=0;i<grupo.lista.length;i++) {
			this.lista.push(grupo.lista[i]);
		}
	}

	agregar_elemento(elemento) {
		this.lista.push(elemento);
	}

	get x() {
		return this.__getattr__("x");
	}

	set x(x) {
		this.__setattr__("x",x);
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

	aprender(args, args2={}) {	
		this.__execfunct__("aprender", args, args2);
	}

	hacer(args, args2={}) {
		this.__execfunct__("hacer", args, args2);
	}

	hacer_luego(args, args2={}) {
		this.__execfunct__("hacer_luego", args, args2);
	}

	decir(args) {
		this.__execfunct__("decir",args);
	}

	eliminar() {
		this.__execfunct__("eliminar");
		this.lista.splice(0,this.lista.length);		
	}

	__execfunct__(id,args=undefined, args2=undefined) {
		for(var i=0;i<this.lista.length;i++) {
			this.lista[i][id](args, args2);
		}
	}

	__getattr__(attr) {
	
		var valores = []
		for(var i=0;i<this.lista.length;i++) {
			valores.push(this.lista[i][attr]);
		}

		return valores;
	}

	__setattr__(attr, valor) {
		for(var i=0;i<this.lista.length;i++) {
			this.lista[i][attr] = valor;
		}
	}
}
