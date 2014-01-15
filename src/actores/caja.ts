/// <reference path="actor.ts"/>

class Caja extends Actor {

  constructor(x, y) {
		/* patch para permitir la instancia sin anteponer new */
		if (!(this instanceof Caja)) 
			return new Caja(x, y);
	
    var imagen = "caja.png";
    super(imagen, x, y);
    this.centro_x = 24;
    this.centro_y = 24;
    this.radio_de_colision = 45;

    this.aprender(pilas.habilidades.RebotarComoCaja);
  }

}

