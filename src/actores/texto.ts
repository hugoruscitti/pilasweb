/// <reference path="actor.ts"/>
/// <reference path="../modo_de_lectura.ts"/>
/// <reference path="../pilas.ts"/>

class Texto extends Actor {
  private static modoDeLectura: ModoDeLectura;
  spriteCJS;
  mensaje;
  color;
  margen;

  constructor(x, y, mensaje, argumentos: any = {}) {
    super(argumentos.imagenFondo || "invisible.png", x, y);
    this.mensaje = mensaje || "Sin texto";
    this.color = argumentos.color || "black";
    this.margen = argumentos.margen || 0;
    this.crear_texto(argumentos.anchoMaximo || 200, argumentos.z);

    if (!argumentos.imagenFondo) {
      this.transparencia = 100;
    }
  }

  crear_texto(anchoMaximo, z) {
    this.spriteCJS = new createjs.Text(Texto.adaptarMensaje(this.mensaje), "14px sans-serif", this.color);
    this.setAnchoMaximo(anchoMaximo);
    this.setX(this.x);
    this.setY(this.y);

    if (z) {
      this.z = z;
      this.setZ(z);
    }

    this.spriteCJS.textBaseline = "top";
    this.spriteCJS.textAlign = "center";
    pilas.escena_actual().stage.addChild(this.spriteCJS);
  }

  eliminar_texto() {
    pilas.escena_actual().stage.removeChild(this.spriteCJS);
  }

  eliminar() {
    this.eliminar_texto();
    super.eliminar();
  }

  actualizarMedidas() {
    this.alto = this.spriteCJS.getBounds().height + (this.margen * 2);
    this.ancho = this.spriteCJS.getBounds().width + (this.margen * 2);
  }

  anchoString() {
    return this.ancho - (this.margen * 2);
  }

  altoString() {
    return this.alto - (this.margen * 2);
  }

  setAnchoMaximo(anchoMax) {
    this.spriteCJS.lineWidth = anchoMax - (this.margen * 2);
    this.actualizarMedidas();
  }

  setX(x) {
    super.setX(x);
    this.spriteCJS.x = pilas.escena_actual().obtener_posicion_pantalla(x, this.y).x;
  }

  setY(y) {
    super.setY(y);
    this.spriteCJS.y = pilas.escena_actual().obtener_posicion_pantalla(this.x, y + (this.altoString() / 2)).y;
  }

  setZ(z) {
    super.setZ(z);
    this.spriteCJS.z = z - 1;
  }

  cantidadDeLineas() {
    return this.altoString() / this.spriteCJS.getMeasuredLineHeight();
  }

  setMensaje(mensaje: String): void {
    this.mensaje = Texto.adaptarMensaje(mensaje);
    this.spriteCJS.text = mensaje;
    this.actualizarMedidas();
  }

  getMensaje(): String {
    return this.mensaje;
  }

  public static cambiarAModoDeLecturaNormal(): void {
    Texto.modoDeLectura = new LecturaNormal();
  }

  public static cambiarAModoDeLecturaSimple(): void {
    Texto.modoDeLectura = new LecturaSimple();
  }

  private static adaptarMensaje(mensaje: String): String {
    return Texto.modoDeLectura.adaptarMensaje(mensaje);
  }

}
