/// <reference path="actor.ts"/>

class Piedra extends Actor {
  dx;
  dy;

  constructor(x, y, tamano, dx, dy) {
    this.dx = dx || 0;
    this.dy = dy || 0;

    var tamano = tamano || "grande";
    var imagen = "piedra_" + tamano + ".png";

    super(imagen, x, y);

    switch (tamano) {
        case 'chica':
          this.radio_de_colision = 10;
          break;

        case 'media':
          this.radio_de_colision = 15;
          break;

        case 'grande':
          this.radio_de_colision = 20;
          break;

        default:
          throw "El tamaño " + tamano + "no está permitido. Use 'chica', 'media' o 'grande'."
          break;
    }

  this.rotacion = 0;
    this.aprender(pilas.habilidades.SeMantieneEnPantalla);
    this.aprender(pilas.habilidades.PuedeExplotar);
  }

  actualizar() {
    this.x += this.dx;
    this.y += this.dy;
    this.rotacion += 1;
  }

  empujar(dx, dy)  {
    dx = dx || 0;
    dy = dy || 0;

    this.dx = dx / 10;
    this.dy = dy / 10;
    return "Empujando al actor";
  }

  clonar(veces) {
    veces = veces || 0;
    veces = Math.min(veces, 5);

    for (var i=0; i<veces; i++) {
      var dx = (Math.random() * 2) -1;
      var dy = (Math.random() * 2) -1;
      var tamano = this.obtener_tamano_al_azar();

      var tmp = new Piedra(this.x, this.y, tamano, 0, 0);
      tmp.empujar(dx, dy);

      if (window['enemigos'] === undefined) {
        window['enemigos'] = [this];
      }

      window['enemigos'].push(tmp);
    }

    return "Clonando el actor piedra.";
  }

  obtener_tamano_al_azar() {
    var valores = ['chica', 'media', 'grande'];
    var max = 2;
    var min = 0;
    var indice = Math.floor((Math.random() * ((max + 1) - min)) + min);

    return valores[indice];
  }

}

