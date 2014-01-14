/// <reference path="actor.ts"/>

class Mono extends Actor {
	image_normal;
	image_smile;
	image_shout;
	constructor(x, y) {
		this.image_normal = 'monkey_normal.png';
		this.image_smile = 'monkey_smile.png';
		this.image_shout = 'monkey_shout.png';
		super(this.image_normal, x, y);

		this.radio_de_colision = 50;
	}

	sonreir() {
		this.imagen = this.image_smile;
		pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
	}

	gritar() {
		this.imagen = this.image_shout;
		pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
	}

	normal() {
		this.imagen = this.image_normal;
	}

	decir(mensaje) {
		this.sonreir
		super.decir(mensaje)
	}

	saltar() {
		this.sonreir()
		this.hacer(pilas.comportamientos.Saltar)
	}
}