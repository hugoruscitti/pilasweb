var app = angular.module('app', []);

app.config(function($routeProvider) {

  $routeProvider.when('/editor', {templateUrl: 'editor.html', controller: 'EditorController'}).
                 when('/demo1', {templateUrl: 'demo1.html', controller: 'Controller'}).
                 when('/demo2', {templateUrl: 'demo2.html', controller: 'Controller'}).
                 when('/demo3', {templateUrl: 'demo3.html', controller: 'Controller'}).
                 when('/demo4', {templateUrl: 'demo4.html', controller: 'Controller'}).
                 otherwise({redirectTo: '/demo1'});
          

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
    {'nombre': 'Arrastrable', 'url': '#/demo3'},
    {'nombre': 'Editor simple', 'url': '#/editor'},
    {'nombre': 'Nave', 'url': '#/demo4'},
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

  $scope.codigo = [
    "pilas = new Pilas();",
    "pilas.iniciar({ancho: 320, alto: 240, data_path: 'data'});",
    "",
    "pilas.onready = function() {",
    "  var fondo = new pilas.fondos.Plano();",
    "  aceituna = new pilas.actores.Aceituna();",
    "  //aceituna.escala = [2];",
    "}",
    "",
    "pilas.ejecutar();",
  ].join('\n');

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
