###
 -*- encoding: utf-8 -*-
 pilasweb engine - a video game framework.

 copyright 2013 - Hugo Ruscitti, Sergio Lindo <sergiolindo.empresa at gmail.com>
 license: lgplv3 (see http://www.gnu.org/licenses/lgpl.html)

 website - http://hugoruscitti.github.com/pilasweb
###
define ->
##  /**
##   * @class utils
##   * Contiene funciones o métodos que no se clasifican dentro de la librería pilas, pero son útiles. Como por ejemplo añadir funcionalidad de python.
##   */

##  /**
##   * @method format
##   * Permite tratar a los strings como templates para interpolar.
##   *
##   * Esta función se auto-ejecuta, y sirve para que todos los strings
##   * tenga un método llamado 'format' que funciona muy similar al
##   * metodo format de python.
##   *
##   * Básicamente, si tenemos una cadena de texto tipo plantilla podemos
##   * darle un diccionario para generar la cadena compuesta:
##   *
##   *     >> "hola {persona} !!!".format({persona: 'pepe'});
##   *     "hola pepe !!!"
##   *
##   * Esta función es parte de los remedials javascript de Douglas Crockford,
##   * pero ahí se llama supplant:
##   *
##   *     http://javascript.crockford.com/remedial.html
##   *
##   * @param {String} o El string que sobre el que se quiere interpolar.
##   */
    String.prototype.format = (o)->
        return @replace /{([^{}]*)}/g,
         (a, b)->
            r = o[b]
            return if typeof r is 'string' || typeof r is 'number' then r else a
##  /**
##   * @method required
##   * Se asegura de que el el valor enviado exista.
##   *
##   * Esta funcion es útil para utilizar junto a parámetros
##   * obligatorios y notificar errores.
##   *
##   * @param {String} name TO DO descripción.
##   * @param {Mixed} value TO DO descripción.
##   */
    required = (name, value)->
        if value is undefined
            throw new Error "Argumento '{name}' sin definir.".format {name: name}
        `void 0`
##  /**
##   * @method randint
##   * Retorna un numero aleatorio entre 'min' y 'max'.
##   *
##   * @param {Number} min El número aleatorio debe ser mayor o igual que min.
##   * @param {Number} max El número aleatorio debe ser menor o igual que max.
##   */
    randint = (min, max)->
        return Math.floor Math.random() * ((max+1) - min) + min

    `void 0`