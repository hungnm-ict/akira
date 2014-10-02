var app = angular.module('kanjin4App', ['ngRoute', 'kanjin4Ctrls', 'kanjin4Directives', 'commonCtrls', 'akrSharedDirectives']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainCtrl'
            })
            .when('/:lessonId', {
                controller: 'subCtrl',
                templateUrl: 'subtopic.html',
            })
            .when('/:lessonId/:partId/learn', {
                templateUrl: 'learn.html',
                controller: 'learnCtrl'
            })
            .when('/:lessonId/:partId/picture', {
                templateUrl: 'picture.html',
                controller: 'pictureCtrl'
            })
            .when('/:lessonId/:partId/word', {
                templateUrl: 'word.html',
                controller: 'wordCtrl'
            })
            .when('/:lessonId/:partId/connect', {
                templateUrl: 'connect.html',
                controller: 'connectCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);


app.service('dataService', function($http) {
    this.promise = $http({
        method: "GET",
        url: "../../data/kanjin4/n4kanji_v2.0.json"
    });

    this.filter = function(data, key1, lessonId, key2, partId) {
        var uniqueGroups = [];
        $.each(data, function(idx, val) {
            if (data[idx][key1] == lessonId && data[idx][key2] == partId) {
                uniqueGroups.push(data[idx]);
            }
        });
        return uniqueGroups;
    }
});
