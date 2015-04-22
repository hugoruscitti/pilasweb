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
  reiniciar;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.secuencia = this.argumentos.secuencia;
    this.reiniciar = true;
  }

  actualizar() {
    if(this.reiniciar) {
      this.reiniciar = false;
      this.comando_actual = 0;
      if(this.secuencia.length > 0) {
        this.secuencia[0].iniciar(this.receptor);
      }
    }

    if(this.secuencia.length > 0 && this.comando_actual < this.secuencia.length) {
      var finished = this.secuencia[this.comando_actual].actualizar();
      if(finished) {
        this.comando_actual++;
        if(this.comando_actual < this.secuencia.length) {
          this.secuencia[this.comando_actual].iniciar(this.receptor);
        }
      }
    } else {
      this.reiniciar = true; // para reiniciar la secuencia en la proxima ejecucion
      return true;
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
    this.rama_sino = this.argumentos.sino;
    this.condicion = this.argumentos.condicion;
    this.ejecutado = false;
  }

  actualizar() {
    if(!this.ejecutado) {
      this.ejecutado = true;
      if(this.condicion()) {
        this.rama_elegida = this.rama_entonces;
      } else {
        this.rama_elegida = this.rama_sino;
      }
      this.rama_elegida.iniciar(this.receptor);
    }

    var finished = this.rama_elegida.actualizar();
    if(finished) {
      // para que se vuelva a evaluar la condicion si vuelven a llamar a este comportamiento
      this.ejecutado = false;

      return true;
    }
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

  ejecutado;
  secuencia;
  condicion;
  evaluar_condicion;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.secuencia = this.argumentos.secuencia;
    this.condicion = this.argumentos.condicion;
    this.secuencia.iniciar(receptor);
    this.evaluar_condicion = true;
  }

  actualizar() {
    if(this.evaluar_condicion) {
      this.evaluar_condicion = false;
      if(this.condicion()) { // chequea si corta el bucle
        this.evaluar_condicion = true; // se resetea antes de salir, para volvese a evaluar
        return true;
      }
    }

    var termino = this.secuencia.actualizar();

    if(termino) {
      this.evaluar_condicion = true;
    }
  }
}

/**
 * @class RepetirN
 *
 * Representa un bucle que repite una cierta cantidad de veces un comportamiento
 *
 * Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
 */
class RepetirN extends Comportamiento {

  secuencia;
  cantidad;
  cantidad_actual;
  volver_a_evaluar;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.secuencia = this.argumentos.secuencia;
    this.cantidad = this.argumentos.cantidad;
    this.secuencia.iniciar(receptor);
    this.volver_a_evaluar = true;
  }

  actualizar() {
    if(this.volver_a_evaluar) {
      this.volver_a_evaluar = false;
      this.cantidad_actual = this.cantidad();
    }

    if(this.cantidad_actual == 0) {
      this.volver_a_evaluar = true;
      return true;
    }

    var termino = this.secuencia.actualizar();
    if(termino) {
      this.cantidad_actual--;
    }
  }
}

/**
 * @class CambiarAtributo
 *
 * Representa el cambio de un atributo del actor
 *
 * Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
 */
class CambiarAtributo extends Comportamiento {

  nombre;
  funcion_valor;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.nombre = this.argumentos.nombre;
    this.funcion_valor = this.argumentos.valor;
  }

  actualizar() {
    this.receptor.set_atributo(this.nombre, this.funcion_valor());
    return true;
  }
}

/**
 * @class CambiarVariableLocal
 *
 * Representa el cambio de una variable local del procedimiento actual
 *
 * Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
 */
class CambiarVariableLocal extends Comportamiento {

  nombre;
  funcion_valor;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.nombre = this.argumentos.nombre;
    this.funcion_valor = this.argumentos.valor;
  }

  actualizar() {
    this.receptor.set_variable(this.nombre, this.funcion_valor());
    return true;
  }
}

/**
 * @class LlamadaProcedimiento
 *
 * Representa una llamada a un procedimiento
 *
 * Recibe como argumentos el nombre del procedimiento y el contexto de
 * definiciones
 */
class LlamadaProcedimiento extends Comportamiento {

  nombre;
  procedimientos;
  secuencia;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.nombre = this.argumentos.nombre;

    // consigue parametros y nombre de esta definicion
    var p = this.argumentos.procedimientos[this.nombre];

    // construye el scope para los argumentos
    var args_evaluados = {};
    for(var i = 0; i < p.parametros.length; i++) {
      var arg_evaluado = this.argumentos.argumentos[i]();
      args_evaluados[p.parametros[i]] = arg_evaluado;
    }
    this.receptor.push_parametros(args_evaluados);

    // inicializa el scope de variables locales
    this.receptor.push_variables({});

    // genera una nueva secuencia a ejecutar
    this.secuencia = new Secuencia({ secuencia: p.secuencia });
    this.secuencia.iniciar(this.receptor);
  }

  actualizar() {
    var termino = this.secuencia.actualizar();
    if(termino) {
      this.receptor.pop_parametros();
      this.receptor.pop_variables();
      return true;
    }
  }
}

/**
 * @class Expresion
 *
 * Representa la evaluacion de una expresion
 *
 * Recibe como argumento la expresión a evaluar
 */
class Expresion extends Comportamiento {

  expresion;
  resultado;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.expresion = this.argumentos.expresion;
  }

  actualizar() {
    this.resultado = this.expresion();
    return true;
  }
}

/**
 * @class LlamadaFuncion
 *
 * Representa una llamada a una funcion
 *
 * Recibe como argumentos el nombre de la funcion, el contexto de
 * definiciones de funciones y la expresión a retornar
 */
class LlamadaFuncion extends Expresion {

  nombre;
  funciones;
  secuencia;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.nombre = this.argumentos.nombre;
    var s = this.argumentos.funciones[this.nombre].secuencia;
    this.secuencia = new Secuencia({ secuencia: s });
    this.secuencia.iniciar(this.receptor);
  }

  actualizar() {
    var termino = this.secuencia.actualizar();
    if(termino) {
      this.resultado = this.expresion();
      return true;
    }
  }
}

/**
 * @class ConstructorDePrograma
 *
 * Permite construir un comportamiento que representa un programa
 *
**/
class ConstructorDePrograma {

  stack_secuencias;
  procedimientos;
  funciones;

  constructor() {
    this.stack_secuencias = [];
    this.procedimientos = {};
    this.funciones = {};
  }

  empezar_secuencia() {
    this.stack_secuencias.push([]);
  }

  hacer(comportamiento, argumentos) {
    this.stack_secuencias[this.stack_secuencias.length - 1].push(new comportamiento(argumentos));
  }

  terminar_secuencia() {
    var s = this.stack_secuencias.pop();
    this.stack_secuencias.push(new Secuencia({ secuencia: s }));
  }

  repetir_hasta(c) {
    this.terminar_secuencia();
    var s = this.stack_secuencias.pop();
    this.hacer(RepetirHasta, { secuencia: s, condicion: c });
  }

  alternativa_si(c) {
    this.terminar_secuencia();
    var s = this.stack_secuencias.pop();
    this.hacer(Alternativa, { entonces: s, sino: new Secuencia({ secuencia: [] }), condicion: c });
  }

  alternativa_sino(c) {
    this.terminar_secuencia();
    var s2 = this.stack_secuencias.pop();
    this.terminar_secuencia();
    var s1 = this.stack_secuencias.pop();
    this.hacer(Alternativa, { entonces: s1, sino: s2, condicion: c });
  }

  repetirN(n) {
    this.terminar_secuencia();
    var s = this.stack_secuencias.pop();
    this.hacer(RepetirN, { secuencia: s, cantidad: n });
  }

  def_proc(n, params) {
    // no creo un comportamiento de
    // tipo secuencia como en las estructuras de control
    // porque dicho objeto deberia crearse recien
    // en la llamada al procedimiento
    var s = this.stack_secuencias.pop();
    this.procedimientos[n] = { secuencia: s, parametros: params };
  }

  llamada_proc(n, proc_args) {
    var procs = this.procedimientos;
    this.hacer(LlamadaProcedimiento, { nombre: n, procedimientos: procs, argumentos: proc_args });
  }

  def_func(n) {
    var s = this.stack_secuencias.pop();
    this.funciones[n] = s;
  }

  llamada_func(n, exp) {
    var funcs = this.funciones;
    this.hacer(LlamadaFuncion, { nombre: n, funciones: funcs, expresion: exp });
  }

  cambio_atributo(n, f) {
    this.hacer(CambiarAtributo, { nombre: n, valor: f });
  }

  cambio_variable(n, f) {
    this.hacer(CambiarVariableLocal, { nombre: n, valor: f });
  }

  inyectar_scopes(actor) {
    this.inyectar_parametros(actor);
    this.inyectar_atributos(actor);
    this.inyectar_variables_locales(actor);
  }

  inyectar_parametros(actor) {
    actor.scope_parametros = [{}];
    actor.scope_parametros_actual = {};

    actor.push_parametros = function(ids) {
      this.scope_parametros.push(ids);
      this.scope_parametros_actual = ids;
    }

    actor.pop_parametros = function() {
      this.scope_parametros_actual = this.scope_parametros.pop();
    }

    actor.parametro = function(n) {
      return this.scope_parametros_actual[n];
    }
  }

  inyectar_variables_locales(actor) {
    actor.scope_var_locales = [{}];
    actor.scope_var_locales_actual = {};

    actor.push_variables = function(ids) {
      this.scope_var_locales.push(ids);
      this.scope_var_locales_actual = ids;
    }

    actor.pop_variables = function() {
      this.scope_var_locales_actual = this.scope_var_locales.pop();
    }

    actor.set_variable = function(v, x) {
      actor.scope_var_locales_actual[v] = x;
    }

    actor.variable = function(n) {
      return this.scope_var_locales_actual[n];
    }
  }

  inyectar_atributos(actor) {
    actor.atributos_programa = {};

    actor.set_atributo = function(v, x) {
      actor.atributos_programa[v] = x;
    }

    actor.atributo = function(v) {
      return actor.atributos_programa[v];
    }
  }

  ejecutar(actor) {
    // obtiene el programa
    this.terminar_secuencia();
    var p = this.stack_secuencias.pop();
    // inyecta scopes para atributos, variables locales y parametros
    this.inyectar_scopes(actor);
    actor.hacer_luego(Programa, { programa: p });
  }

}

class Programa extends Comportamiento {

  programa;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.programa = this.argumentos.programa;
    this.programa.iniciar(this.receptor);
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
  RepetirN;
  ConstructorDePrograma;
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
    this.RepetirN = RepetirN;
    this.ConstructorDePrograma = ConstructorDePrograma;
    this.Programa = Programa;
  }
}
