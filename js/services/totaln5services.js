var totaln5service = angular.module('totaln5service', []);

totaln5service.service('subTopicLockService', function($scope, $http) {

    //Caculate all star for given courseName
    $scope.courseStar = function(courseName) {
        return 0;
    };

    //Caculate all star for given course - lesson
    //Possible: return star number is smaller than: 60 (maybe)
    $scope.lessonStars = function(coursename, lesson) {
        return 0;

    };


    //Gather star for specific game in: subtopic in lesson of courseName
    //Possible: return star number is smaller than 3
    $scope.gameStars = function(courseName, lesson, subtopic, game) {
        return 2;
    };

});
