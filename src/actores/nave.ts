/// <reference path="actor.ts"/>

class Nave extends Actor {
  paso;
  teclado_habilitado;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("nave.png", 2);
    super(imagen, x, y);
    this.centro_x = 23;
    this.centro_y = 23;
    this.paso = 0;
    this.teclado_habilitado = false;
    this.aprender(pilas.habilidades.PuedeExplotar);
  }
  
  habilitar_teclado() {
  	if (this.teclado_habilitado === false) {
    	this.aprender(pilas.habilidades.MoverseConElTecladoConRotacion);
        this.teclado_habilitado = true;
        return "Habilitando el teclado";
    } else {
    	return "El teclado ya estaba habilitado.";
    }
  }

  actualizar() {
    this.paso += 0.1;
    this._imagen.definir_cuadro(parseInt(this.paso) % 2)
    var control = pilas.escena_actual().control;
  }
  
  disparar() {
    // TODO: convertir en una habilidad.
    var disparo = new pilas.actores.Proyectil();
    disparo.rotacion = this.rotacion - 90;
    disparo.x = this.x;
    disparo.y = this.y;
    return "Disparando ...";
  }
  
  avanzar(velocidad) {
    var rotacion_en_radianes;
    var dx;
    var dy;
    
    if (velocidad === undefined)
      velocidad = 5;
        
    var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.rotacion + 90);
    
    dx = Math.cos(rotacion_en_radianes) * velocidad;
    dy = Math.sin(rotacion_en_radianes) * velocidad;
    
    this.x += dx;
    this.y += dy;
  }
  
}
