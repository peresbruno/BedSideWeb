'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', '$scope', function($http, $scope) {

	$scope.data = {
		numeroQuarto : null,
		numeroLeito : null,
		medicoes : [],
		pacienteIdentificado: false
	};

	$scope.paciente = null;

	var medicoes = [];

  if (annyang) {
    // Let's define our first command. First the text we expect, and then the function it should call
    var commands = {
		
		'Iniciar' : function () {
			$scope.paciente = null;
			$scope.data.numeroQuarto = null;
			$scope.data.numeroLeito = null;
			$scope.data.medicoes = [];
			console.log('iniciar');
		},

		'Quarto :quarto': function(quarto) {
			$scope.data.numeroQuarto = quarto;
			$scope.$apply();
			console.log('quarto', quarto)
		},

		'Leito :leito': function(leito) {
			$scope.data.numeroLeito = leito;
			$scope.$apply();
			console.log('leito', leito)
			$http({
				method: 'GET',
				url: 'http://localhost:3000/pacientes?quarto=' + $scope.data.numeroQuarto + '&leito=' + $scope.data.numeroLeito
			}).then(function successCallback(response) {
				$scope.paciente = response.data[0];
			// this callback will be called asynchronously
			// when the response is available
			}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			});
		},

		'Temperatura :temperatura': function(temperatura) {
			$scope.data.medicoes.push({
				tipo: "Temperatura",
				valor: temperatura,
				data : Date.now()
			});
			$scope.$apply();
			console.log('temperatura', temperatura);
		},

		'Pressão :pressao': function(pressao) {
			$scope.data.medicoes.push({
				tipo: "Pressão",
				valor: pressao,
				data : Date.now()
			});
			$scope.$apply();
			console.log('pressao', pressao);
		},

		'Dor :dor': function(dor) {
			$scope.data.medicoes.push({
				tipo: "Dor",
				valor: dor,
				data : Date.now()
			});
			$scope.$apply();
			console.log('dor', dor);
		},
		'Finalizar' : function() {

			console.log('finalizar');
			var prontuario = {
				quarto : $scope.paciente.quarto,
				leito : $scope.paciente.leito,
				nome : $scope.paciente.nome,
				nascimento : $scope.paciente.nascimento,
				medicoes : $scope.data.medicoes
			}

			$http.post('http://localhost:3000/prontuarios', prontuario
			).then(function successCallback(response) {
				$scope.paciente = response.data[0];
			// this callback will be called asynchronously
			// when the response is available
			}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			});
		}
    };

    annyang.debug();

    annyang.setLanguage('pt-BR');
    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
  }

}]);