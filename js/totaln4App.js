var totaln4App = angular.module('totaln4App', ['ngRoute', 'totaln4Ctrls', 'totaln4Directives', 'commonCtrls', 'akrSharedDirectives']);

totaln4App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainCtrl'
            })
            .when('/:lessonId', {
                templateUrl: 'subtopic.html',
                controller: 'subCtrl'
            })
            .when('/:lessonId/:partId/learn', {
                templateUrl: 'vocab/learn.html',
                controller: 'learnCtrl'
            })
            .when('/:lessonId/:partId/picture', {
                templateUrl: 'vocab/picture.html',
                controller: 'pictureCtrl'
            })
            .when('/:lessonId/:partId/word', {
                templateUrl: 'vocab/word.html',
                controller: 'wordCtrl'
            })
            .when('/:lessonId/:partId/listen', {
                templateUrl: 'vocab/listen.html',
                controller: 'listenCtrl'
            })
            .when('/:lessonId/:partId/connect', {
                templateUrl: 'vocab/connect.html',
                controller: 'connectCtrl'
            })
            .when('/:lessonId/:partId/write', {
                templateUrl: 'vocab/write.html',
                controller: 'writeCtrl'
            })
            .when('/:lessonId/4/listen1', {
                templateUrl: 'grammar/listen.html',
                controller: 'grammarListenCtrl'
            })
            .when('/:lessonId/4/choice', {
                templateUrl: 'grammar/choice.html',
                controller: 'grammarChoiceCtrl'
            })
            .when('/:lessonId/4/translate', {
                templateUrl: 'grammar/translate.html',
                controller: 'grammarTranslateCtrl'
            })
            .when('/:lessonId/4/read', {
                templateUrl: 'grammar/read.html',
                controller: 'grammarReadCtrl'
            })
            .when('/:lessonId/4/word1', {
                templateUrl: 'grammar/word.html',
                controller: 'grammarWordCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);

totaln4App.service('dataService', function($http) {
    this.promise = $http({
        method: "GET",
        url: "../../data/totaln4/vocab/n4vocab_v2.0.json"
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

totaln4App.controller('rootController', function($scope) {
    $scope.rootPlay = function(data, course, step, id) {
        var selId = "choices-" + step + "-" + id;
        var audioSrc = document.getElementById(selId).getElementsByTagName('source');
        $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
        document.getElementById(selId).load();
        document.getElementById(selId).play();
    }
});
