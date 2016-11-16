test('Conexion emision y desconexion de mensajes', function(assert) {
  var done = assert.async();
  expect(2);

  pilas = new Pilas();
  pilas.iniciar({ancho: 320, alto: 240, data_path: '../dist/data'});

  pilas.onready = function() {
      var aceituna = new pilas.actores.Aceituna();
      var t = 0;
      aceituna.conectar_al_mensaje('Sumar', function () {
        t++;
      });
      aceituna.emitir_mensaje('Sumar');
      equal(t, 1, "Se conecto y recibio mensaje con exito");
      aceituna.desconectar_mensajes();
      aceituna.emitir_mensaje('Sumar');
      equal(t, 1, "Se desconecto y no recibio mensaje");

      done();

  };

  pilas.ejecutar();
});
