/// <reference path="pilas.ts" />
/// <reference path="actores/texto.ts" />

/**
 * Representa el modo de lectura que utilizara pilas Web.
 * 
 * Este contiene una serie de transformaciones que se aplicaran
 * en diferentes aspectos visuales segun las necesidades del estudiante.
 */
abstract class ModoDeLectura {

    protected transformacionesDeTexto: TransformacionDeTexto[] = [];

    /**
     * Aplica todas las transformaciones a un texto dado.
     * 
     * @param texto el texto a transformar.
     */
    public adaptarTexto(texto: Texto): void {
        this.transformacionesDeTexto.forEach(transformacion => transformacion.aplicarA(texto));
    }

}

/**
 * Representa el modo de lectura normal de pilas web.
 */
class LecturaNormal extends ModoDeLectura {

}

/**
 * Representa el modo de lectura simple de pilas web,
 * en este modo, todo texto se mostrara capitalizado.
 * Es de gran utilidad para cuando se trabaja con niños o
 * con personas con visibilidad reducida.
 */
class LecturaSimple extends ModoDeLectura {

    constructor() {
        super();
        this.transformacionesDeTexto.push(new Capitalizar());
    }

}

/**
 * Representa una transformacion aplicable a cualquier texto.
 */
abstract class TransformacionDeTexto {

    /**
     * Aplica la transformacion a un texto dado.
     * @param texto el texto a transformar.
     */
    public abstract aplicarA(texto: Texto): void;

}

/**
 * Representa la transformacion que capitaliza texto.
 */
class Capitalizar extends TransformacionDeTexto {

    public aplicarA(texto: Texto): void {
        texto.setString(texto.getString().toUpperCase());
    }

}