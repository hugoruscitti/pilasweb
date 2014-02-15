var app = angular.module('app');


app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
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

