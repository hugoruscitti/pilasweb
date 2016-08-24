module('Globo y Texto');

test('El texto pilas y el texto createJS tienen igual posicion', function(assert) {
  var done = assert.async();
  expect(4);

  pilas = new Pilas();
  pilas.iniciar({ancho: 320, alto: 240, data_path: '../dist/data'});


  pilas.onready = function() {
      var testo = new Texto(34,43,"hola!");

      equal(testo.sprite.x, testo.spriteCJS.x, "La x coincide en los sprites");
      // Ver #Texto>>reubicar para pensar un poco por qué este test falla
      equal(testo.sprite.y, testo.spriteCJS.y, "La y coincide en los sprites");

      var posicionTextoCJS = pilas.escena_actual().obtener_posicion_escenario(testo.spriteCJS.x,testo.spriteCJS.y)
      equal(testo.x, posicionTextoCJS.x, "La x coincide entre el actor y el texto CJS");
      equal(testo.y, posicionTextoCJS.y, "La y coincide entre el actor y el texto CJS");

      done();
  };

  pilas.ejecutar();

});

test('El globo y su texto tienen misma posición', function(assert) {
  var done = assert.async();
  expect(4);

  pilas = new Pilas();
  pilas.iniciar({ancho: 320, alto: 240, data_path: '../dist/data'});

  pilas.onready = function() {
      var bomba = new pilas.actores.Bomba(34,43);
      var globo = new Globo(bomba,"Lorem ipsum dolor sit amet asdf asdffl lla ala a!");

      equal(globo.x, globo.actor_texto.x, "La x coincide");
      equal(globo.y, globo.actor_texto.y, "La y coincide");

      equal(globo.sprite.x, globo.actor_texto.spriteCJS.x, "La x coincide entre sprites");
      equal(globo.sprite.y, globo.actor_texto.spriteCJS.y, "La y coincide entre sprites");

      done();
  };

  pilas.ejecutar();

});
