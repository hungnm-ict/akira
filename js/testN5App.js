var testN5App = angular.module('testN5App', ['ngRoute', 'testN5Ctrls', 'testN5Directives', 'akrSharedDirectives','commonCtrls']);

testN5App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainCtrl'
            })
            .when('/game/:type/:min', {
                templateUrl: 'game.html',
                controller: 'gameCtrl'
            }).otherwise({
                redirectTo: '/'
            });
    }
]);

