var app = angular.module('app');

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