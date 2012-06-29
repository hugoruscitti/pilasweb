require(['require', './mocha.js'], function(require){
    mocha.setup('bdd');

    require(['main'], function(pilasengine){
        console.log("module: ", pilasengine);

        it("inicializa correctamente", function() {
            var pilas = new pilasengine.Pilas();
            console.log(pilas.utils.sumar(1, 2))
        });

        it("detecta que existe el atributo actores", function() {
            var pilas = new pilasengine.Pilas();
            (2 +2).should.equal(3)
        })



        mocha.run();
    });
});
