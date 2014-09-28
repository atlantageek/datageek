'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', ['$scope','$http',function ($scope,$http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.UpdateMetricList= function(typed) {
      $scope.typed = typed;
      $scope.MetricList=['A','B'];
      console.log(typed);
      $http({method: 'GET', url: '/metrics/index', params: {term: typed }}).
	success(function(data) {
          $scope.MetricList=data;
	  console.log($scope.MetricList);
          }).
        error(function() {
	});

    };
  }]);
