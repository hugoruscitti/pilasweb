/// <reference path="actor.ts"/>

class Piedra extends Actor {
	dx;
	dy;

  constructor(x, y, tamano, dx, dy) {
		this.dx = dx || 0;
		this.dy = dy || 0;

		var tamano = tamano || "grande";
    var imagen = "piedra_" + tamano + ".png";
		
    super(imagen, x, y);
    this.centro_x = 18;
    this.centro_y = 18;
		this.rotacion = 0;
  }
	
	actualizar() {
		this.x += this.dx;
		this.y += this.dy;
		this.rotacion += 1;
	}

}

