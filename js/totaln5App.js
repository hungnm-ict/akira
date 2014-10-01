var totaln5App = angular.module('totaln5App', ['ngRoute', 'totaln5Ctrls', 'totaln5Directives', 'commonCtrls', 'akrSharedDirectives']);

totaln5App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainCtrl'
            })
            // .when('/hira/:lessonId', {
            //     templateUrl: 'kana/hirasub.html',
            //     controller: 'hiraCtrl'
            // })
            .when('/kana/:lessonId/:partId/learn', {
                templateUrl: 'kana/hira/learn.html',
                controller: 'hiraLearnCtrl'
            })
            .when('/hira/:lessonId/:partId/picture', {
                templateUrl: 'kana/hira/picture.html',
                controller: 'hiraPictureCtrl'
            })
            .when('/hira/:lessonId/:partId/word', {
                templateUrl: 'kana/hira/word.html',
                controller: 'hiraWordCtrl'
            })
            .when('/hira/:lessonId/:partId/connect', {
                templateUrl: 'kana/hira/connect.html',
                controller: 'hiraConnectCtrl'
            })
            .when('/hira/:lessonId/:partId/write', {
                templateUrl: 'kana/hira/write.html',
                controller: 'hiraWriteCtrl'
            })
            // .when('/kata/:lessonId', {
            //     templateUrl: 'kana/katasub.html',
            //     controller: 'kataCtrl'
            // })
            // .when('/kata/:lessonId/:partId/learn', {
            //     templateUrl: 'kana/kata/learn.html',
            //     controller: 'kataLearnCtrl'
            // }).when('/kata/:lessonId/:partId/picture', {
            //     templateUrl: 'kana/kata/picture.html',
            //     controller: 'kataPictureCtrl'
            // })
            // .when('/kata/:lessonId/:partId/word', {
            //     templateUrl: 'kana/kata/word.html',
            //     controller: 'kataWordCtrl'
            // })
            // .when('/kata/:lessonId/:partId/connect', {
            //     templateUrl: 'kana/kata/connect.html',
            //     controller: 'kataConnectCtrl'
            // })
            .when('/:lessonId', {
                templateUrl: 'subtopic.html',
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


totaln5App.service('dataService', function($http) {
    this.promise = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/n5vocab_v2.0.json"
    });

    this.kanaPromise1 = $http({
        method: "GET",
        url: "../../data/kana/kana_type1_v2.0.json"
    });

    this.kanaPromise2 = $http({
        method: "GET",
        url: "../../data/kana/kana_type1_v2.0.json"
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
