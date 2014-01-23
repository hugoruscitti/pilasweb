class Interpolaciones {

  interpolar(objeto, atributo, valor_o_valores, tiempo, tipo) {
    var tiempo:any = tiempo*1000 || 1000;
    var step = tiempo / valor_o_valores.length;
    var tipo = tipo ||  createjs.Ease.none
    var tween = createjs.Tween.get(objeto);
      
    for (var i=0; i<valor_o_valores.length; i++) {
      var attr = atributo.toString();
      var diccionario = {};
      diccionario[attr] = valor_o_valores[i];
      tween = tween.to(diccionario, step, tipo)
    }
  }

  AceleracionGradual(objeto, atributo, valor_o_valores, tiempo) {
    return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.cubicin)
  }

  DesaceleracionGradual(objeto, atributo, valor_o_valores, tiempo) {
    return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.cubicOut)
  }

  ReboteInicial(objeto, atributo, valor_o_valores, tiempo) {
    return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.bounceIn)
  }

  ReboteFinal(objeto, atributo, valor_o_valores, tiempo) {
    return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.bounceOut)
  }

  ElasticoInicial(objeto, atributo, valor_o_valores, tiempo) {
    return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.elasticIn)
  }

  ElasticoFinal(objeto, atributo, valor_o_valores, tiempo) {
    return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.elasticOut)
  }
}
