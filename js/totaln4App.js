var totaln4App = angular.module('totaln4App', ['ngRoute', 'totaln4Ctrls', 'totaln4Directives', 'commonCtrls', 'akrSharedDirectives']);

totaln4App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
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

totaln4App.service('dataService', function($http) {
    this.n4Vocab = $http({
        method: "GET",
        url: "../../data/totaln4/vocab/json/n4vocab.json"
    });

    this.n4Grammar1 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type1.json"
    });

    this.n4Grammar2 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type2.json"
    });

    this.n4Grammar3 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type3.json"
    });

    this.n4Grammar4 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type4.json"
    });

    this.n4Grammar5 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type5.json"
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

    this.getDataPromise = function(course, lessonId, subId, skill) {
        switch (course) {
            case "totaln4":
                switch (subId) {
                    case "1":
                    case "2":
                    case "3":
                        return this.n4Vocab;
                        break;
                    case "4":
                        switch (skill) {
                            case 1:
                                return this.n4Grammar1;
                                break;
                            case 2:
                                return this.n4Grammar2;
                                break;
                            case 3:
                                return this.n4Grammar3;
                                break;
                            case 4:
                                return this.n4Grammar4;
                                break;
                            case 5:
                                return this.n4Grammar5;
                                break;
                            default:
                                return null;
                                break;
                        }
                        break;
                }
                break;
            default:
                return null;
                break;
        }
    }
});


totaln4App.service('restService', function($http) {
    this.n4Star = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=totaln4&userid=" + getUser().id
    });


    this.getRestPromise = function(course) {
        switch (course) {
            case "totaln4":
                return this.n4Star;
                break;
            default:
                return null;
                break;
        }
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
