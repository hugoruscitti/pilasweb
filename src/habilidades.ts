/**
 * @class Habilidad
 *
 * Representa una habilidad que un actor puede aprender.
 */
class Habilidad {
  receptor;

  constructor(receptor) {
    this.receptor = receptor;
  }

  actualizar() {
  }

  eliminar() {
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
  
  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().actualiza.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().actualiza) {
      var control = pilas.escena_actual().control;
      
      if (control.izquierda)
        this.receptor.x -= 5;
      
      if (control.derecha)
        this.receptor.x += 5;
      
      if (control.arriba)
        this.receptor.y += 5;
      
      if (control.abajo)
        this.receptor.y -= 5;
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
  constructor(receptor) {
    super(receptor);
    pilas.escena_actual().click_de_mouse.conectar(this);
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
        pilas.escena_actual().mueve_mouse.conectar(this);
        this.comienza_a_arrastrar();
      }
    }
  }

  cuando_arrastra(evento) {
    this.receptor.x = evento.x;
    this.receptor.y = evento.y;
  }

  cuando_termina_de_arrastrar(evento) {
    pilas.escena_actual().cuando_termina_click.desconectar(this);
    pilas.escena_actual().mueve_mouse.desconectar(this);
    this.termina_de_arrastrar();
  }

  comienza_a_arrastrar() {}
  termina_de_arrastrar() {}
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

  constructor() {
    this.Arrastrable = Arrastrable;
    this.PuedeExplotar = PuedeExplotar;
    this.SeguirAlMouse = SeguirAlMouse;
    this.SeguirClicks = SeguirClicks;
    this.MoverseConElTeclado = MoverseConElTeclado;
    this.MoverseConElTecladoConRotacion = MoverseConElTecladoConRotacion;
  }
}
