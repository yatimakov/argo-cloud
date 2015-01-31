'use strict';

angular.module('ngAgroApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('_points', {
        url: '/_points',
        templateUrl: 'app/_points/_points.html',
        controller: '_pointsCtrl as points'
      });
  });
