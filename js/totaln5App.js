var totaln5App = angular.module('totaln5App', ['ngRoute', 'totaln5Ctrls', 'totaln5Directives', 'commonCtrls', 'akrSharedDirectives']);

totaln5App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: function(urlAttr) {
                    return 'main.html';
                },
                controller: 'mainCtrl',
                resolve: {
                    kanaStar: function($q, restService) {
                        var deferred = $q.defer();
                        deferred.resolve(restService.getRestPromise("kana"));
                        return deferred.promise;
                    },
                    totalStar: function($q, restService) {
                        var deferred = $q.defer();
                        deferred.resolve(restService.getRestPromise("totaln5"));
                        return deferred.promise;
                    }
                }
            })
            .when('/kana/:lessonId', {
                controller: 'kanaCtrl',
                templateUrl: function(urlattr) {
                    if (urlattr.lessonId == 1 || urlattr.lessonId == 2)
                        return 'kana/hirasub.html';

                    if (urlattr.lessonId == 3 || urlattr.lessonId == 4)
                        return 'kana/katasub.html';
                },
            })
            .when('/kana/:lessonId/:partId/learn', {
                templateUrl: 'kana/learn.html',
                controller: 'kanaLearnCtrl'
            })
            .when('/kana/:lessonId/:partId/picture', {
                templateUrl: 'kana/picture.html',
                controller: 'kanaPictureCtrl'
            })
            .when('/kana/:lessonId/:partId/word', {
                templateUrl: 'kana/word.html',
                controller: 'kanaWordCtrl'
            })
            .when('/kana/:lessonId/:partId/connect', {
                templateUrl: 'kana/connect.html',
                controller: 'kanaConnectCtrl'
            })
            .when('/kana/:lessonId/:partId/write', {
                templateUrl: 'kana/write.html',
                controller: 'kanaWriteCtrl'
            })
            .when('/:lessonId', {
                templateUrl: function(urlAttr) {
                    return 'subtopic.html';
                },
                controller: 'subCtrl'
            })
            .when('/:lessonId/:partId/write', {
                templateUrl: 'vocab/write.html',
                controller: 'writeCtrl',
                resolve:{
                    writeData:function($q,$route,dataService){
                        var deferred = $q.defer();
                        deferred.resolve(dataService.getDataPromise("totaln5", $route.current.params.lessonId, $route.current.params.partId, 1));
                        return deferred.promise;
                    }
                }
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


totaln5App.service('dataService', function($http) {

    this.kana1 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_1.json"
    });

    this.kana2 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_2.json"
    });

    this.n5Vocab = $http({
        method: "GET",
        url: "../../data/totaln5/vocab/json/n5vocab.json"
    });

    this.n5Grammar1 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type1.json"
    });

    this.n5Grammar2 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type2.json"
    });

    this.n5Grammar3 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type3.json"
    });

    this.n5Grammar4 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type4.json"
    });

    this.n5Grammar5 = $http({
        method: "GET",
        url: "../../data/totaln5/grammar/json/type5.json"
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
            case "totaln5":
                switch (subId) {
                    case "1":
                    case "2":
                    case "3":
                        return this.n5Vocab;
                        break;
                    case "4":
                        switch (skill) {
                            case 1:
                                return this.n5Grammar1;
                                break;
                            case 2:
                                return this.n5Grammar2;
                                break;
                            case 3:
                                return this.n5Grammar3;
                                break;
                            case 4:
                                return this.n5Grammar4;
                                break;
                            case 5:
                                return this.n5Grammar5;
                                break;
                            default:
                                return null;
                                break;
                        }
                        break;
                }
                break;
            case "kana":
                switch (lessonId) {
                    case "1":
                    case "3":
                        return this.kana1;
                        break;
                    case "2":
                    case "4":
                        return this.kana2;
                        break;
                }
                break;
            default:
                return null;
                break;
        }
    }
});

totaln5App.service('restService', function($http) {
    this.n5Star = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=totaln5&userid=" + getUser().id
    });

    this.kanaStar = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=kana&userid=" + getUser().id
    });

    this.getRestPromise = function(course) {
        switch (course) {
            case "totaln5":
                return this.n5Star;
                break;
            case "kana":
                return this.kanaStar;
                break;
            default:
                return null;
                break;
        }
    }

});


totaln5App.controller('rootController', function($scope) {
    $scope.rootPlay = function(data, course, step, id) {
        var selId = "choices-" + step + "-" + id;
        var audioSrc = document.getElementById(selId).getElementsByTagName('source');
        $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
        document.getElementById(selId).load();
        document.getElementById(selId).play();
    }
});
