/// <reference path="pilas.ts" />
/// <reference path="actores/texto.ts" />

/**
 * Representa el modo de lectura que utilizara Pilas Web.
 * 
 * Este adaptara el contenido visual de pilas dependiendo
 * de las necesidades de cada alumno.
 */
abstract class ModoDeLectura {

    /**
     * Aplica todas las adaptaciones pertinentes a un texto dado.
     * 
     * @param texto el texto a adaptar.
     */
    public abstract adaptarTexto(texto: Texto): void

}

/**
 * Representa el modo de lectura normal de Pilas Web.
 */
class LecturaNormal extends ModoDeLectura {

    public adaptarTexto(texto: Texto): void {

    }

}

/**
 * Representa el modo de lectura simple de Pilas Web,
 * en este modo, todo texto se mostrara capitalizado.
 * Es de gran utilidad para cuando se trabaja con niños o
 * con personas con visibilidad reducida.
 */
class LecturaSimple extends ModoDeLectura {

    public adaptarTexto(texto: Texto): void {
        texto.setString(texto.getString().toUpperCase());
    }

}