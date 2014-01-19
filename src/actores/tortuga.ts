class Tortuga extends Actor {
    anterior_x;
    anterior_y;
	pizarra;

	constructor(x=0, y=0) {
		var imagen = 'tortuga.png';
		super(imagen, x, y);

        this.pizarra = new pilas.actores.Pizarra();
	}

	avanzar(pasos) {
		this.hacer_luego(pilas.comportamientos.Avanzar, {pasos:pasos, velocidad:2});
	}

	girarderecha(delta) {
		this.hacer_luego(pilas.comportamientos.Girar,{angulo:delta, tiempo:.5});
	}

    girarizquierda(delta) {
        this.hacer_luego(pilas.comportamientos.Girar,{angulo:-delta, tiempo:.5});
    }

    actualizar() {
        if(this.x != this.anterior_x || this.y != this.anterior_y) {

            this.pizarra.linea(this.anterior_x, this.anterior_y, this.x, this.y);

            this.anterior_x = this.x;
            this.anterior_y = this.y;

        }	
    }

    crear_poligono(lados=3, escala=100) {
        var rotacion = 360 / lados;
        for(var i=0; i<lados; i++) {
            this.avanzar(escala);
            this.girarderecha(rotacion);
        }
    }

}