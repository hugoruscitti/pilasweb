require(['require', './chai.js', './mocha.js'], function(require, _chai,_mocha){
    mocha.setup('bdd');
    expect = _chai.expect;
    should = _chai.should();



    require(['main'], function(pilaswebengine){
        console.log("module: ", pilaswebengine);

        describe("Inicializar", function(){

            it("Inicializa correctamente", function() {
                var pilas = new pilaswebengine.Pilas('canvas');
                pilas.should.be.ok;
            });

            it("Falla si no encuenta en canvas", function() {
                (function() {
                    var pilas = new pilaswebengine.Pilas('id_de_un_canvas_que_no_existe');
                }).should.throw(Error);

            });

            it("Puede tratar como un singleton", function() {
                var pilas = new pilaswebengine.Pilas('canvas');

                var misma_instancia = pilas.obtener_instancia();
                var otra_misma_instancia = pilas.obtener_instancia();

                misma_instancia.should.be.equal(otra_misma_instancia);
            });

        });


        describe("Actores", function(){
            it("Crear un actor", function() {
                var pilas = new pilaswebengine.Pilas('canvas', '../pilaswebengine/data/');
                var actor = new pilas.actores.Actor();

                actor.should.to.be.ok;
            });
        });

        mocha.run();
    });
});
