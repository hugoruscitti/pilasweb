var app = angular.module('app', []);

app.config(function($routeProvider) {

  $routeProvider.when('/', {redirectTo: '/demo1', controller: 'Controller'}).
                 when('/demo1', {templateUrl: 'demo1.html', controller: 'Controller'}).
                 when('/demo2', {templateUrl: 'demo2.html', controller: 'Controller'});
});

app.run( function($rootScope, $location) {

  $rootScope.$on( "$routeChangeSuccess", function(event) {

  });
});


app.controller('Controller', function($scope, $location) {
  $scope.seleccionado = 1;
  $scope.demos = [
    {'nombre': 'demo1', 'url': '#/demo1'},
    {'nombre': 'demo2', 'url': '#/demo2'},
  ];

  $scope.seleccionar = function(indice) {
    $scope.seleccionado = indice;
  }

  $scope.iniciar_ejemplo = function(numero) {
    codigo = document.getElementById('/demo' + numero).innerHTML;
    eval(codigo);
  }
});
