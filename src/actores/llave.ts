/// <reference path="actor.ts"/>

class Llave extends Actor {

  constructor(x, y) {
		/* patch para permitir la instancia sin anteponer new */
		if (!(this instanceof Llave)) 
			return new Llave(x, y);
	
    var imagen = "llave.png";
    super(imagen, x, y);
    this.centro_x = 9;
    this.centro_y = 13;
    this.z = y;
  }

}

