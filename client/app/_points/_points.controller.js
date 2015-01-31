'use strict';

var app = angular.module('ngAgroApp');
app.controller('_pointsCtrl', _pointsCtrl);
app.controller('tableCtrl', tableCtrl);

app.service('navigator', function Navigator($rootScope){
  var navigator = this;
  navigator.id = null;
  navigator.points = [];
  navigator.reloadPoints = function(){
    //this.points = navigator.points;
    $rootScope.$broadcast('points:updated', {data:navigator.points});
  };
});

function _pointsCtrl($scope, $http, socket, navigator, $resource) {
  $scope.navigators = [];

  var pointsCtrl = this;

  pointsCtrl.navigator = navigator;

  $http.get('/api/navigators').success(function (navigators) {
    $scope.navigators = navigators;
    if (navigators.length) {
      $scope.selectedNavigator = $scope.navigators[0];
    }
    socket.syncUpdates('navigator', $scope.navigators);
  });

  //var _getPointsCB = function(points){
  //  console.log(points.length);
  //};
  //$scope.showPoints = function ($event) {
  //  //console.log();
  //  var httpParams = {
  //    url: '/api/points',
  //    method: "GET",
  //    params: {
  //      navigatorID: $event.currentTarget.id
  //    }
  //  };
  //  $http(httpParams).success(_getPointsCB);
  //};

  $scope.showPoints = function ($event) {
    navigator.id = $event.currentTarget.id;
    var pointsUrl = '/api/points?navigatorID='+ $event.currentTarget.id;
    var Points =  $resource(pointsUrl);
    Points.query().$promise.then(function(points) {
      navigator.points = points;
      navigator.reloadPoints();
      console.log(points.length);
    });
  }
}
function tableCtrl($scope, $resource, navigator) {
  var vm = this;
  vm.navigator = navigator;
  $scope.points = navigator.points;

  //$scope.$watch("points", function(){
  //  alert("1");
  //});

  $scope.$on('points:updated', function(event,data) {
    // you could inspect the data to see if what you care about changed, or just update your own scope
    vm.points = navigator.points;

  });

  vm.points = [{x: 1,y: 2,date:"ewqe"}];
  $scope.reloadPoints = navigator.reloadPoints;

  $scope.deletePoint = function($event){
    var pointUrl = '/api/points/'+$event.currentTarget.id;
    var Point =  $resource(pointUrl);
    Point.delete(function(){
      console.log("Point was removed");
    });
  }
}
