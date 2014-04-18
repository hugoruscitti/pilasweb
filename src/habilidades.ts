/**
 * @class Habilidad
 *
 * Representa una habilidad que un actor puede aprender.
 */
class Habilidad {
  receptor;
  argumentos;

  constructor(receptor, argumentos=null) {
    this.receptor = receptor;
    this.argumentos = argumentos
  }

  actualizar() {
  }

  eliminar() {
  }

}

class Imitar extends Habilidad {
  objeto_a_imitar;
  con_rotacion;

  constructor(receptor, argumentos) {
    super(receptor,argumentos);
    this.objeto_a_imitar = this.argumentos.objeto_a_imitar;

    if (this.argumentos.con_rotacion === undefined) {
      this.argumentos.con_rotacion = true;
    }
    if (this.argumentos.con_escala === undefined) {
      this.argumentos.con_escala = true;
    }

    receptor.id = this.argumentos.objeto_a_imitar.id;
    receptor.figura = this.argumentos.objeto_a_imitar;
  }

  actualizar() {
      this.receptor.x = this.objeto_a_imitar.x;
      this.receptor.y = this.objeto_a_imitar.y;
      if (this.argumentos.con_rotacion) {
        this.receptor.rotacion = this.objeto_a_imitar.rotacion;
      }
      if (this.argumentos.con_escala) {
        this.objeto_a_imitar.escala = this.receptor.escala;
      }
  }

}

/**
 * @class PuedeExplotar
 *
 * Hace que un actor se pueda hacer explotar invocando al metodo eliminar.
 */
class PuedeExplotar extends Habilidad {

  constructor(receptor) {
    super(receptor);
    receptor.eliminar = () => {
      var explosion = new pilas.actores.Explosion();
      explosion.x = this.receptor.x;
      explosion.y = this.receptor.y;
      explosion.escala = this.receptor.escala;
      pilas.actores.Actor.prototype.eliminar.call(this.receptor);
    }
  }
}

/**
 * @class SeguirAlMouse
 *
 * Hace que un actor siga la posición del mouse en todo momento.
 */
class SeguirAlMouse extends Habilidad {
  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().mueve_mouse.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().mueve_mouse) {
      this.mover(evento);
    }
  }

  mover(evento) {
    this.receptor.x = evento.x;
    this.receptor.y = evento.y;
  }
}

/**
 * @class SeguirClicks
 *
 * Hace que el actor se coloque la posición del cursor cuando se hace click.
 */
class SeguirClicks extends Habilidad {

  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().click_de_mouse.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().click_de_mouse) {
      this.moverse_a_este_punto(evento);
    }
  }

  moverse_a_este_punto(evento) {
    this.receptor.x = [evento.x], 0.5;
    this.receptor.y = [evento.y], 0.5;
  }
}

/**
 * @class MoverseConElTeclado
 *
 * Hace que un actor cambie de posición con pulsar el teclado.
 */
class MoverseConElTeclado extends Habilidad {
  en_movimiento;
  
  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().actualiza.conectar(this);
    this.en_movimiento = false;
  }

  recibir(evento, tipo) {
    var x = 0;
    var y = 0;

    if (tipo == pilas.escena_actual().actualiza) {
      var control = pilas.escena_actual().control;
      var velocidad = this.receptor.velocidad || 5;
      
      if (control.izquierda)
        x = -velocidad;
      
      if (control.derecha)
        x = velocidad;
      
      if (control.arriba)
        y = velocidad;
      
      if (control.abajo)
        y = -velocidad;

        if (x != 0 || y != 0) {
            if (this.en_movimiento == false) {
                this.en_movimiento = true;
            }
            this.mover(x, y)
        }


    }

    if (this.en_movimiento) {
        if (x == 0 && y == 0) {
            this.en_movimiento = false;
            this.receptor.detener_animacion();
        }
    }
  }

  mover(x, y) {
    if (this.receptor.mover !== undefined) {
      this.receptor.mover(x, y);
    } else {
      this.receptor.x += x;
      this.receptor.y += y;
    }
  }
}

class MoverseConElTecladoConRotacion extends Habilidad {
  
  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().actualiza.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().actualiza) {
      var control = pilas.escena_actual().control;
      
      if (control.izquierda)
      	this.receptor.rotacion -= 2;
        
      if (control.derecha)
      	this.receptor.rotacion += 2;
      
      if (control.arriba)
        this.receptor.avanzar(1.5);
    }
  }
}




/**
 * @class Arrastrable
 *
 * Hace que un objeto se pueda arrastrar con el puntero del mouse.
 *
 * Cuando comienza a mover al actor se llama al metodo
 * ''comienza_a_arrastrar'' y cuando termina llama a
 * ''termina_de_arrastrar''. Estos nombres de metodos se llaman para
 * que puedas personalizar estos eventos, dado que puedes usar
 * polimorfismo para redefinir el comportamiento de estos dos metodos.
 */
class Arrastrable extends Habilidad {
  debe_arrastrar;
  constante;

  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().click_de_mouse.conectar(this);
    pilas.escena_actual().mueve_mouse.conectar(this);
    this.debe_arrastrar = false;
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().click_de_mouse) {
      this.cuando_intenta_arrastrar(evento);
    }
    if (tipo == pilas.escena_actual().cuando_termina_click) {
      this.cuando_termina_de_arrastrar(evento);
    }
    if (tipo == pilas.escena_actual().mueve_mouse) {
      this.cuando_arrastra(evento);
    }
  }

  cuando_intenta_arrastrar(evento) {
    if (evento.boton == 1) {
      if (this.receptor.colisiona_con_un_punto(evento.x, evento.y)) {
        pilas.escena_actual().cuando_termina_click.conectar(this);
        this.comienza_a_arrastrar(evento);
      }
    }
  }

  cuando_arrastra(evento) {

    // Muestra un cursor diferente si puede comenzar
    // a mover la figura.
    if (this.receptor.colisiona_con_un_punto(evento.x, evento.y))
      document.body.style.cursor = "move";
    else
      document.body.style.cursor = "default";

    if (this.debe_arrastrar === true) {
      if (this.receptor.tiene_fisica()) {
        this.constante.mover(evento.x, evento.y);
      } else {
        this.receptor.x = evento.x;
        this.receptor.y = evento.y;
      }

    }
  }

  cuando_termina_de_arrastrar(evento) {
    pilas.escena_actual().cuando_termina_click.desconectar(this);
    pilas.escena_actual().mueve_mouse.desconectar(this);
    this.termina_de_arrastrar();
  }

  comienza_a_arrastrar(evento) {
    if (this.receptor.tiene_fisica())
      this.constante = new ConstanteDeMovimiento(this.receptor.figura, evento);
      
    this.debe_arrastrar = true;
  }

  termina_de_arrastrar() {
    if (this.receptor.tiene_fisica())
      this.constante.eliminar();

    this.debe_arrastrar = false;
  }

}


class Disparar extends Habilidad {
	contador;
	
	constructor(receptor) {
		this.contador = 0;
		super(receptor);
    pilas.escena_actual().actualiza.conectar(this);
	}
	
  recibir(evento, tipo) {
		
		if (this.contador < 1) {
			if (tipo == pilas.escena_actual().actualiza) {
				var control = pilas.escena_actual().control;
				
				if (control.boton) {
					this.receptor.disparar();
					this.contador = 30;
				}
			}
		} else {
			this.contador -= 1;
		}
	}
	
	
}

class RebotarComoPelota extends Habilidad {

  constructor(receptor) {
    super(receptor);
    var circulo = pilas.escena_actual().fisica.crear_circulo(receptor.x, receptor.y, receptor.radio_de_colision, {});
    receptor.imitar(circulo);
  }

}

class RebotarComoCaja extends Habilidad {

  constructor(receptor) {
    super(receptor);
    var rectangulo = pilas.escena_actual().fisica.crear_rectangulo(receptor.x, receptor.y, receptor.radio_de_colision*2, receptor.radio_de_colision*2, {});
    receptor.imitar(rectangulo);
  }

}



class SeMantieneEnPantalla extends Habilidad {
  
  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().actualiza.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().actualiza) {
			if (this.receptor.izquierda > pilas.opciones.ancho/2)
				this.receptor.derecha = -pilas.opciones.ancho/2;
			
			if (this.receptor.derecha < -pilas.opciones.ancho/2)
				this.receptor.izquierda = pilas.opciones.ancho/2;
			
			if (this.receptor.abajo > pilas.opciones.alto/2)
				this.receptor.arriba = -pilas.opciones.alto/2;
			
			if (this.receptor.arriba < -pilas.opciones.alto/2)
				this.receptor.abajo = pilas.opciones.alto/2;
			
    }
  }
}

/**
 * @class Habilidades
 *
 * Representa todas las habilidades conocidas en pilas-engine.
 */
class Habilidades {
  Arrastrable;
  PuedeExplotar;
  SeguirAlMouse;
  SeguirClicks;
  MoverseConElTeclado;
  MoverseConElTecladoConRotacion;
  SeMantieneEnPantalla;
  Disparar;
  RebotarComoPelota;
  RebotarComoCaja;
  Imitar;

  constructor() {
    this.Arrastrable = Arrastrable;
    this.PuedeExplotar = PuedeExplotar;
    this.SeguirAlMouse = SeguirAlMouse;
    this.SeguirClicks = SeguirClicks;
    this.MoverseConElTeclado = MoverseConElTeclado;
    this.MoverseConElTecladoConRotacion = MoverseConElTecladoConRotacion;
    this.SeMantieneEnPantalla = SeMantieneEnPantalla;
    this.Disparar = Disparar;
    this.RebotarComoPelota = RebotarComoPelota;
    this.RebotarComoCaja = RebotarComoCaja;
    this.Imitar = Imitar;
  }
}
