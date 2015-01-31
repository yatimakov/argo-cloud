'use strict';

angular.module('ngAgroApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $injector) {
    $scope.menu = [{
      'title': 'Desktop',
      'link': '/'
    },
      {
        'title': 'Points',
        'link': '/_points'
      }
    ];

    var loader = $injector.get('loader');
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
