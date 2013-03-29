###
 -*- encoding: utf-8 -*-
 pilasweb engine - a video game framework.

 copyright 2013 - Hugo Ruscitti, Sergio Lindo <sergiolindo.empresa at gmail.com>
 license: lgplv3 (see http://www.gnu.org/licenses/lgpl.html)

 website - http://hugoruscitti.github.com/pilasweb
###
define ['actores/actor', 'actores/aceituna', 'actores/cooperativista', 'imagenes', 'depurador', 'fisica'],
 (Actor, Aceituna, Cooperativista, Imagenes, Depurador, Fisica)->
##  /**
##   * @class Pilas
##   * @singleton
##   * Módulo pilas
##   * ============
##   *
##   * Pilas es una biblioteca para facilitar el desarrollo de videojuegos. Es útil para programadores principiantes o para el desarrollo de juegos casuales.
##   *
##   * Este módulo contiene las funciones principales para iniciar y ejecutar la biblioteca.
##   */
    class Pilas
##      /**
##       * Constructor de la clase Pilas.
##       * @constructor
##       */
        constructor: ->
            @lista_actores = []
            @actores =
                Actor: Actor
                Aceituna: Aceituna
                Cooperativista: Cooperativista
##      /**
##       * @method actualizar
##       * Actualiza la lógica y los gráficos del juego.
##       * Es ejecutado en el bucle_principal.
##       */
        actualizar: ->
            @_limpiar_pantalla @canvas_element.context
            @depurador.comienza_dibujado @canvas_element.context

            for actor in @lista_actores
                actor.actualizar()
                actor.dibujar @canvas_element.context

                @depurador.dibuja_al_actor @canvas_element.context, actor

            @depurador.termina_dibujado @canvas_element.context
            `void 0`
##      /**
##       * @method agregar
##       * Agrega un actor a la lista de actores activos.
##       * @param {Object} objeto Actor que se quiere agregar.
##       */
        agregar: (objeto)->
            @lista_actores.push objeto
            `void 0`
##      /**
##       * @method bucle_principal
##       * Arranca el bucle principal del juego.
##       */
        bucle_principal: ->
            setInterval(
                =>
                    @actualizar()
                , 100)
            `void 0`
##      /**
##       * @method iniciar
##       * Inicia la ventana principal del juego con algunos detalles de funcionamiento.
##       *
##       * Ejemplo de invocación:
##       *
##       *     >>> // JavaScript
##       *     >>> pilas.iniciar({ancho: 320, alto: 240});
##       *
##       *     >>> # Python (Brython)
##       *     >>> pilas.iniciar(ancho=320, alto=240)
##       *
##       * Parámetros:
##       *
##       * - alto: el tamaño en pixels para el canvas. (Por defecto 240px)
##       * - ancho: el tamaño en pixels para el canvas. (Por defecto 320px)
##       * - data_path: La ruta hacia la carpeta donde están las imágenes de los actores. (Por defecto 'data/')
##       * - gravedad: el vector de aceleracion para la simulacion de fisica. #TODO
##       * - permitir_depuracion: si se desea tener habilidatas las funciones de depuracion de las teclas F5 a F12 #TODO
##       * - rendimiento: cantidad de cuadros por segundo a mostrar. #TODO
##       * @param {Object} opciones
##       */
        iniciar: (opciones)->
            opciones = {} if not opciones?
            opciones.ancho = 320 if not opciones.ancho?
            opciones.alto = 240 if not opciones.alto?
            opciones.data_path = 'data' if not opciones.data_path?

            @depurador = new Depurador()
            @imagenes = new Imagenes(
                ()=>
                    @onready()
                    @bucle_principal()
                    `void 0`
                , opciones.data_path)


            @canvas_element = document.getElementsByTagName "canvas"

            if not @canvas_element?
                throw new Error "No se encuentra el elemento canvas dentro de la página."

            @canvas_element = @canvas_element[0]
            @canvas_element.width = opciones.ancho
            @canvas_element.height = opciones.alto
            @canvas_element.context = @canvas_element.getContext '2d'
            `void 0`
##      /**
##       * @method reiniciar
##       * Elimina todos los actores y vuelve al estado inicial.
##       */
        reiniciar: ->
            @lista_actores = []
            `void 0`
##      /**
##       * @method _limpiar_pantalla
##       * Borra los gráficos dibujados en el canvas.
##       */
        _limpiar_pantalla: (canvas_element_context)->
            imagen = @imagenes.cargar('plano.png').imagen
            canvas_element_context.fillStyle = canvas_element_context.createPattern imagen, 'repeat'
            canvas_element_context.fillRect 0, 0, 640, 480
            canvas_element_context.fill()

            window.canvas_element_context = canvas_element_context
            `void 0`

    pilas = new Pilas() if not pilas?
    return pilas
