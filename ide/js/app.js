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
            templateUrl: 'interprete.html'
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