var app = angular.module('kanjinApp', ['ngRoute', 'kanjinCtrls', 'commonCtrls', 'akrSharedDirectives']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/:degree', {
                controller: 'mainCtrl',
                templateUrl: function(url) {
                    var valid = ["n5", "n4"];
                    if (valid.indexOf(url.degree) != -1) {
                        return 'main.html';
                    } else {
                        return '../../view/_shared/error.html';
                    }
                }
            })
            .when('/:degree/:lessonId', {
                controller: 'subCtrl',
                templateUrl: 'subtopic.html',
            })
            .when('/:degree/:lessonId/:partId/learn', {
                templateUrl: 'learn.html',
                controller: 'learnCtrl'
            })
            .when('/:degree/:lessonId/:partId/picture', {
                templateUrl: 'picture.html',
                controller: 'pictureCtrl'
            })
            .when('/:degree/:lessonId/:partId/word', {
                templateUrl: 'word.html',
                controller: 'wordCtrl'
            })
            .when('/:degree/:lessonId/:partId/connect', {
                templateUrl: 'connect.html',
                controller: 'connectCtrl'
            })
            .otherwise({
                redirectTo: '/n5'
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
    };

    this.getData = function(course) {
        this.promise = $http({
            method: "GET",
            url: "../../data/" + course + "/n4kanji_v2.0.json"
        });

        
    };
});


app.controller('root', function($scope, $routeParams) {
    $scope.navgroup = 0;
    $scope.nav = 2;

    $scope.rootPlay = function(data, course, step, id) {
        var selId = "choices-" + step + "-" + id;
        var audioSrc = document.getElementById(selId).getElementsByTagName('source');
        $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
        document.getElementById(selId).load();
        document.getElementById(selId).play();
    }
});
