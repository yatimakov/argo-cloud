'use strict';

angular.module('ngAgroApp')
  .controller('BoardCtrl', function ($scope, $http, socket, loader) {

    $scope.loader = loader;
    $scope.loader.loader(false);


    var _map;
    var _beginOfLastTrack = [],
      _finishOfLastTrack = [];


    var _renderTrack = function (points) {

      if (!points.length) {
        alert('No points!');
        return;
      }

      console.log('Count points returned: ' + points.length);

      $scope.geoObjects = [];

      _beginOfLastTrack = [
        points[0].x,
        points[0].y
      ];
      _finishOfLastTrack = [
        points[points.length - 1].x,
        points[points.length - 1].y
      ];

      //$scope.geoObjects[0].geometry.coordinates = _finishOfLastTrack;

      //$scope.geoObjects[2].geometry.coordinates.length = 0;

      var sessionsCounter = 0;
      var pointsArrays = [];
      pointsArrays[0] = [];
      var deltaOfNewSessions = 0.01;
      var tempArray = [];

      for (var key in points) {

        if (key > 1) {
          if (Math.sqrt(Math.pow((points[key].x - points[key - 1].x), 2) + Math.pow((points[key].y - points[key - 1].y), 2)) > deltaOfNewSessions) {
            sessionsCounter++;
            pointsArrays[sessionsCounter] = tempArray;
            tempArray = [];
          }
        }
        pointsArrays[sessionsCounter].push([points[key].x, points[key].y]);
      }

      console.log('pointsArrays = ' + pointsArrays.length);

      for (var key in pointsArrays) {
        $scope.geoObjects.push({
          geometry: {
            type: 'LineString',
            coordinates: pointsArrays[key]
          }
        });
      }

      if (pointsArrays.length) {
        var timeFirstPoints = new Date(points[0].date);
        timeFirstPoints = timeFirstPoints.getHours() + ':' + timeFirstPoints.getMinutes();
        var timeLastPoints = new Date(points[points.length - 2].date);
        timeLastPoints = timeLastPoints.getHours() + ':' + timeLastPoints.getMinutes();

        $scope.geoObjects.push({
          geometry: {
            type: 'Point',
            coordinates: pointsArrays[0][0]
          },
          properties: {
            balloonContentHeader: "Start of track",
            balloonContentBody: points[0].navigatorID,
            balloonContentFooter: timeFirstPoints,
            hintContent: "Start of track"
          }
        });

        $scope.geoObjects.push({
          geometry: {
            type: 'Point',
            coordinates: [
              points[points.length - 2].x,
              points[points.length - 2].y
            ]
          },
          properties: {
            balloonContentHeader: "End of track",
            balloonContentBody: points[0].navigatorID,
            balloonContentFooter: timeLastPoints,
            hintContent: "End of track"
          }
        });
      }
      $scope.moveToFinishTrack();
      $scope.loader.loader(false);

    };

    $scope.clearFilters = function () {
      $scope.dateTo = null;
      $scope.dateFrom = null;
      $scope.selectedNavigator = null;
      timeFrom.setHours(0);
      timeFrom.setMinutes(0);
      $scope.timeFrom = timeFrom;
      $scope.timeTo = new Date();
      $scope.geoObjects = [];
    };


    $scope.getTrack = function () {
      $scope.loader.loader(true);
      var dateTimeFrom, dateTimeTo;

      dateTimeFrom = new Date($scope.dateFrom);
      dateTimeFrom.setHours($scope.timeFrom.getHours());
      dateTimeFrom.setMinutes($scope.timeFrom.getMinutes());

      dateTimeTo = new Date($scope.dateTo);
      dateTimeTo.setHours($scope.timeTo.getHours());
      dateTimeTo.setMinutes($scope.timeTo.getMinutes());

      $http({
        url: '/api/points',
        method: "GET",
        params: {
          navigatorID: $scope.selectedNavigator._id,
          dateFrom: dateTimeFrom,
          dateTo: dateTimeTo
        }
      }).success(_renderTrack);
    };


    //map
    $scope.zoom = 10;
    $scope.beforeInit = function () {
      var geolocation = ymaps.geolocation;
      geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
      }).then(function (result) {
        if (result) _beginOfLastTrack = result;
        $scope.center = result.geoObjects.position;
        $scope.$digest();
      });
    };
    $scope.geoObjects = [];
    $scope.afterMapInit = function (map) {
      _map = map;
    };
    $scope.del = function () {
      _map.destroy();
    };
    $scope.created = true;
    $scope.moveToBeginTrack = function () {
      $scope.loader.state = false;
      $scope.type = 'yandex#publicMapHybrid';
      _map.panTo(_beginOfLastTrack);
    };
    $scope.moveToFinishTrack = function () {
      $scope.type = 'yandex#publicMapHybrid';
      _map.panTo(_finishOfLastTrack);
    };

    //calendar
    $scope.format = 'dd.MM.yyyy';
    $scope.maxDate = new Date();
    $scope.today = function () {
      //$scope.dateFrom = new Date();
      $scope.dateTo = new Date();
    };
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false
    };
    $scope.today();
    $scope.clear = function () {
      $scope.dateFrom = null;
      $scope.dateTo = null;
    };

    $scope.openDateFrom = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.dateFromOpened = true;
    };
    $scope.openDateTo = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.dateToOpened = true;
    };

    //time
    var timeFrom = new Date();
    timeFrom.setHours(0);
    timeFrom.setMinutes(0);
    $scope.timeFrom = timeFrom;
    $scope.timeTo = new Date();


  });


