var testN5App = angular.module('testN5App', ['ui.router', 'totalCtrls']);

testN5App.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: "main.html",
            controller: 'mainCtrl'
        })
        .state('game', {
            url: "/game",
            templateUrl: "game.html",
            controller: 'gameCtrl'
        });
});
