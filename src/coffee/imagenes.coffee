define ['libs/PxLoader', 'libs/PxLoaderImage'],
 (_px, _pximg) ->

    class Imagen
        constructor: (@imagen)->

        dibujar: (painter, x, y, dx, dy,
         escala_x, escala_y, rotacion, transparencia)->
            painter.save()
            painter.translate x, y
            painter.scale escala_x, escala_y
            painter.rotate rotacion * (Math.PI / 180)
            painter.drawImage @imagen, -dx, -dy,
                @imagen.width, @imagen.height
            painter.restore()
            `void 0`

    class Grilla extends Imagen
        constructor: (imagen, @columnas, @filas)->
            super imagen
            @cantidad_de_cuadros = columnas * filas
            @cuadro_ancho = imagen.width / columnas
            @cuadro_alto = imagen.height / filas
            @definir_cuadro 0

        definir_cuadro: (cuadro)->
            @_cuadro = cuadro
            frame_col = (cuadro % @columnas) >> 0
            frame_row = (cuadro / @columnas) >> 0

            @dx = frame_col * @cuadro_ancho
            @dy = frame_row * @cuadro_alto
            `void 0`

        dibujar: (painter, x, y, dx, dy,
         escala_x, escala_y, rotacion, transparecencia)->
            painter.save()
            painter.translate x, y
            painter.scale escala_x, escala_y
            painter.rotate rotacion * (Math.PI / 180)

            painter.drawImageFromRect @imagen,
                @dx, @dy, @cuadro_ancho,
                @cuadro_alto, -dx, -dy,
                @cuadro_ancho, @cuadro_alto
            painter.restore()
            `void 0`

        avanzar: ->
            ha_reiniciado = false
            cuadro_actual = @_cuadro + 1

            if cuadro_actual >= @cantidad_de_cuadros
                cuadro_actual = 0
                ha_reiniciado = true

            @definir_cuadro cuadro_actual
            return ha_reiniciado

    class Imagenes
        constructor: (@onready)->
            @crear_barra_de_progreso()
            @recursos = {}
            @contador_imagenes_solicitadas = 0
            @contador_imagenes_cargadas = 0

            loader = new PxLoader()
            @cargar_recurso loader, 'aceituna.png'
            @cargar_recurso loader, 'plano.png'

            @cargar_recurso loader, 'cooperativista/alerta.png'
            @cargar_recurso loader, 'cooperativista/camina.png'
            @cargar_recurso loader, 'cooperativista/camina_sujeta.png'
            @cargar_recurso loader, 'cooperativista/ok.png'
            @cargar_recurso loader, 'cooperativista/parado.png'
            @cargar_recurso loader, 'cooperativista/parado_sujeta.png'
            @cargar_recurso loader, 'cooperativista/trabajando.png'

            loader.addProgressListener (e)=>
                @actualizar_progreso e
                return true
            loader.addCompletionListener (e)=>
                @onready()
                return true
            loader.start()

        actualizar_progreso: (e)->
            @contador_imagenes_cargadas += 1
            porcentaje = @contador_imagenes_cargadas * 100 /
                @contador_imagenes_solicitadas
            @bar.style.width = "#{porcentaje}%"
            `void 0`

        cargar_recurso: (loader, name)->
            path = "data/#{name}"
            @recursos[name] = loader.addImage path
            @contador_imagenes_solicitadas += 1
            `void 0`

        cargar: (nombre)->
            return new Imagen this.recursos[nombre]

        cargar_grilla: (nombre, columnas, filas)->
            return new Grilla @recursos[nombre], columnas, filas

        crear_barra_de_progreso: ->
            progress = document.createElement 'div'
            document.body.appendChild progress
            progress.id = "progress"
            progress.style.clear = "both"

            bar = document.createElement 'div'
            progress.appendChild bar
            bar.id = "bar"

            @progress = progress
            @bar = bar
            `void 0`

    return Imagenes
