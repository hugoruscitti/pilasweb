/// <reference path="actor.ts"/>

class Globo extends Actor {
  mensaje;
  actor_texto;

  constructor(x, y, mensaje) {
		/* patch para permitir la instancia sin anteponer new */
		if (!(this instanceof Globo)) 
			return new Globo(x, y, mensaje);
	
    var imagen = "globo.png";
    super(imagen, x, y);
    this.centro_x = 25;
    this.centro_y = 20;
    this.mensaje = mensaje;
    this.actor_texto = new pilas.actores.Texto(x-20, y+20, mensaje);

    pilas.mundo.agregar_tarea_una_vez(3, this.eliminar, {}, this);
  }

  eliminar() {
    this.actor_texto.eliminar();
    super.eliminar();
  }

}

