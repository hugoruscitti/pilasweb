test('Puede acceder al DOM', function() {
  expect(1);
  var fixture = document.getElementById('qunit-fixture');
  equal(fixture.innerText, 'Contenido de prueba.', 'Puede encontrar la frase de prueba en el DOM.');
});
