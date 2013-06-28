var app = angular.module('app', []);

app.config(function($routeProvider) {

  $routeProvider.when('/', {redirectTo: '/pepe', controller: 'Controller'}).
                 when('/editor', {templateUrl: 'editor.html', controller: 'EditorController'}).
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
    {'nombre': 'Editor', 'url': '#/editor'},
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

app.controller('EditorController', function($scope, $location) {

  $scope.codigo = "\
pilas = new Pilas(); \n\
pilas.iniciar({ancho: 320, alto: 240, data_path: 'data'}); \n\
pilas.onready = function() { \n\
  var fondo = new pilas.fondos.Plano(); \n\
  aceituna = new pilas.actores.Aceituna(); \n\
  //aceituna.escala = [2]; \n\
} \n\
\
pilas.ejecutar();";

  $scope.error = "";

  $scope.ejecutar = function() {
    try {
      eval($scope.codigo);
      $scope.error = "";
    } catch (e) {
      $scope.error = e.toString();
    }
  }
});
