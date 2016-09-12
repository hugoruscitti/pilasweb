// Referencia: https://github.com/hugoruscitti/pilasweb/issues/146

test('Puede serializar escena y restaurar estado', function(assert) {
  var done = assert.async();

  pilas = new Pilas();
  pilas.iniciar({ancho: 320, alto: 240, data_path: '../dist/data'});

  pilas.onready = function() {

    // Se asegura de probar el estado inicial.
    var ids = pilas.obtener_ids();
    assert.equal(1, ids && ids.length, "Al comenzar tiene que haber un solo objeto serializados, el fondo.");

    var aceituna = new pilas.actores.Aceituna();

    // y luego de crear un actor ...
    var ids = pilas.obtener_ids();
    assert.equal(2, ids && ids.length, "En la escena tiene que haber dos objetos serializados.");

    // también podría obtener la lista de actores.
    var actores = pilas.obtener_actores();
    assert.equal(2, ids && actores.length, "Y obtener actores también lista dos objetos.");

    // se puede obtener actores por id
    assert.equal(actores[0], pilas.obtener_actor_por_id(actores[0].id), "La lista de actores y la búsqueda retornan lo mismo (para el id 0).");
    assert.equal(actores[1], pilas.obtener_actor_por_id(actores[1].id), "La lista de actores y la búsqueda retornan lo mismo (para el id 1).");


    // Luego de capturar la escena ...
    var data = pilas.obtener_escena_serializada();

    // puede crear varios actores ...
    var a1 = new pilas.actores.Aceituna();
    var a2 = new pilas.actores.Aceituna();
    var a3 = new pilas.actores.Aceituna();

    // que se obtendrán en la lista ...
    var ids = pilas.obtener_ids();
    assert.equal(5, ids && ids.length, "Se obtienen los 2 actores iniciales más 3.");



    // Pero luego de reiniciar la escena, vuelven a existir 2 actores nada más.
    pilas.definir_escena_serializada(data);
    var ids = pilas.obtener_ids();
    assert.equal(2, ids && ids.length, "Luego de restaurar la escena, vuelven a haber 2 actores.");


    done();
  };

  pilas.ejecutar();
});
