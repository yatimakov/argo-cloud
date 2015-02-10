'use strict';

angular.module('ngAgroApp').directive('createNewDevice', createNewDevice);

function createNewDevice(){
  return {
    restrict: 'E',
    replace: true,
    link:function($scope, element, attrs){

    },
    template:'<div></div>',
    templateUrl:'template/createNewDevice'
  }
}
