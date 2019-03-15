/// <reference path="actor.ts"/>
/// <reference path="../pilas.ts"/>

class Globo extends Actor {
  mensaje;
  actor_texto;
  actor;
  puntita;
  margen;
  nombreImagen;
  anchoMaximo;

  constructor(actor, mensaje, argumentos:{eliminarPrevio?: boolean, autoEliminar?: boolean, anchoMaximo?: number}={}) {
    super("balloon.png", 0, 0);
    this.mensaje = mensaje;
    this.actor = actor;
    this.margen = 10;
    this.anchoMaximo = argumentos.anchoMaximo || 150;
    this.nombreImagen = "balloon.png";

    argumentos.eliminarPrevio = argumentos.eliminarPrevio !== false; // por defecto true.
    argumentos.autoEliminar = argumentos.autoEliminar !== false; // por defecto true.

    this.crearTexto(0, 0, 9999); //Hardcodeo por necesidad de usar datos del texto
    super(this.nombreImagen, this.calcularX(), this.calcularY(), {z: -5000});
    this.crearTexto(this.x, this.y, -5001);
    this.actualizarMedidas();
    this.ponerPuntita();
    this.agregar_habilidad(ImitarPosicion, { objeto_a_imitar: this.actor });

    if (argumentos.eliminarPrevio && this.actor.globoActual) this.actor.globoActual.eliminar();
    this.actor.globoActual = this;

    if(argumentos.autoEliminar) {
      pilas.mundo.agregar_tarea_una_vez(this.duracion(), this.eliminar, {}, this);
    }
  }

  duracion() {
    return this.actor_texto.cantidadDeLineas() * 3;
  }

  eliminar() {
    if (!this.vivo) {
      return;
    }

    this.actor_texto.eliminar();
    this.puntita.eliminar();
    super.eliminar();
  }

  crearTexto(x,y,z){
    if (this.actor_texto) {
      this.actor_texto.eliminar();
    }

    this.actor_texto = new Texto(x, y, this.mensaje, { z: z, anchoMaximo: this.anchoMaximo });
    this.actor_texto.agregar_habilidad(ImitarPosicion, { objeto_a_imitar: this });
    pilas.modoDeLectura().adaptarTexto(this.actor_texto);
  }

  actualizarMedidas(){
    this.ancho = this.actor_texto.ancho + (this.margen*2);
    this.alto = Math.max(this.actor_texto.alto + (this.margen*2),35); //Alto minimo
  }

  calcularY(){
    var yIdeal = this.actor.y + (this.actor.alto / 4) + (this.actor_texto.alto / 2); // Me ubico a 75% del alto
    yIdeal = Math.min(yIdeal, pilas.arriba() - (this.actor_texto.alto / 2));
    yIdeal = Math.max(yIdeal, pilas.abajo() + (this.actor_texto.alto / 2));

    return yIdeal;
  }

  calcularX() {
    var xIdeal;
    if (this.voyAIzquierda()) {
      xIdeal = this.xADerechaDelActor();
    } else {
      xIdeal = this.xAIzquierdaDelActor();
    }
    xIdeal = Math.min(xIdeal, pilas.derecha() - (this.actor_texto.ancho / 2));
    xIdeal = Math.max(xIdeal, pilas.izquierda() + (this.actor_texto.ancho / 2));

    return xIdeal;
  }

  xADerechaDelActor(){
    return this.actor.derecha + this.dimPuntita().ancho + (this.actor_texto.ancho / 2);
  }

  xAIzquierdaDelActor(){
    return this.actor.izquierda - this.dimPuntita().ancho - (this.actor_texto.ancho / 2);
  }

  ponerPuntita(){
    if (this.voyAIzquierda()) {
      this.ponerPuntitaAIzquierda();
    } else {
      this.ponerPuntitaADerecha();
    }

    this.puntita.agregar_habilidad(ImitarPosicion,{objeto_a_imitar: this});
  }

  ponerPuntitaAIzquierda() {
    let imagen = this.imagenPuntita().izquierda;
    let x = this.izquierda + this.margen - (this.dimPuntita().ancho / 2);
    let y = this.abajo + (this.dimPuntita().alto / 2);

    this.puntita = new Actor(imagen, x, y, {z: -5001});
  }

  ponerPuntitaADerecha(){
    let imagen = this.imagenPuntita().derecha;
    let x = this.derecha - this.margen + (this.dimPuntita().ancho / 2);
    let y = this.abajo + (this.dimPuntita().alto / 2);

    this.puntita = new Actor(imagen, x, y, {z: -5001});
  }

  voyAIzquierda(){
     return this.actor.derecha + this.dimPuntita().ancho + this.anchoMaximo < pilas.derecha();
  }

  imagenPuntita() {
      return { izquierda: "balloon-tip-left.png",
               derecha: "balloon-tip-right.png" };
  }

  dimPuntita(){
    return { ancho: 30, alto: 34 }  //TODO: tiene que haber mejor forma
  }
}

class GloboPensar extends Globo{
  imagenPuntita(){
    return { izquierda: "balloon-tip-think-left.png",
             derecha: "balloon-tip-think-right.png" };
  }
}
