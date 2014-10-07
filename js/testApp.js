var testApp = angular.module('testApp', ['ngRoute', 'testCtrls', 'testDirectives', 'akrSharedDirectives', 'commonCtrls']);

testApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/:degree', {
                controller: 'mainCtrl',
                templateUrl: function(urlAttrs) {
                    var validCourse = ["n5", "n4"]
                    if (validCourse.indexOf(urlAttrs.degree) != -1) {
                        return 'main.html';
                    } else {
                        return '../../view/_shared/error.html';
                    }
                }
            })
            .when('/:degree/:type/:min', {
                controller: 'gameCtrl',
                templateUrl: function(urlAttrs) {
                    var validCourse = ["n5", "n4"]
                    var validType = ["1", "2", "3", "4"];
                    var validTime = ["10", "20", "30"];

                    if (validCourse.indexOf(urlAttrs.degree) != -1 && validType.indexOf(urlAttrs.type) != -1 && validTime.indexOf(urlAttrs.min) != -1) {
                        return 'game.html';
                    } else {
                        return '../../view/_shared/error.html';
                    }
                }
            }).otherwise({
                redirectTo: '/n5'
            });
    }
]);

testApp.controller('root', function($scope) {
    $scope.navgroup = 1;
    $scope.nav = 2;
})
