class Estudiante {
  habilidades;
  comportamientos;
  comportamiento_actual;

  constructor() {
    this.habilidades = [];
    this.comportamientos = [];
  }

  public aprender(clase_de_habilidad, argumentos=undefined) {
    this.agregar_habilidad(clase_de_habilidad, argumentos);
    return "Enseñando una habilidad ...";
  }

  public agregar_habilidad(clase_de_habilidad, argumentos) {
    for (var i=0; i<this.habilidades.length;i++) {
      if (this.habilidades[i] instanceof clase_de_habilidad){
        this.habilidades.splice(i, 1)
        break;
      }
    }

    if(argumentos==undefined) {
      var habilidad = new clase_de_habilidad(this);
    }
    else {
      var habilidad = new clase_de_habilidad(this, argumentos);
    }

    // TODO permitir que se puedan enviar habiliades ya instanciadas.
    this.habilidades.push(habilidad);
  }

  actualizar_habilidades() {
    for (var i=0;i<this.habilidades.length;i++) {
      this.habilidades[i].actualizar()
    }
  }

  hacer(comportamiento, argumentos={}) {
    var _comportamiento = new comportamiento(argumentos);
    this.comportamientos.splice(0, 0, _comportamiento);
    this._adoptar_el_siguiente_comportamiento();
  }

  hacer_luego(comportamiento, argumentos={}) {
    var _comportamiento = new comportamiento(argumentos);
    this.comportamientos.push(_comportamiento);
  }

  actualizar_comportamientos() {
    if(this.comportamiento_actual) {
      var termina = this.comportamiento_actual[0]["actualizar"]();

      if (termina) {
        this._adoptar_el_siguiente_comportamiento();
      }
    }
    else {
      this._adoptar_el_siguiente_comportamiento();
    }
  }

  _adoptar_el_siguiente_comportamiento() {
    if (this.comportamientos[0]) {
      this.comportamiento_actual = this.comportamientos.splice(0,1);
      //console.log(this.comportamiento_actual);
      this.comportamiento_actual[0]["iniciar"](this);
    }
    else {
      this.comportamiento_actual = undefined;
    }
  }
}
