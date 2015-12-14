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

  constructor(actor, mensaje, anchoMaximo=150) {
    super("balloon.png", 0, 0);
    this.mensaje = mensaje;
    this.actor = actor;
    this.margen = 10;
    this.anchoMaximo = anchoMaximo;
    this.nombreImagen = "balloon.png";

    this.crearTexto(0,0,9999); //Hardcodeo por necesidad de usar datos del texto
    super(this.nombreImagen, this.calcularX(), this.calcularY());
    this.crearTexto(this.x, this.y, this.z + 1); //Creo el texto de posta
    this.actualizarMedidas();
    this.ponerPuntita();
    this.z = -5000;

    pilas.mundo.agregar_tarea_una_vez(this.duracion(), this.eliminar, {}, this);
  }

  duracion(){
    return this.actor_texto.cantidadDeLineas()*3;
  }

  eliminar() {
    this.actor_texto.eliminar();
    this.puntita.eliminar();
    super.eliminar();
  }

  crearTexto(x,y,z){
    if (this.actor_texto) this.actor_texto.eliminar();
    this.actor_texto = new pilas.actores.Texto(x, y, this.mensaje, this.anchoMaximo);
    this.actor_texto.z = z;
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
    this.puntita.z = this.z - 1;
  }

  ponerPuntitaAIzquierda(){
    this.puntita = new Actor(this.imagenPuntita().izquierda, 
    this.izquierda + this.margen - (this.dimPuntita().ancho / 2),
    this.abajo + (this.dimPuntita().alto / 2));
  }

  ponerPuntitaADerecha(){
    this.puntita = new Actor(this.imagenPuntita().derecha,
      this.derecha - this.margen + (this.dimPuntita().ancho / 2),
      this.abajo + (this.dimPuntita().alto / 2)); 
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