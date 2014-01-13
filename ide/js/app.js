var gui = require('nw.gui');

app = angular.module('app', ['ngRoute', 'ui.codemirror', 'ngAnimate']);


app.directive('popover', function() {
	return {
		restrict: 'A',
		template: '<span ng-transclude></span>',
		transclude: true,
		link: function(scope, element, attrs) {
		}
		
	}
});


app.directive('colaborador', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		template: '<div class="integrante">' +
						  '<a href="" ng-click="mostrar()">' +
		          '<img src="imagenes/equipo/{{nick}}.png">' +
		          '</a>' +
							'<div class="detalle-integrante" ng-show="detalle_visible">' +
								'{{nombre}}' +
								'<br/>' +
								'<br/>' +
								'<i class="fa fa-flag"></i> {{de}}<br/>' +
								'<i class="fa fa-github-alt"></i> <a href="" ng-click="abrir_github()">Perfil</a><br/>' +
							'</div>' +
							'</div>',
		link: function(scope, element, attrs) {
			scope.detalle_visible = false;
			
			scope.nick = attrs.nick;
			scope.nombre = attrs.nombre;
			scope.de = attrs.de;
			scope.url = attrs.url;
			
			scope.mostrar = function() {
				scope.detalle_visible = ! scope.detalle_visible;
			}
			
			scope.abrir_github = function() {
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

app.controller('MainCtrl', function($scope, $location) {
  
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
		'',
		'p1 = pilas.actores.Pelota( 5, -100)',
		'p2 = pilas.actores.Pelota(-50, 100)',
		'p3 = pilas.actores.Pelota()',
		'aceituna = pilas.actores.Aceituna()',
		'aceituna.x = [100]',
	].join('\n');
		
	$scope.editorOptions = {
    lineNumbers: false,
		theme: 'xq-light',
  	mode: 'python',
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
    eval(codigo); 
	}
		
		
	$scope.publicar = function() {
		var parametros = {codigo: codemirrorEditor.getDoc().getValue()};
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
			fisica: $scope.depuracion_fisica,
			posicion: $scope.depuracion_posiciones,
			radios_de_colision: $scope.depuracion_radios_de_colision,
		});
	}
	
	
	// modos depuracion.
		
	$scope.depuracion_info = false;
	$scope.depuracion_fisica = false;
	$scope.depuracion_posiciones = false;
	$scope.depuracion_radios_de_colision = false;
		
	$scope.alternar_depuracion_info = function() {
		$scope.depuracion_info = !$scope.depuracion_info;
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
		
	$scope.alternar_depuracion_radios_de_colision = function() {
		$scope.depuracion_radios_de_colision = !$scope.depuracion_radios_de_colision;
		$scope.definir_modos();
	}
	
		
	// bootstrap de la consola interactiva.
	iniciar_jsconsole();
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