describe("Inicializar", function(){
  it("Inicializa correctamente", function() {
    pilas.should.be.ok;
  });

  it("Tiene que ser un número y no una cadena", function() {
    var numero = 123;
    numero.should.be.ok;
  });

  it("Tiene que dar error si no está el canvas", function() {
    pilas = new Pilas();
  }).should.throw(Error);

});

