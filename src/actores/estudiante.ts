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

  public agregar_habilidad(habilidad_o_clase, argumentos) {
    this.olvidar(habilidad_o_clase);
    this.habilidades.push(this.getHabilidad(habilidad_o_clase, argumentos));
  }

  public olvidar(habilidad_o_clase) {
    for (var i = 0; i < this.habilidades.length; i++) {
      if (this.habilidades[i] == habilidad_o_clase || 
        (this.isClass(habilidad_o_clase) && this.habilidades[i] instanceof habilidad_o_clase)) {
          this.habilidades.splice(i, 1);
          break;
      }
    }
  }

  getHabilidad(objetoOClase, argumentos){
    if (!this.isClass(objetoOClase)) return objetoOClase;
    if (!argumentos) return new objetoOClase(this);
    return new objetoOClase(this, argumentos);
  }

  isClass(objeto){
    return this.getClassName(objeto) == "" || this.getClassName(objeto) == "Function";
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

  public getClassName(obj = this) {
    var funcNameRegex = /function (.{1,})\(/;
      var results = (funcNameRegex).exec(obj["constructor"].toString());
      return (results && results.length > 1) ? results[1] : "";
  }
}
