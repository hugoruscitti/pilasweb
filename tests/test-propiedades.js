test('Puede cambiar propiedades de los actores', function(assert) {
  var done = assert.async();
  expect(3);

  pilas = new Pilas();
  pilas.iniciar({ancho: 320, alto: 240, data_path: '../public/data'});

  pilas.onready = function() {
      var aceituna = new pilas.actores.Aceituna();

      equal(aceituna.x, 0, "Cargó la posición inicial.");
      
      aceituna.x = [100];
      aceituna.rotacion = [-100];

      setTimeout(function() {
        equal(aceituna.x, 100, "A los dos segundos llegó la la posición 100.");
        equal(aceituna.rotacion, 360 - 100, "A los dos segundos cambió la rotación.");
        done();
      }, 2000);

  };

  pilas.ejecutar();
});
