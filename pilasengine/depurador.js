define(['mootools', 'singleton'], function(){

  /**
   * Representa uno de los posibles modos del depurador.
   */
  var ModoDepurador = new Class({

    initialize: function(depurador){
      this.depurador = depurador;
      this.g = depurador.g;
      this.pilas = depurador.pilas;
    },

    /**
     * Se invoca en cada dibujado de actor.
     */
    dibuja_al_actor: function(actor){
    },
    
    /**
     * Se invoca cuando comienza el ciclo de actualización
     * de los actores.
     */
    comienza_dibujado: function() {
    },

    /**
     * Se invoca justo antes de terminar de dibujar toda la escena.
     */
    termina_dibujado: function() {
    },

  });

  /**
   * @extends ModoDepurador
   *
   * Muestra el punto de control o centro de cada uno de los actores.
   */
  var ModoPuntoDeControl = new Class({
    Extends: ModoDepurador,

    dibuja_al_actor: function(actor){
      var posicion = this.pilas.camara.obtener_posicion();
      this.dibujar_cruz(this.g, posicion.x + actor.x, posicion.y - actor.y);
    },

    /**
     * @private
     */
    dibujar_cruz: function(g, x, y) {
      this.g.setStrokeStyle(1);
      this.g.beginStroke(Graphics.getRGB(255,0,0));

      g.moveTo(x-3, y-3);
      g.lineTo(x+3, y+3);

      g.moveTo(x+3, y-3);
      g.lineTo(x-3, y+3);
    }
  });

  /**
   * @extends ModoDepurador
   *
   * Muestra el punto de control o centro de cada uno de los actores.
   */
  var ModoFisica = new Class({
    Extends: ModoDepurador,

    comienza_dibujado: function() {
      var debugDraw = new Box2D.Dynamics.b2DebugDraw();
      var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
      debugDraw.SetSprite(this.pilas.contexto);
      debugDraw.SetDrawScale(1.0);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      this.pilas.fisica.mundo.SetDebugDraw(debugDraw);
      this.pilas.fisica.mundo.DrawDebugData();
    }

  });

  /**
   * Permite generar graficos auxiliales sobre el canvas para depurar.
   */
  var Depurador = new Class({

    /**
     * inicializa el depurador geneal.
     *
     * Este depurador tiene una lista de modos, cada modo tiene
     * la oportunidad de dibujar en escena en cualquiera de todos
     * estos momentos:
     *
     *  - cuando comienza el dibujado de pantalla.
     *  - cuando se dibuja un actor.
     *  - cuando termina el proceso de dibujado.
     *
     * El atributo 'g' representa un canvas intermedio, en
     * donde los modos de depuración pueden dibujar.
     */
    initialize: function(pilas){
      this.pilas = pilas;
      this.g = new Graphics();
      this.modos = [];
    },

    definir_modos: function(opciones) {
      this.modos = [];

      if (opciones.depuracion)
          this.modos.push(new ModoPuntoDeControl(this));

      if (opciones.fisica)
          this.modos.push(new ModoFisica(this));
    },

    comienza_dibujado: function(){
      this.g.clear();

      for (i=0; i<this.modos.length; i++)
          this.modos[i].comienza_dibujado();
    },

    dibuja_al_actor: function(actor){
      for (i=0; i<this.modos.length; i++)
          this.modos[i].dibuja_al_actor(actor);
    },

    termina_dibujado: function(){
      for (i=0; i<this.modos.length; i++)
          this.modos[i].termina_dibujado();

      this.g.draw(this.pilas.contexto);
    }
  });

  return {
    Depurador: Depurador
  };
});
