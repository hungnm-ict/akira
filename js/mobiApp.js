var mobi = angular.module('mobiRoot', ['ngRoute', 'ionic', 'mobiCtrl', 'commonCtrls', 'akrSharedDirectives']);

mobi.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider
            .when('/:degree', {
                templateUrl: function(urlAttr) {
                    switch (urlAttr.degree) {
                        case "n5":
                            return 'n5.html';
                            break;
                        case "n4":
                            return 'n4.html';
                            break;
                        default:
                            return '../../view/_shared/error.html';
                            break;
                    }
                },
                controller: 'mainCtrl'
            })
            .when('/:degree/:course/:lessonId', {
                templateUrl: function(urlAttr) {
                    switch (urlAttr.course) {
                        case "kana":
                            if (urlAttr.lessonId == 1 || urlAttr.lessonId == 2)
                                return 'hiraSub.html';
                            if (urlAttr.lessonId == 3 || urlAttr.lessonId == 4)
                                return 'kataSub.html';
                            break;
                        case "total":
                            return "totalSub.html";
                            break;
                        case "kanji":
                            return "kanjiSub.html";
                            break;
                        default:
                            return '../../view/_shared/error.html';
                            break;
                    }
                },
                controller: 'subCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/learn', {
                templateUrl: 'learn.html',
                controller: 'learnCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/picture', {
                templateUrl: 'picture.html',
                controller: 'pictureCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/word', {
                templateUrl: 'word.html',
                controller: 'wordCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/listen', {
                templateUrl: 'listen.html',
                controller: 'listenCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/connect', {
                templateUrl: 'connect.html',
                controller: 'connectCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/choice', {
                templateUrl: 'choice.html',
                controller: 'choiceCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/translate', {
                templateUrl: 'translate.html',
                controller: 'translateCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/read', {
                templateUrl: 'read.html',
                controller: 'readCtrl'
            })
            .when('/:degree/:course/:lessonId/:subid/write', {
                templateUrl: 'write.html',
                controller: 'writeCtrl'
            })
            .otherwise({
                redirectTo: '/n5'
            });
    }
]);


mobi.service('mobiService', function($http) {
    //Data for totaln5
    this.kanaPromise = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/n5vocab_v2.0.json"
    });

    this.totalN5Promise = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/n5vocab_v2.0.json"
    });

    this.kanjiN5Promise = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/n5vocab_v2.0.json"
    });


    this.totalN4Promise = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/n5vocab_v2.0.json"
    });

    this.kanjiN4Promise = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/n5vocab_v2.0.json"
    });

    this.getPromise = function(degree, course) {
        return this.totalN5Promise;
        switch (degree) {
            case "n5":
                switch (course) {
                    case "kana":
                        return kanaPromise;
                        break;
                    case "total":
                        return totalN5Promise;
                        break;
                    case "kanji":
                        return kanjiN5Promise;
                        break;
                    default:
                        return null;
                        break;
                }
                break;
            case "n4":
                switch (course) {
                    case "total":
                        return totalN4Promise;
                        break;
                    case "kanji":
                        return kanjiN4Promise;
                        break;
                    default:
                        return null;
                        break;
                }
                break;
            default:
                return null;
                break;
        }
    };

    this.filterData = function(data, lessonId, subtopic) {
        var uniqueGroups = [];
        $.each(data, function(idx, val) {
            if (data[idx]["topic"] == lessonId && data[idx]["sub"] == subtopic) {
                uniqueGroups.push(data[idx]);
            }
        });
        return uniqueGroups;
    }

});

mobi.controller('rootCtrl', function($scope, $ionicSideMenuDelegate, $routeParams, $ionicSlideBoxDelegate) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.toggleRight = function() {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.rootPlay = function(degree, course, lesson, sub, skill, audioTagId, playSpeed) {

    };
});
