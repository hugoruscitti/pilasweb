define([], function() {

  /**
   * Permite tratar a los strings como templates para interpolar.
   *
   * Esta función se auto-ejecuta, y sirve para que todos los strings
   * tenga un método llamado 'format' que funciona muy similar al
   * metodo format de python.
   *
   * Básicamente, si tenemos una cadena de texto tipo plantilla podemos
   * darle un diccionario para generar la cadena compuesta:
   *
   *     >> "hola {persona} !!!".format({persona: 'pepe'});
   *     "hola pepe !!!"
   *
   * Esta función es parte de los remedials javascript de Douglas Crockford,
   * pero ahí se llama supplant:
   *
   *     http://javascript.crockford.com/remedial.html
   *
   */
  String.prototype.format = function (o) {
      return this.replace(/{([^{}]*)}/g,
          function (a, b) {
              var r = o[b];
              return typeof r === 'string' || typeof r === 'number' ? r : a;
          }
      );
  }

  /**
   * Se asegura de que el el valor enviado exista.
   *
   * Esta funcion es útil para utilizar junto a parámetros
   * obligatorios y notificar errores.
   */
  function required(name, value) {
    if (value === undefined)
      throw new Error("Argumento '{name}' sin definir.".format({name: name}));
  }

  /**
   * Retorna un numero aleatorio entre 'min' y 'max'.
   */
  function randint(min, max) {
    return Math.floor(Math.random() * ((max+1) - min) + min);
  }
   
});
