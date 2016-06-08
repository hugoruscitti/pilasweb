/// <reference path="actor.ts"/>
/// <reference path="texto.ts"/>

class Puntaje extends Texto {
  valor;

  constructor(x, y, puntaje, argumentos) {
    this.valor = puntaje || 0;
    super(x, y, this.valor.toString(), argumentos);
  }

  aumentar(aumento) {
    this.valor += aumento;
    this.setString(this.valor.toString());
  }

  obtener() {
    return this.valor;
  }

}
