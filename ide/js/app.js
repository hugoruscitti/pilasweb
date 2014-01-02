var gui = require('nw.gui');

app = angular.module('app', ['ngRoute']);


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
            templateUrl: 'index.html'
          }).
					when('/interprete', {
            templateUrl: 'interprete.html',
						controller: 'InterpreteCtrl'
          }).
					when('/tutoriales', {
            templateUrl: 'tutoriales.html'
          }).
            when('/tutoriales/caminos', {
              templateUrl: 'tutoriales/caminos.html'
            }).
            when('/tutoriales/nave', {
              templateUrl: 'tutoriales/nave.html'
            }).
            when('/tutoriales/fisica', {
              templateUrl: 'tutoriales/fisica.html'
            }).

					when('/ejemplos', {
            templateUrl: 'ejemplos.html'
          }).
					when('/manual', {
            templateUrl: 'manual.html'
          }).
					when('/foro', {
            templateUrl: 'foro.html'
          }).
					when('/acercade', {
            templateUrl: 'acercade.html'
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


app.controller('InterpreteCtrl', function($scope) {
	pilas = new Pilas();
	pilas.iniciar({canvas_id: 'canvasInterprete', ancho: 320, alto: 240, data_path: '../public/data'});
	
	pilas.onready = function() {
		var fondo = new pilas.fondos.Plano();
		window.bomba = new pilas.actores.Bomba();
	}
	pilas.ejecutar();
});



window.abrir_github_en_el_navegador = function() {
	gui.Shell.openExternal('http://github.com/hugoruscitti/pilas.git');
}

window.abrir_herramientas_desarrollo = function() {
	gui.Window.get().showDevTools();
}