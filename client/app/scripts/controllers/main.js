'use strict';

/**
 * @ngdoc function
 * @name bobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobApp
 */
angular.module('bobApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
