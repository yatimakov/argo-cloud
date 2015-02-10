'use strict';

angular.module('ngAgroApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('board', {
        url: '/',
        templateUrl: 'app/board/board.html',
        controller: 'BoardCtrl'
      });
  });
