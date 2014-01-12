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
    this.centro_x = 85;
    this.centro_y = 80;
    this.mensaje = mensaje;
    this.actor_texto = new pilas.actores.Texto(x-25, y+50, mensaje);

    pilas.mundo.agregar_tarea_una_vez(3, this.eliminar, {}, this);
  }

  eliminar() {
    this.actor_texto.eliminar();
    super.eliminar();
  }

}

