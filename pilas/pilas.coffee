class Pilas
    iniciar: (elemento) ->
        alert elemento
        @canvas = document.getElementById elemento
        @stage = new Stage(@canvas)
        alert 'asdasd'

pilas = new Pilas
