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



        mocha.run();
    });
});
