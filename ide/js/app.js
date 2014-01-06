var gui = require('nw.gui');

app = angular.module('app', ['ngRoute', 'ui.codemirror']);


app.directive('popover', function() {
	return {
		restrict: 'A',
		template: '<span ng-transclude></span>',
		transclude: true,
		link: function(scope, element, attrs) {
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
		'// codigo para ejecutar.',
		'',
		'',
		'p1 = new pilas.actores.Pelota( 5, -100);',
		'p2 = new pilas.actores.Pelota(-50, 100);',
		'p3 = new pilas.actores.Pelota();',
		'aceituna = new pilas.actores.Aceituna();',
		'aceituna.x = [100];',
	].join('\n');
		
	$scope.editorOptions = {
    lineNumbers: false,
		theme: 'xq-light',
  	mode: 'javascript',
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
	
	$scope.alternar_editor = function() {
		var editor = document.getElementById('editor');
		var panelInterprete = document.getElementById('panel-interprete');
		
		
		editor.classList.remove('oculto');
		editor.classList.toggle('editor-visible');
		panelInterprete.classList.toggle('panel-interprete-expandido');
	}
	
	
	iniciar_jsconsole();
	
	
});



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