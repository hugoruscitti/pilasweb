test('Puede inicializar y crear actores', function(assert) {
  var done = assert.async();
  expect(2);

  pilas = new Pilas();
  pilas.iniciar({ancho: 320, alto: 240, data_path: '../public/data'});

  pilas.onready = function() {
      var fondo = new pilas.fondos.Plano();
      var bomba = new pilas.actores.Bomba();

      equal(bomba.x, 0, "La bomba está en la posición inicial");
      equal(bomba.y, 0, "La bomba está en la posición inicial");
      done();
  };

  pilas.ejecutar();
});
