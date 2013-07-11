class Estudiante {
  _habilidades;

  constructor() {
    this._habilidades = [];
  }

  public aprender(clase_de_habilidad, opcional?) {
    // NOTA: aprender puede recibir un argumento opcional, 
    // si este argumento no se especifica, sera undefined

    this.agregar_habilidad(clase_de_habilidad, opcional);
  }

  public agregar_habilidad(clase_de_habilidad, opcional) {

    var habilidad = new clase_de_habilidad(this, opcional);
    this._habilidades.push(habilidad);
  }

  actualizar_habilidades() {

    for (var i in this._habilidades)
      this._habilidades[i].actualizar();
    
  }
}
