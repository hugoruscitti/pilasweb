
/**
 * @class Control
 *
 * Representa un control de teclado sencillo.
 *
 * Este objeto permite acceder al estado del teclado usando atributos.
 *
 * Por ejemplo, con este objeto, para saber si el usuario está
 * pulsando el direccional hacia la izquierda puedes ejecutar::
 *
 *     @example
 *     if (pilas.escena_actual().control.izquierda) {
 *       console.log('Ha pulsado hacia la izquierda');
 *     }
 *
 * Es decir, si bien Control es una clase, no hace falta
 * instanciarla. Ya existe un objeto que se puede consultar bajo el
 * nombre ``pilas.escena_actual().control``.
 *
 * Entonces, una vez que tienes la referencia para consultar, los
 * atributos que tiene este objeto control son::
 *
 *     @example
 *     izquierda
 *     derecha
 *     arriba
 *     abajo
 *     boton
 *
 * Cada uno de estos atributos te pueden devolver true, o false,
 * indicando si el control está pulsado o no.
 */
class Control {
  izquierda;
  derecha;
  arriba;
  abajo;
  boton;

  constructor(escena) {
    this.izquierda = false;
    this.derecha = false;
    this.arriba = false;
    this.abajo = false;
    this.boton = false;

    escena.pulsa_tecla.conectar(this);
    escena.suelta_tecla.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().pulsa_tecla) {
      this.cuando_pulsa_una_tecla(evento);
    }
    if (tipo == pilas.escena_actual().suelta_tecla) {
      this.cuando_suelta_una_tecla(evento);
    }
  }

  cuando_pulsa_una_tecla(evento) {
		
    switch (evento.codigo) {
      case simbolos.IZQUIERDA: {
        this.izquierda = true;
        break;
      }
      case simbolos.DERECHA: {
        this.derecha = true;
        break;
      }
      case simbolos.ARRIBA: {
        this.arriba = true;
        break;
      }
      case simbolos.ABAJO: {
        this.abajo = true;
        break;
      }
      case simbolos.ESPACIO: {
        this.boton = true;
        break;
      }
            
      case simbolos.W: {
          this.arriba = true;
          break;
      }
            
      case simbolos.A: {
          this.izquierda = true;
          break;
      }
            
      case simbolos.D: {
          this.derecha = true;
          break;
      }
            
      case simbolos.S: {
          this.abajo = true;
          break;
      }
            
      case simbolos.J: {
          this.boton = true;
          break;
      }
            
       
    }
  }

  cuando_suelta_una_tecla(evento) {
    switch (evento.codigo) {
      case simbolos.IZQUIERDA: {
        this.izquierda = false;
        break;
      }
      case simbolos.DERECHA: {
        this.derecha = false;
        break;
      }
      case simbolos.ARRIBA: {
        this.arriba = false;
        break;
      }
      case simbolos.ABAJO: {
        this.abajo = false;
        break;
      }
      case simbolos.ESPACIO: {
        this.boton = false;
        break;
      }
            
      case simbolos.W: {
          this.arriba = false;
          break;
      }
            
      case simbolos.A: {
          this.izquierda = false;
          break;
      }
            
      case simbolos.D: {
          this.derecha = false;
          break;
      }
            
      case simbolos.S: {
          this.abajo = false;
          break;
      }
            
      case simbolos.J: {
          this.boton = false;
          break;
      }
    }
  }

}
