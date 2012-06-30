require(['require', './mocha.js'], function(require){
    mocha.setup('bdd');

    require(['main'], function(pilasengine){
        console.log("module: ", pilasengine);

        it("inicializa correctamente", function() {
            var pilas = new pilasengine.Pilas('canvas');
            console.log(pilas.utils.sumar(1, 2))
        });

        it("falla si no encuenta en canvas", function() {
            var pilas = new pilasengine.Pilas('id_de_un_canvas_que_no_existe');
        })

        it("puede tratar como un singleton", function() {
            var pilas = new pilasengine.Pilas('id_de_un_canvas_que_no_existe');

            var misma_instancia = pilas.obtener_instancia();
            var otra_misma_instancia = pilas.obtener_instancia();

            console.log(misma_instancia)
            console.log(otra_misma_instancia)
        })



        mocha.run();
    });
});
