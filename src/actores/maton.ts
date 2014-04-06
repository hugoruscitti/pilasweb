/// <reference path="actor.ts"/>

class Maton extends Actor {
  paso;
  cuadros;
  direccion;
  velocidad;
  animar;
  obstaculos; // TODO: eliminar luego, solo para tutorial.
  teclado_habilitado;

  constructor(x, y) {
    var imagen = pilas.imagenes.cargar_grilla("rpg/maton.png", 3*4, 1);
    super(imagen, x, y);
    this.paso = 0;
    this.aprender(pilas.habilidades.PuedeExplotar);
    this.cuadros = [[1,1,1,1,0,0,0,0,1,1,1,1,2,2,2,2],            // arriba
                    [4,4,4,4,3,3,3,3,4,4,4,4,5,5,5,5],            // derecha
                    [7,7,7,7,6,6,6,6,7,7,7,7,8,8,8,8],            // abajo
                    [10,10,10,10,9,9,9,9,10,10,10,10,11,11,11,11] // izquierda
                   ];
    this.direccion = 0;
    this.velocidad = 1;
    window['maton'] = this;
    this.animar = false;
    this._imagen.definir_cuadro(7);
    this.obstaculos = [];
    this.teclado_habilitado = false;
  }

  actualizar() {
    if (this.animar)
      this.avanzar_animacion();
  }

  iniciar_animacion() {
    this.animar = true;
  }


  detener_animacion() {
    this.animar = false;
    this.paso = 0;
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

    if (this.puede_moverse_a(this.x + x * this.velocidad, this.y))
      this.x += x * this.velocidad;

    if (this.puede_moverse_a(this.x, this.y + y * this.velocidad))
      this.y += y * this.velocidad;

    this.avanzar_animacion(); // TODO:
    this.z = this.y;
  }

  puede_moverse_a(x, y) {
    for (var i=0; i<this.obstaculos.length; i++) {
      if (this.obstaculos[i].colisiona_con_un_punto(x, y))
        return false;
    }

    return true;
  }

  caminar_arriba(pasos) {
    this.hacer(pilas.comportamientos.CaminaArriba, {pasos: pasos});
    return "caminando " + pasos + " pasos";
  }

  caminar_abajo(pasos) {
    this.hacer(pilas.comportamientos.CaminaAbajo, {pasos: pasos});
    return "caminando " + pasos + " pasos";
  }

  caminar_izquierda(pasos) {
    this.hacer(pilas.comportamientos.CaminaIzquierda, {pasos: pasos});
    return "caminando " + pasos + " pasos";
  }

  caminar_derecha(pasos) {
    this.hacer(pilas.comportamientos.CaminaDerecha, {pasos: pasos});
    return "caminando " + pasos + " pasos";
  }

  saludar() {
    this.decir("¡ Hola !");
    return "saludando ...";
  }

  habilitar_teclado() {
    if (this.teclado_habilitado === false) {
      this.aprender(pilas.habilidades.MoverseConElTeclado);
      this.teclado_habilitado = true;
      return "Habilitando el teclado";
    } else {
      return "El teclado ya estaba habilitado.";
    }
  }

  inspeccionar() {
    console.log("inspeccionando ...");

    return "Métodos del actor Maton: \n" +
    "\n" +
    "- saludar() \n" +
    "- caminar_arriba(pasos) \n" +
    "- caminar_abajo(pasos) \n" +
    "- caminar_izquierda(pasos) \n" +
    "- caminar_derecha(pasos) \n" +
    "- mover(x, y) \n" +
    "- habilitar_teclado() \n" +
    "";
  }

}
