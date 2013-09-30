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
		
		switch (tamano) {
				case 'chica':
					this.centro_x = 7;
					this.centro_y = 7;
					break;
				
				case 'media':
					this.centro_x = 16;
					this.centro_y = 16;
					break;
				
				case 'grande':
					this.centro_x = 26;
					this.centro_y = 26;
					break;
				
				default:
					throw "El tamaño " + tamano + "no está permitido. Use 'chica', 'media' o 'grande'."
					break;
		}
		
		this.rotacion = 0;
  }
	
	actualizar() {
		this.x += this.dx;
		this.y += this.dy;
		this.rotacion += 1;
	}

}

