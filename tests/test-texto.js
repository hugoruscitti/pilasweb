test('Al instanciar un texto el mensaje se encuentra en modo normal', function(assert) {
  var mensaje = "Esto es un mensaje."
  var texto = new Texto(0, 0, mensaje)
  equal(texto.mensaje, mensaje)
})

test('Al poner modo de lectura simple, los mensajes se encuentran en mayúscula', function(assert) {
  var mensaje = "Esto es un mensaje."
  Texto.cambiarAModoDeLecturaSimple()
  var texto = new Texto(0, 0, mensaje)
  equal(texto.mensaje, mensaje.toUpperCase())
})
