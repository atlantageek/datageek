'use strict';

/**
 * @ngdoc function
 * @name bobApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bobApp
 */
angular.module('bobApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
