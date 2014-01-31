var gui = require('nw.gui');

app = angular.module('app', ['ngRoute', 'ui.codemirror', 'ngAnimate', 'ui.bootstrap']);

app.directive('popover', function() {
	return {
		restrict: 'A',
		template: '<span ng-transclude></span>',
		transclude: true,
		link: function(scope, element, attrs) {
		}
		
	}
});


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








app.directive('colaborador', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="integrante">' +
						  '<a popover="{{nombre}}" popover-trigger="mouseenter" href="" ng-click="abrir_sitio()">' +
		          '<img src="imagenes/equipo/{{nick}}.png">' +
		          '</a>' +
							'</div>',
		link: function(scope, element, attrs) {
			
			scope.nick = attrs.nick;
			scope.nombre = attrs.nombre;
			scope.de = attrs.de;
			scope.url = attrs.url;
			
			scope.abrir_sitio = function() {
				window.abrir_url(scope.url);
			}
		}
	}
});

app.config(['$routeProvider', function($routeProvider) { $routeProvider.
          when('/index', {
            controller: 'IndexCtrl',
            templateUrl: 'partials/index.html'
          }).
					when('/interprete', {
            templateUrl: 'partials/interprete.html',
						controller: 'InterpreteCtrl'
          }).
					when('/tutoriales', {
            templateUrl: 'partials/tutoriales.html'
          }).
            when('/tutoriales/caminos', {
              templateUrl: 'partials/tutoriales/caminos.html'
            }).
            when('/tutoriales/nave', {
              templateUrl: 'partials/tutoriales/nave.html'
            }).
            when('/tutoriales/fisica', {
              templateUrl: 'partials/tutoriales/fisica.html'
            }).

					when('/ejemplos', {
            templateUrl: 'partials/ejemplos.html'
          }).
					when('/manual', {
            templateUrl: 'partials/manual.html'
          }).
					when('/foro', {
            templateUrl: 'partials/foro.html'
          }).
					when('/acercade', {
            templateUrl: 'partials/acercade.html'
          }).
					otherwise({redirectTo:'/index'});
}]);


/* Botón en la barra superior para recargar toda la aplicación. */
window.actualizar = function() {
	document.location.reload();
}
	
	/* Botón en la barra superior para mostrar las herramientas de desarrollo. */
window.mostrar_herramientas_de_desarrollo = function() {
	gui.Window.get().showDevTools();
}

app.controller('MainCtrl', function($scope, $location) {
  
	/* Helper para mostrar activa la opción seleccionada del menú izquierdo. */
  $scope.getClass = function(path) {
    if ($location.path().substr(0, path.length) == path)
      return "active";
    else
      return "";
	}	
	
});

app.controller('IndexCtrl', function($scope) {
  
});

app.controller('InterpreteCtrl', function($scope, $http) {
	$scope.codigo = [
		'# codigo para ejecutar.',
		'		',
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
		textoIngresado: 'pi',
		sugerencias: [],
		todasLasSugerencias: ['pilas', 'mono', 'pilas.actores'],
	};
	
	
	$scope.$watch('data.textoIngresado', function() {
		//console.log($scope.data.textoIngresado);
		
		//if ($scope.data.sugerencias.indexOf($scope.data.textoIngresado) === -1)
	  // $scope.data.sugerencias.push($scope.data.textoIngresado);
		$scope.data.sugerencias = [];
		
		if (! $scope.data.textoIngresado) return;
		
		for (var i=0; i<$scope.data.todasLasSugerencias.length; i++) {
			var posibleSugerencia = $scope.data.todasLasSugerencias[i];
			//var posicion = $('#input').textareaHelper('caretPos');
			//var origen = $('textarea').position();
			
			//var sugerencias  = $('#sugerencias');
			//sugerencias.css('position', 'absolute');
			//sugerencias.css('left', origen.left + posicion.left + "px");
			//sugerencias.css('top', origen.top + 20 + posicion.top + "px");
			
			
			
			if (RegExp($scope.data.textoIngresado).test(posibleSugerencia))
				$scope.data.sugerencias.push(posibleSugerencia);
		}
		
	});
	
		
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
	pilas.iniciar({canvas_id: 'canvasInterprete', ancho: 320, alto: 240, data_path: 'public/data'});
	
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
				alert(mensaje_de_error);
			}
		);
		
	}
		
		
	$scope.publicar = function() {
		var codigo = codemirrorEditor.getDoc().getValue();
				
		function subir_codigo(parametros) {
			var basepath = 'http://198.211.105.46:1337'; // RUTA en donde se aloja la
																									 // aplicacion web para publicar juegos
																									 // ver: https://github.com/hugoruscitti/nube-experimental-pilas
			
			$http.post(basepath + '/publicar', parametros).
					success(function(data, status) {
						// cuando se hace un post a '/publicar' la aplicación web
						// guarda el código y retorna la URL en donde se publica el juego.
						gui.Shell.openExternal(basepath + data.url);
					});
			}
		
		
			ejecutar_codigo_python(codigo, 
				function(codigo_js) {
					parametros = {codigo: codigo_js};
					subir_codigo(parametros);
				}, 
				function(mensaje_de_error) {
					// incluso si el codigo tiene errores lo sube, para que los
		      // chicos puedan consultar y resolver errores.
					parametros = {codigo: codigo_js};
					subir_codigo(parametros);
		
				}
			);
			
			
		
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
});

app.controller('EquipoCtrl', function($scope, $http) {
	$scope.cuando_selecciona = function(un_colaborador) {
		console.log("ha seleccionado", un_colaborador);
	}
});

window.abrir_url = function(url) {
	gui.Shell.openExternal(url);
}
		
		
window.abrir_github_en_el_navegador = function() {
	gui.Shell.openExternal('http://github.com/hugoruscitti/pilas.git');
}

window.abrir_pilas_en_el_navegador = function() {
	gui.Shell.openExternal('http://www.pilas-engine.com.ar');
}

window.abrir_herramientas_desarrollo = function() {
	gui.Window.get().showDevTools();
}


$(function(){
    var rx = /INPUT|SPAN|SELECT|TEXTAREA/i;

    $(document).bind("keydown keypress", function(e) {
        if (e.which == 8) {
            if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                e.preventDefault();
            }
        }
    });
});