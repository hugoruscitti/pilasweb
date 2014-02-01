var app = angular.module('app');

app.controller('MainCtrl', function($scope, $location) {
  
	/* Helper para mostrar activa la opción seleccionada del menú izquierdo. */
  $scope.getClass = function(path) {
    if ($location.path().substr(0, path.length) == path)
      return "active";
    else
      return "";
	}	
	
});