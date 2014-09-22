var totaln5App = angular.module('totaln5App', ['ngRoute', 'totaln5Ctrls', 'totaln5Directives', 'commonCtrls', 'akrSharedDirectives']);


totaln5App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
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
