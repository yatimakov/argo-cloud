'use strict';

var app = angular.module('ngAgroApp');
app.controller('navigatorsCtrl', navigatorsCtrl);

function navigatorsCtrl($scope, $http, socket) {
  //navigators
  $scope.navigators = [];
  $http.get('/api/navigators').success(function (navigators) {
    $scope.navigators = navigators;
    if (navigators.length) {
      $scope.selectedNavigator = $scope.navigators[0];
    }
    socket.syncUpdates('navigator', $scope.navigators);
  });
  $scope.addNavigtor = function () {
    if ($scope.navigatorName === '') {
      return;
    }
    $http.post('/api/navigators', {
      name: $scope.navigatorName,
      description: $scope.navigatorDescription,
      isActive: !!$scope.navigatorIsActive
    });
    $scope.navigatorName = '';
    $scope.navigatorDescription = '';
    $scope.navigatorIsActive = false;
  };
  $scope.deleteNavigator = function (navigator) {
    $http.delete('/api/navigators/' + navigator._id);
  };
  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('navigator');
  });
}

