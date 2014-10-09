var mobi = angular.module('mobiRoot', ['ngRoute', 'ionic', 'mobiCtrl']);

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
            .when('/:degree/:course/:lessonId/:subid/word', {
                templateUrl: 'connect.html',
                controller: 'connectCtrl'
            })
            .otherwise({
                redirectTo: '/n5'
            });
    }
]);

mobi.controller('rootCtrl', function($scope, $ionicSideMenuDelegate, $routeParams) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.toggleRight = function() {
        $ionicSideMenuDelegate.toggleRight();
    };
});
