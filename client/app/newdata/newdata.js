'use strict';

angular.module('ngAgroApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newdata', {
        url: '/newdata',
        templateUrl: 'app/newdata/newdata.html',
        controller: 'NewdataCtrl'
      });
  });
