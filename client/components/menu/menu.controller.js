'use strict';

angular.module('ngAgroApp')
  .controller('MenuCtrl', function ($scope, $location, loader) {

    $scope.menu = [
      {
        title: 'Dashboard',
        link: '/',
        icon: 'fa-dashboard'
      },
      {
        title: 'Points',
        link: '/_points',
        icon: 'fa-map-marker'
      },
      {
        title: 'Navigators',
        link: '/navigators',
        icon: 'fa-car'
      }
    ];

    $scope.isActive = function(route) {
      return route === $location.path();
    };

// loader
    $scope.$on('loader:updated', function(event, data) {
      $scope._isBusy = data.state;
    });
    $scope._isBusy = loader.state;

  });
