// CuongDD: 11/10/2014
var toeic500App = angular.module('toeic500App', ['ngRoute', 'toeic500Ctrls', 'toeic500Directives', 'commonCtrls', 'akrSharedDirectives']);

toeic500App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: function(urlAttr) {
                    return 'main.html';
                },
                controller: 'mainCtrl'
            })
            .when('/:lessonId', {
                templateUrl: function(urlAttr) {
                    return 'subtopic.html';
                },
                controller: 'subCtrl'
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
            .when('/:lessonId/:partId/listen1', {
                templateUrl: 'grammar/listen.html',
                controller: 'grammarListenCtrl'
            })
            .when('/:lessonId/:partId/choice', {
                templateUrl: 'grammar/choice.html',
                controller: 'grammarChoiceCtrl'
            })
            .when('/:lessonId/:partId/translate', {
                templateUrl: 'grammar/translate.html',
                controller: 'grammarTranslateCtrl'
            })
            .when('/:lessonId/:partId/read', {
                templateUrl: 'grammar/read.html',
                controller: 'grammarReadCtrl'
            })
            .when('/:lessonId/:partId/word1', {
                templateUrl: 'grammar/word.html',
                controller: 'grammarWordCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);


toeic500App.service('dataService', function($http) {
    this.promise = $http({
        method: "GET",
        url: "../../data/toeic500/vocab/toeic500vocab.json"
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

    this.numOfSub = function(data, lessonId) {
        var currSub;
        var numOfSub = [];
        $.each(data, function(idx, val) {
            if (data[idx]["topic"] == lessonId) {
                if (currSub != data[idx]["sub"]) {
                    numOfSub.push(data[idx]["sub"]);
                    currSub = data[idx]["sub"];
                }
            }
        });
        console.log(numOfSub);
        return numOfSub;
    }
});

toeic500App.controller('rootController', function($scope) {
    $scope.rootPlay = function(data, course, step, id) {
        var selId = "choices-" + step + "-" + id;
        var audioSrc = document.getElementById(selId).getElementsByTagName('source');
        $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
        document.getElementById(selId).load();
        document.getElementById(selId).play();
    }
});


toeic500App.factory('menuFactory', function($rootScope) {
    var navgroup = 2;
    var nav = 0;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
})
