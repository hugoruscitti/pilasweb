define ->
    class Depurador
        constructor: ->
            @modos = []
            @modos.push new ModoPuntosDeControl()

        comienza_dibujado: (painter)->
            @modos.forEach (m) ->
                m.comienza_dibujado painter
                `void 0`
            `void 0`

        dibuja_al_actor: (painter, actor)->
            @modos.forEach (m) ->
                m.dibuja_al_actor painter, actor
                `void 0`
            `void 0`

        termina_dibujado: (painter)->
            @modos.forEach (m) ->
                m.termina_dibujado painter
                `void 0`
            `void 0`

    class ModoDepurador
        comienza_dibujado: (painter)->

        dibuja_al_actor: (painter, actor)->

        termina_dibujado: (painter)->

    class ModoPuntosDeControl extends ModoDepurador
        dibuja_al_actor: (painter, actor)->
            @_dibuja_cruz painter, actor.x, actor.y
            `void 0`

        _dibuja_cruz: (painter, x, y)->
            d = 4

            painter.save()
            painter.strokeStyle = 'white'
            painter.lineWidth = 3

            painter.beginPath()
            painter.moveTo x - d, y - d
            painter.lineTo x + d, y + d
            painter.stroke()
            painter.closePath()

            painter.beginPath()
            painter.moveTo x + d, y - d
            painter.lineTo x - d, y + d
            painter.stroke()
            painter.closePath()

            painter.restore()
            `void 0`

    return Depurador
