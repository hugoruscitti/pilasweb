/// <reference path="actor.ts"/>

class Globo extends Actor {
  mensaje;
  actor_texto;
  actor;
  puntita;
  margen;

  constructor(actor, mensaje) {
    super("balloon.png", 0, 0);
    this.mensaje = mensaje;
    this.actor = actor;
    this.margen = 10;

    this.crearTexto();
    this.actualizarMedidas();
    this.ubicar();
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

  crearTexto(){
    this.actor_texto = new pilas.actores.Texto(0, 0, this.mensaje);
    this.actor_texto.z = this.z - 1;
  }

  actualizarMedidas(){
    this.ancho = this.actor_texto.ancho + (this.margen*2);
    this.alto = Math.max(this.actor_texto.alto + (this.margen*2),35); //Alto minimo
  }

  ubicar(){
    this.ubicarEnY();
    this.ubicarEnX();
    this.actor_texto.reubicar(this.x, this.y);
  }

  ubicarEnY(){
    this.abajo = this.actor.y + (this.actor.alto / 4); // Me ubico a 75% del alto
    this.arriba = Math.min(this.arriba, pilas.arriba()); // Me aseguro de estar en pantalla
    this.abajo = Math.max(this.abajo, pilas.abajo());
  }

  ubicarEnX() {
    if (this.actor.derecha + this.ancho < pilas.derecha()){
      this.ubicarADerechaDelActor();
    } else {
      this.ubicarAIzquierdaDelActor();
    }
  }
  ubicarADerechaDelActor(){
    this.izquierda = this.actor.derecha;
    this.puntita = new Actor("balloon-tip-left.png",0,0);
    this.puntita.derecha = this.izquierda + this.margen;
    this.puntita.abajo = this.abajo;
    this.puntita.z = this.z;
  }

  ubicarAIzquierdaDelActor(){
    this.derecha = this.actor.izquierda;
    this.puntita = new Actor("balloon-tip-right.png",0,0);
    this.puntita.abajo = this.abajo;
    this.puntita.izquierda = this.derecha - this.margen;
    this.puntita.z = this.z;
  }

}
