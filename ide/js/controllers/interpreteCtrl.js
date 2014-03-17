var app = angular.module('app');

//RapydScript options
var rs_options = {
    "filename": "demo",
    "toplevel": null,
    "basedir": null,
    "libdir": null
};
var output_opts = {
    "beautify": true,
    "private_scope": false,
    "omit_baselib": true
};


var utils = {
    getCaretPixelPos: function ($node, offsetx, offsety){
        offsetx = offsetx || 0;
        offsety = offsety || 0;

        var nodeLeft = 0,
            nodeTop = 0;
        if ($node){
            nodeLeft = $node.offsetLeft;
            nodeTop = $node.offsetTop;
        }

        var pos = {left: 0, top: 0};

        if (document.selection){
            var range = document.selection.createRange();
            pos.left = range.offsetLeft + offsetx - nodeLeft;
            pos.top = range.offsetTop + offsety - nodeTop;
        }else if (window.getSelection){
            var sel = window.getSelection();
            var range = sel.getRangeAt(0).cloneRange();
            try{
                range.setStart(range.startContainer, range.startOffset-1);
            }catch(e){}
            var rect = range.getBoundingClientRect();
            if (range.endOffset == 0 || range.toString() === ''){
                // first char of line
                if (range.startContainer == $node){
                    // empty div
                    if (range.endOffset == 0){
                        pos.top = 0;
                        pos.left = 0;
                    }else{
                        // firefox need this
                        var range2 = range.cloneRange();
                        range2.setStart(range2.startContainer, 0);
                        var rect2 = range2.getBoundingClientRect();
                        pos.left = rect2.left + offsetx - nodeLeft;
                        pos.top = rect2.top + rect2.height + offsety - nodeTop;
                    }
                }else{
                    pos.top = range.startContainer.offsetTop;
                    pos.left = range.startContainer.offsetLeft;
                }
            }else{
                pos.left = rect.left + rect.width + offsetx - nodeLeft;
                pos.top = rect.top + offsety - nodeTop;
            }
        }
        return pos;
    },
}

/**
     * Repara el codigo obtenido en python para que no use submodulos
     * en las superclases.
     *
     * Esta función reemplaza código cómo:
     *
     *       class MiActor(pilas.actores.Actor):
     *
     *  por:
     *
     *       __super = pilas.actores.Actor
     *       class MiActor(__super):
     *
     * El resultado al final es el mismo, pero evita el error de
     * sintaxis que emite rapydscript.
     */
function reescribir_superclases(codigo_python) {
    var expresion = /class\s+(\w+)\((.+)\):/g

    return codigo_python.replace(expresion, "__super=$2\nclass $1(__super):")
}


function ejecutar_codigo_python(codigo_python, success_callback, error_callback) {

    output = OutputStream(output_opts)
    codigo_python += '\n';

    try {
        codigo_python = reescribir_superclases(codigo_python);
        TOPLEVEL = parse(codigo_python, rs_options);
        TOPLEVEL.print(output);

        var codigo_js_generado = String(output) + '\n';
        success_callback.call(this, codigo_js_generado);

    } catch(err) {
        var mensaje_de_error = "ERROR: " + err.message + ". Line " + err.line + ", column " + err.col + ".";
        error_callback.call(this, mensaje_de_error);
    }

}


/* Ejecuta una porcion de código python pero de manera
   * sincrónica, muy utilizado para la consola interactiva, que muestra
   * el cursor luego de cada comando.
   *
   * Si el código enviado a este método falla, se emite una exception.
   */
function ejecutar_codigo_python_sync(codigo_python) {
    output = OutputStream(output_opts)
    codigo_python += '\n';

    try {
        TOPLEVEL = parse(codigo_python, rs_options);
        TOPLEVEL.print(output);

        var codigo_js_generado = String(output) + '\n';
        return window.eval(codigo_js_generado);
    } catch(err) {
        throw new Error(err.message);
    }
}

var ModalExportarCtrl = function($scope, $modalInstance, $http, codigo) {
    $scope.mensaje = "";
    $scope.error = "";
    $scope.url_juego = "";

    function cargar_preview() {
        //var imagen = document.getElementById('imagen');
        var canvas = document.getElementById('canvas');

        $scope.imagen_src = canvas.toDataURL();
    }

    cargar_preview();


    $scope.subir = function () {

        function subir_codigo(parametros) {
            var basepath = 'http://198.211.105.46:1337'; // RUTA en donde se aloja la
            // aplicacion web para publicar juegos
            // ver: https://github.com/hugoruscitti/nube-experimental-pilas

            $scope.mensaje = "Subiendo ...";

            $http.post(basepath + '/publicar', parametros).
            success(function(data) {
                // cuando se hace un post a '/publicar' la aplicación web
                // guarda el código y retorna la URL en donde se publica el juego.

                $scope.mensaje = "OK";
                $scope.url_juego = basepath + data.url;
            }).
            error(function(error, code) {
                $scope.error = "Error al intentar subir el código.";
                $scope.mensaje = "";
            });

        }

        function cargar_titulo_desde_interfaz() {
            var titulo = document.getElementById('titulo');
            $scope.titulo = titulo.value;
        }

        cargar_titulo_desde_interfaz();

        ejecutar_codigo_python(codigo,
                               function(codigo_js) {
                                   parametros = {codigo: codigo_js,
                                                 imagen: $scope.imagen_src,
                                                 titulo: $scope.titulo,
                                                };
                                   subir_codigo(parametros);
                               },
                               function(mensaje_de_error) {
                                   alert(mensaje_de_error);
                               }
                              );
    }

    $scope.cancelar = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.abrir_juego_en_el_navegador = function() {
        $modalInstance.close();
        gui.Shell.openExternal($scope.url_juego);
    }
}

app.controller('InterpreteCtrl', function($scope, $http, $modal) {
    $scope.codigo = [
        '# codigo para ejecutar.',
        '        ',
        'class MiActor(pilas.actores.Bomba):',
        '',
        '  def __init__(self):',
        '    self.escala = [2, 0.5]',
        '    self.y = [100]',
        '    ',
        '  def actualizar(self):',
        '    self.rotacion += 1',
        '',
        '',
        'p1 = pilas.actores.Pelota( 5, -100)',
        'p2 = pilas.actores.Pelota(-50, 100)',
        'p3 = pilas.actores.Pelota()',
        'aceituna = pilas.actores.Aceituna()',
        'aceituna.x = [100]',
        '',
        'c = MiActor()',
        'c.x =[100]',
    ].join('\n');

        $scope.editorOptions = {
        lineNumbers: true,
        theme: 'xq-light',
        mode: 'python',
        };

        $scope.data = {
        textoIngresado: '',
        sugerencias: [],
        indice_sugerido: 0,
            todasLasSugerencias: ['pilas', 'pilas.actores'],
};

    var codemirrorEditor = undefined;

    $scope.codemirrorLoaded = function(_editor){
        codemirrorEditor = _editor;

        // Editor part
        //var _doc = _editor.getDoc();
        //_editor.focus();

        // Options
        //_editor.setOption('firstLineNumber', 10);
        //_doc.markClean()

        // Events
        //_editor.on("beforeChange", function(){ ... });
        //_editor.on("change", function(){ ... });
    };

    splitterVertical = {
        lastX: 0,
        leftEl: null,
        rightEl: null,
        containerEl: null,

        init: function(handler, leftEl, rightEl, containerEl) {
            var self = this;

            this.leftEl = leftEl;
            this.rightEl = rightEl;
            this.containerEl = containerEl;

            handler.addEventListener('mousedown', function(evt) {
                evt.preventDefault();    /* prevent text selection */

                self.lastX = evt.clientX;

                window.addEventListener('mousemove', self.drag);
                window.addEventListener('mouseup', self.endDrag);
            });
        },

        drag: function(evt) {
            var splitter = splitterVertical;
            var wL, wR, wDiff = evt.clientX - splitter.lastX;

            wL = document.defaultView.getComputedStyle(splitter.leftEl, '').getPropertyValue('-webkit-flex-grow');
            wR = document.defaultView.getComputedStyle(splitter.rightEl, '').getPropertyValue('-webkit-flex-grow');

            var ancho = splitter.containerEl.clientWidth + parseInt(document.defaultView.getComputedStyle(splitter.containerEl, '').getPropertyValue('left'), 10);

            splitter.rightEl.style.webkitFlexGrow = (ancho - evt.clientX) / (splitter.containerEl.clientWidth/2);
            splitter.leftEl.style.webkitFlexGrow = 2 - splitter.rightEl.style.webkitFlexGrow;

            splitter.lastX = evt.clientX;
        },

        endDrag: function() {
            var splitter = splitterVertical;
            window.removeEventListener('mousemove', splitter.drag);
            window.removeEventListener('mouseup', splitter.endDrag);
        }
    };

    splitterVertical.init(
        document.getElementById('splitter-vertical'),
        document.getElementById('editor'),
        document.getElementById('panel-lateral-interprete'),
        document.getElementById('content')
    );

    pilas = new Pilas();
    pilas.iniciar({canvas_id: 'canvas', ancho: 320, alto: 240, data_path: 'public/data'});

    pilas.onready = function() {
        var fondo = new pilas.fondos.Plano();
        window.bomba = new pilas.actores.Bomba();
    }

    pilas.ejecutar();

    $scope.ejecutar = function() {
        pilas.reiniciar();

        var codigo = codemirrorEditor.getDoc().getValue();
        $scope.definir_modos();

        ejecutar_codigo_python(codigo,
                               function(codigo_js) {
                                   eval(codigo_js);
                               },
                               function(mensaje_de_error) {
                                   console.log(mensaje_de_error);

                                   alert(mensaje_de_error);
                               }
                              );

    }

    $scope.publicar = function() {

        var modalInstance = $modal.open({
            templateUrl: 'partials/modal_exportar.html',
            controller: ModalExportarCtrl,
            resolve: {
                codigo: function () {
                    return codemirrorEditor.getDoc().getValue();
                }
            }
        });
    }


    $scope.editor_visible = true;
    $scope.interprete_visible = true;

    $scope.alternar_editor = function() {
        var editor = document.getElementById('editor');
        $scope.editor_visible = !$scope.editor_visible;
        editor.classList.toggle('editor-invisible');
    }

    $scope.alternar_interprete = function() {
        var panelInterprete = document.getElementById('panel-interprete');
        $scope.interprete_visible = !$scope.interprete_visible;
        panelInterprete.classList.toggle('interprete-invisible');
    }

    $scope.definir_modos = function() {
        pilas.mundo.depurador.definir_modos({
            info: $scope.depuracion_info,
            puntos_de_control: $scope.depuracion_puntos_de_control,
            radios_de_colision: $scope.depuracion_radios_de_colision,
            area: $scope.depuracion_area,
            fisica: $scope.depuracion_fisica,
            posiciones: $scope.depuracion_posiciones,
        });
    }

    // modos depuracion.

    $scope.depuracion_info = false;
    $scope.depuracion_puntos_de_control = false;
    $scope.depuracion_radios_de_colision = false;
    $scope.depuracion_area = false;
    $scope.depuracion_fisica = false;
    $scope.depuracion_posiciones = false;

    $scope.alternar_depuracion_info = function() {
        $scope.depuracion_info = !$scope.depuracion_info;
        $scope.definir_modos();
    }

    $scope.alternar_depuracion_puntos_de_control = function() {
        $scope.depuracion_puntos_de_control = !$scope.depuracion_puntos_de_control;
        $scope.definir_modos();
    }

    $scope.alternar_depuracion_radios_de_colision = function() {
        $scope.depuracion_radios_de_colision = !$scope.depuracion_radios_de_colision;
        $scope.definir_modos();
    }

    $scope.alternar_depuracion_area = function() {
        $scope.depuracion_area = !$scope.depuracion_area;
        $scope.definir_modos();
    }

    $scope.alternar_depuracion_fisica = function() {
        $scope.depuracion_fisica = !$scope.depuracion_fisica;
        $scope.definir_modos();
    }

    $scope.alternar_depuracion_posiciones = function() {
        $scope.depuracion_posiciones = !$scope.depuracion_posiciones;
        $scope.definir_modos();
    }

    // bootstrap de la consola interactiva.
    window.js_console = iniciar_jsconsole();

    function procesar_keydown_sobre_autocompletado(event) {
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;

        if (keycode === 13) { // Tecla Enter
            event.stopPropagation();
            event.preventDefault();

            // Sustituye el texto del intérprete por el texto sugerido.
            var texto_sugerido = $scope.data.sugerencias[$scope.data.indice_sugerido];
            var ultima_palabra = $scope.data.textoIngresado.split(' ').pop();
            var ultima_parte = ultima_palabra.split('.').pop();

            // reemplaza solo la parte no ingresada por el usuario.
            texto_sugerido = texto_sugerido.replace(ultima_parte, '');
            document.execCommand('insertHTML', false, texto_sugerido);

            $scope.$apply();
            return false;
        }

        // Tecla Arriba
        if (keycode === 38) {
            event.stopPropagation();
            event.preventDefault();
            $scope.data.indice_sugerido = Math.max($scope.data.indice_sugerido - 1, 0);
            $scope.$apply();
            return false;
        }

        // Tecla Abajo
        if (keycode === 40) {
            event.stopPropagation();
            event.preventDefault();
            $scope.data.indice_sugerido = Math.min($scope.data.indice_sugerido + 1, $scope.data.sugerencias.length - 1);
            $scope.$apply();
            return false;
        }

        return true;
    }

    // Intercepta la pulsación de teclas sobre el interprete
    // para que se pueda navegar el menú de autocompletado.
    //
    // Si esta función retorna false, se absorve el evento y
    // y la pulsación de teclas no llegará al intérprete. En cambio, si
    // retorna true, el evento sigue su curso hacia el intérprete.
    var el_exec = document.getElementById('exec');
    var funcion_estandar_de_consolejs = el_exec.onkeydown;

    el_exec.onkeydown = function(event) {
        // Si hay texto sugerido en el popup de autocompletado
        // intenta capturar el teclado y absorver el evento.
        if ($scope.data.sugerencias.length > 0) {
            var continuar_evento = procesar_keydown_sobre_autocompletado(event);

            if (!continuar_evento)
                return false;
        }

        funcion_estandar_de_consolejs.call(this, event);
    }


    $('#exec').on('keyup', function() {
        var el_cursor = document.getElementById('cursor');
        var el_sugerencias = document.getElementById('sugerencias');
        var el_console = document.getElementById('console');

        $scope.data.textoIngresado = $('#exec').text();

        var pos = utils.getCaretPixelPos(el_cursor);

        if (pos.left === 0)
            pos.left = 5000;

        el_sugerencias.style.left = pos.left + 30 + "px";
        el_sugerencias.style.top = pos.top + 15 + "px";

        var limite_inferior_contenedor = el_console.getClientRects()[0].bottom;

        // Si sale por abajo del area visible lo sube.
        if (pos.top + 150 > limite_inferior_contenedor) {
            // 150 es el alto del area de sugerencias.
            el_sugerencias.style.top = limite_inferior_contenedor - 145 + "px";
        }

        $scope.$apply();
    });

    function obtener_sugerencias_para(un_texto) {
        var sugerencias = [];

        // Tiene puntos
        if (un_texto.indexOf('.') > 0) {
            var palabras = un_texto.split('.');
            var ultima_palabra = palabras.pop();
            var base = palabras.join('.');
            var posibles_sugerencias = [];

            console.log({base: base, ultima_palabra: ultima_palabra});

            eval('for (item in ' + base + ') {posibles_sugerencias.push(item)}');

            if (posibles_sugerencias) {
                for (var i=0; i<posibles_sugerencias.length; i++) {
                    if (RegExp("^" + ultima_palabra).test(posibles_sugerencias[i]))
                        sugerencias.push(posibles_sugerencias[i]);
                }
            }

            return sugerencias;
        }


        // Es una palabra simple

        for (var i=0; i<$scope.data.todasLasSugerencias.length; i++) {
            var posibleSugerencia = $scope.data.todasLasSugerencias[i];

            if (RegExp("^" + un_texto).test(posibleSugerencia))
                sugerencias.push(posibleSugerencia);
        }

        return sugerencias;
    }

    $scope.$watch('data.textoIngresado', function() {
        $scope.data.sugerencias = [];
        var ultima_palabra = $scope.data.textoIngresado.split(' ').pop();

        if (ultima_palabra.indexOf('(') > 0 || ultima_palabra.indexOf(')') > 0)
            return;

        if (! ultima_palabra)
            return;

        $scope.data.sugerencias = obtener_sugerencias_para(ultima_palabra);
        $scope.data.indice_sugerido = 0;
    });

});
