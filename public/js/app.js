var app = angular.module('app', []);

app.config(function($routeProvider) {

  $routeProvider.when('/', {redirectTo: '/pepe', controller: 'Controller'}).
                 when('/demo1', {templateUrl: 'demo1.html', controller: 'Controller'}).
                 when('/demo2', {templateUrl: 'demo2.html', controller: 'Controller'});

});

app.run(function($rootScope, $location) {

  $rootScope.$on("$routeChangeSuccess", function(event) {
  });
});

app.controller('AppController', function($scope, $location) {
  $scope.seleccionado = 0;
  $scope.demos = [
    {'nombre': 'Aceituna y bomba', 'url': '#/demo1'},
    {'nombre': 'Escala', 'url': '#/demo2'},
  ];

  $scope.seleccionar = function(indice) {
    $scope.seleccionado = indice;
  }
});


app.controller('Controller', function($scope, $location) {
  $scope.iniciar_ejemplo = function(numero) {
    codigo = document.getElementById('/demo' + numero).innerHTML;
    eval(codigo);
  }
});
