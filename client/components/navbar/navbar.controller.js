'use strict';

angular.module('ngAgroApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, loader) {
    $scope.menu = [{
      'title': 'Desktop',
      'link': '/'
    },
      {
        'title': 'Points',
        'link': '/_points'
      }
    ];

    $scope.$on('loader:updated', function(event, data) {
      $scope._isBusy = data.state;
    });

    $scope._isBusy = loader.state;

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };



    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
