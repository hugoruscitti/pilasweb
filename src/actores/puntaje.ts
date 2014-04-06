/// <reference path="actor.ts"/>
/// <reference path="texto.ts"/>

class Puntaje extends Texto {
  valor;

  constructor(x, y, puntaje, color) {
    this.valor = puntaje || 0;
    super(x, y, this.valor.toString(), color);
  }

  aumentar(aumento) {
    this.valor += aumento;
    this.texto = this.valor.toString();

    //Conservar la escala y el radio de colisión
    //TODO: es necesario mejorar el actor Texto
    var escala = this.escala;
    var radio_de_colision = this.radio_de_colision;

    this.eliminar_texto();
    this.crear_texto();
    this.escala = escala;
    this.radio_de_colision = radio_de_colision;
  }

  obtener() {
    return this.valor;
  }

}
