/// <reference path="actor.ts"/>

class Maton extends Actor {
  paso;
  cuadros;
  direccion;
  velocidad;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("rpg/maton.png", 3, 4);
    super(imagen, x, y);
    this.centro_x = 36;
    this.centro_y = 31;
    this.paso = 0;
    this.aprender(pilas.habilidades.PuedeExplotar);
    this.cuadros = [[1,1,1,1,0,0,0,0,1,1,1,1,2,2,2,2],            // arriba
                    [4,4,4,4,3,3,3,3,4,4,4,4,5,5,5,5],            // derecha
                    [7,7,7,7,6,6,6,6,7,7,7,7,8,8,8,8],            // abajo
                    [10,10,10,10,9,9,9,9,10,10,10,10,11,11,11,11] // izquierda
                   ];
    this.direccion = 0;
    this.velocidad = 3;
    window['maton'] = this;
  }

  actualizar() {
    this.avanzar_animacion();
  }

  avanzar_animacion() {
    this.paso += 0.3;

    if (this.paso >= this.cuadros[this.direccion].length) {
      this.paso = 0;
    }
    
    var cuadro_a_mostrar = this.cuadros[this.direccion][parseInt(this.paso, 10)];

    this._imagen.definir_cuadro(cuadro_a_mostrar);
  }

  mover(x, y) {
    if (x < 0)
      this.direccion = 3;

    if (x > 0)
      this.direccion = 1;
    
    if (y > 0)
      this.direccion = 0;

    if (y < 0)
      this.direccion = 2;

    this.x += x * this.velocidad;
    this.y += y * this.velocidad;
  }

}
