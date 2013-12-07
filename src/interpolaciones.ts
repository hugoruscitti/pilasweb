class Interpolaciones {

  interpolar(objeto, atributo, valor_o_valores, tiempo) {
    var tiempo = tiempo*1000 || 1000;
    var step = tiempo / valor_o_valores.length;
    var tween = createjs.Tween.get(objeto);
      
    for (var i=0; i<valor_o_valores.length; i++) {
      var attr = atributo.toString();
      var diccionario = {};
      diccionario[attr] = valor_o_valores[i];
      tween = tween.to(diccionario, step)
    }
  }
}
