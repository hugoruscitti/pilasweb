/// <reference path="actor.ts"/>

class Bloque extends Actor {

  constructor(x, y, nombre_imagen) {
		/* patch para permitir la instancia sin anteponer new */
		if (!(this instanceof Bloque)) 
			return new Bloque(x, y, nombre_imagen);
		
    var imagen = nombre_imagen || "bloque.png";
    super(imagen, x, y);
    this.centro_x = 13;
    this.centro_y = this.alto;
    this.z = y;
  }

}

