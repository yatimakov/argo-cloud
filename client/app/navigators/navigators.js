'use strict';

angular.module('ngAgroApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('navigators', {
        url: '/navigators',
        templateUrl: 'app/navigators/navigators.html',
        controller: 'navigatorsCtrl as navigators'
      });
  });
