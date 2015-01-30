/**
 * @class Comportamiento
 *
 * Representa una habilidad que un actor puede aprender.
 */
class Comportamiento {
  receptor;
  argumentos;

  constructor(argumentos) {
    this.argumentos = argumentos;
  }

  iniciar(receptor) {
    this.receptor = receptor;
  }

  actualizar() {
  }

  eliminar() {
  }
}

class AvanzarComoProyectil extends Comportamiento {
  velocidad;
  dx;
  dy;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.velocidad = this.argumentos.velocidad || 2;
    var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.receptor.rotacion);
    this.dx = Math.cos(rotacion_en_radianes);
    this.dy = Math.sin(rotacion_en_radianes);
  }

  actualizar() {
    this.receptor.x += this.dx * this.velocidad;
    this.receptor.y += this.dy * this.velocidad;
  }
}

class Avanzar extends Comportamiento {
  pasos;
  velocidad;
  dx;
  dy;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.pasos = Math.abs(this.argumentos.pasos);
    this.velocidad = this.argumentos.velocidad || 5;   
    var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.receptor.rotacion);
    this.dx = Math.cos(rotacion_en_radianes);
    this.dy = Math.sin(rotacion_en_radianes);
  }

  actualizar() {
    if(this.pasos > 0) {
      if(this.pasos - this.velocidad < 0) {
        var avance = this.pasos;
      }
      else {
        var avance = this.velocidad;
      }

      this.pasos -= avance;
      this.receptor.x += this.dx * avance;
      this.receptor.y += this.dy * avance;
    }
    else {
      return true;
    }
  }
}

class Girar extends Comportamiento {
  angulo;
  tiempo;
  angulo_aux;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.angulo = this.argumentos.angulo || 360;
    this.tiempo = this.argumentos.tiempo || 1;
    this.angulo_aux = this.receptor.rotacion + this.angulo;
  }

  actualizar() {
    pilas.interpolar(this.receptor,"rotacion",[this.angulo_aux], this.tiempo);
    if (this.angulo_aux == this.receptor.rotacion) {
      return true;
    }
  }
}

class Saltar extends Comportamiento {
  cuando_termina;
  suelo;
  velocidad_inicial;
  velocidad;
  velocidad_aux;
  sonido_saltar;

  iniciar(receptor) {
    this.receptor = receptor;
    this.suelo = this.receptor.y;
    this.velocidad_inicial = this.argumentos.velocidad_inicial || 10;
    this.velocidad = this.velocidad_inicial;
    this.velocidad_aux = this.velocidad_inicial;
    this.cuando_termina = this.argumentos.cuando_termina || null;
    this.sonido_saltar = pilas.sonidos.cargar('saltar.wav');
    this.sonido_saltar.reproducir();
  }

  actualizar() {
    this.receptor.y += this.velocidad;
    this.velocidad -= 0.3;

    if(this.receptor.y <= this.suelo) {
      this.velocidad_aux /= 2.0;
      this.velocidad = this.velocidad_aux;

      if(this.velocidad_aux <= 1) {
        this.receptor.y = this.suelo;
        if (this.cuando_termina) {
          this.cuando_termina.call(this.receptor);
        }
        return true;
      }
    }
  }
}

class Saltando extends Comportamiento {
  suelo;
  dy;
  cuando_termina;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.dy = 10;
    this.suelo = this.receptor.y
    this.cuando_termina = this.argumentos.cuando_termina || null;
  }

  actualizar() {
    this.receptor.y += this.dy;
    this.dy -= 0.3

    if (this.receptor.y < this.suelo){
      this.receptor.y = this.suelo;
      if (this.cuando_termina) {
        this.cuando_termina.call(this.receptor);
      }
      return true;
    }

    if (pilas.escena_actual().control.derecha)
      this.receptor.x += 1;
    else if (pilas.escena_actual().control.izquierda)
      this.receptor.x -= 1
  }
}

class Orbitar extends Comportamiento {
  punto_de_orbita_x;
  punto_de_orbita_y;
  radio;
  velocidad;
  direccion;
  angulo;

  iniciar(receptor) {
    this.receptor = receptor;
    this.punto_de_orbita_x = this.argumentos.punto_de_orbita_x || 0; 
    this.punto_de_orbita_y = this.argumentos.punto_de_orbita_y || 0;
    this.radio = this.argumentos.radio || 10;
    this.velocidad = this.argumentos.velocidad || .0001;
    this.direccion = this.argumentos.direccion || "derecha";
    this.angulo = 0;

    if(this.direccion == "izquierda") {
      this.velocidad = -this.velocidad
    }

    else if(this.direccion == "derecha") {
      this.velocidad;
    }
  }

  actualizar() {
    this.angulo += this.velocidad;
    this.mover_astro();
  }

  mover_astro() {
    this.receptor.x = this.punto_de_orbita_x + 
    (Math.cos(pilas.utils.convertir_a_grados(this.angulo)) * this.radio);

    this.receptor.y = this.punto_de_orbita_y - 
    (Math.sin(pilas.utils.convertir_a_grados(this.angulo)) * this.radio);
  }

}

class OrbitarSobreActor extends Orbitar {
  actor;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.punto_de_orbita_x = this.argumentos.actor.x;
    this.punto_de_orbita_y = this.argumentos.actor.y;
  }

  actualizar() {
    this.punto_de_orbita_x = this.argumentos.actor.x;
    this.punto_de_orbita_y = this.argumentos.actor.y;
    super.actualizar();
  }

}

class CaminarBase extends Comportamiento {
  pasos;
  velocidad;

  iniciar(receptor) {
    this.receptor = receptor;
    this.pasos = this.argumentos.pasos || 1;
    this.velocidad = 1;
  }

  actualizar() {
    this.mover();
    this.pasos -= 0.05;

    if (this.pasos <= 0.05) { // TODO: en realidad tendría que ser 0.0 en vez de 0.1, pero por algún motivo siempre avanza un pixel mas...
      this.receptor.detener_animacion()
      return true;
    }
  }

  mover() {
  }
}

class CaminaArriba extends CaminarBase {
  mover() {
    this.receptor.mover(0, this.velocidad);
  }
}

class CaminaAbajo extends CaminarBase {
  mover() {
    this.receptor.mover(0, -this.velocidad);
  }
}

class CaminaIzquierda extends CaminarBase {
  mover() {
    this.receptor.mover(-this.velocidad, 0);
  }
}

class CaminaDerecha extends CaminarBase {
  mover() {
    this.receptor.mover(this.velocidad, 0);
  }
}

/**
 * @class Secuencia
 *
 * Representa una secuencia de comportamientos que un actor realiza de forma ordenada.
 * 
 * Espera una lista de comportamientos.
 */
class Secuencia extends Comportamiento {

  secuencia;
  comando_actual;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.secuencia = this.argumentos.secuencia || [];
    this.comando_actual = 0;
    if(this.secuencia.length > 0) {
      this.secuencia[0].iniciar(receptor);
    }
  }

  actualizar() {
    var finished = this.secuencia[this.comando_actual].actualizar();
    if(finished) {
      this.comando_actual++;
      if(this.comando_actual > this.secuencia.length) {
        return true;       
      } else {
        this.secuencia[this.comando_actual].iniciar(this.receptor);
      }
    }
  }
}

/**
 * @class Alternativa
 *
 * Representa un if-then-else entre dos comportamientos. Se ejecuta uno u otro dependiendo de una condicion.
 *
 * Recibe como argumentos dos comportamientos de tipo Secuencia y una funcion booleana a evaluar.
 */
class Alternativa extends Comportamiento {

  rama_entonces;
  rama_sino;
  condicion;
  rama_elegida;
  ejecutado;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.rama_entonces = this.argumentos.entonces;
    this.rama_sino = this.argumentos.sino || new Secuencia([]);
    this.condicion = this.argumentos.condicion;
    this.ejecutado = false;
  }

  actualizar() {
    if(!this.ejecutado) {
      this.ejecutado = true;
      if(this.condicion(this.receptor)) {
        this.rama_elegida = this.rama_entonces;      
      } else {
        this.rama_elegida = this.rama_sino;
      }
      this.rama_elegida.iniciar(this.receptor);
    }
    
    this.rama_elegida.actualizar();
  }
}

/**
 * @class RepetirHasta
 *
 * Representa un bucle condicional que repite un comportamiento hasta que se cumple cierta condicion.
 *
 * Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
 */
class RepetirHasta extends Comportamiento {

  secuencia;
  condicion;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.secuencia = this.argumentos.secuencia;
    this.condicion = this.argumentos.condicion;
    this.secuencia.iniciar(receptor);
  }

  actualizar() {
    if(this.condicion(this.receptor)) {
      return true;
    } else {
      this.secuencia.actualizar();
    }
  }
}

/**
 * @class Programa
 *
 * Representa un actor que construye un programa y lo ejecuta
 *
**/
class Programa extends Comportamiento {

  stack_secuencias;
  programa;
  
  constructor(argumentos) {
    super(argumentos);
    this.stack_secuencias = [[]];
  }
  
  empezar_secuencia() {
    this.stack_secuencias.push([]);
  }
  
  agregar_a_secuencia(x) {
    this.stack_secuencias[this.stack_secuencias.length - 1].push(x);
  }

  terminar_secuencia() {
    var s = this.stack_secuencias.pop();
    this.stack_secuencias.push(new Secuencia({ entonces: s }));
  }
  
  terminar_repetir_hasta(c) {
    this.terminar_secuencia();
    var s = this.stack_secuencias.pop();
    this.agregar_a_secuencia(new RepetirHasta({ secuencia: s, condicion: c }));  
  }
  
  terminar_alternativa_si(c) {
    this.terminar_secuencia();
    var s = this.stack_secuencias.pop();
    this.agregar_a_secuencia(new Alternativa({ entonces: s, sino: [], condicion: c }));  
  }
  
  terminar_alternativa_sino(c) {
    var s2 = this.stack_secuencias.pop();
    var s1 = this.stack_secuencias.pop();
    this.agregar_a_secuencia(new Alternativa({ entonces: s1, sino: s2, condicion: c }));
  }

  iniciar(receptor) {
    super.iniciar(receptor);
    this.programa = this.stack_secuencias.pop();
  }
  
  actualizar() {
    var programa_terminado = this.programa.actualizar()
    if(programa_terminado) {
      return true;
    }
  }

}


/**
 * @class Comportamientos
 *
 * Representa todos los comportamientos que puede hacer un actor en pilas-engine.
 */
class Comportamientos {
  Subir;
  CaminarBase;
  CaminaArriba;
  CaminaAbajo;
  CaminaIzquierda;
  CaminaDerecha;
  Orbitar;
  OrbitarSobreActor
  Saltar;
  Girar;
  Avanzar;
  AvanzarComoProyectil;
  Saltando;
  Secuencia;
  Alternativa;
  RepetirHasta;
  Programa;

  constructor() {
    this.CaminarBase = CaminarBase;
    this.CaminaArriba = CaminaArriba;
    this.CaminaAbajo = CaminaAbajo;
    this.CaminaIzquierda = CaminaIzquierda;
    this.CaminaDerecha = CaminaDerecha;
    this.Orbitar = Orbitar;
    this.OrbitarSobreActor = OrbitarSobreActor;
    this.Saltar = Saltar;
    this.Girar = Girar;
    this.Avanzar = Avanzar;
    this.AvanzarComoProyectil = AvanzarComoProyectil;
    this.Saltando = Saltando;
    this.Secuencia = Secuencia;
    this.Alternativa = Alternativa;
    this.RepetirHasta = RepetirHasta;
    this.Programa = Programa;
  }
}
