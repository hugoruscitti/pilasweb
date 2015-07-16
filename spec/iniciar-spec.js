var textos = require('../public/pilasweb.js');

describe("Tiene que poder imprimir textos", function() {

  it("puede acceder a la función para imprimir ayuda.", function(){
      expect(textos.imprimirAyuda).not.toBe(undefined);
    });

  it("puede acceder a la función para imprimir la introducción.", function(){
      expect(textos.imprimirIntro).not.toBe(undefined);
    });

  it("Las funciones retornan textos indicando que funcionan", function() {
      expect(textos.imprimirIntro(true)).not.toBe(undefined);
      expect(textos.imprimirAyuda(true)).not.toBe(undefined);
    });

});
