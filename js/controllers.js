var tplController = angular.module('tplControllers',[]);

tplController.controller('mainCtrl',function($scope,$routeParams,$http){
    $scope.lessonId=$routeParams.lessonId;
});