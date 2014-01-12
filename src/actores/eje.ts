/// <reference path="actor.ts"/>

class Eje extends Actor {
    
  constructor(x, y) {
		/* patch para permitir la instancia sin anteponer new */
		if (!(this instanceof Eje)) 
			return new Eje(x, y);
	
    var imagen = "ejes.png";
    super(imagen, x, y);
    this.centro_x = 256;
    this.centro_y = 256;
  }

}