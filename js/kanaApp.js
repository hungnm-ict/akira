var kanaApp = angular.module('totaln5App', ['ngRoute', 'kanaCtrls', 'commonCtrls', 'akrSharedDirectives', 'akrUtilService']);

kanaApp.config(['$routeProvider',
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
                    }
                }
            })
            .when('/:lessonId', {
                controller: 'subCtrl',
                templateUrl: function(urlattr) {
                    if (urlattr.lessonId == 1 || urlattr.lessonId == 2)
                        return '../kana/hirasub.html';

                    if (urlattr.lessonId == 3 || urlattr.lessonId == 4)
                        return '../kana/katasub.html';
                },
                resolve: {
                    kanaStar: function($q, restService) {
                        var deferred = $q.defer();
                        deferred.resolve(restService.getRestPromise("kana"));
                        return deferred.promise;
                    }
                }
            })
            .when('/:lessonId/:partId/learn', {
                templateUrl: 'learn.html',
                controller: 'kanaLearnCtrl'
            })
            .when('/:lessonId/:partId/picture', {
                templateUrl: 'picture.html',
                controller: 'kanaPictureCtrl'
            })
            .when('/:lessonId/:partId/word', {
                templateUrl: 'word.html',
                controller: 'kanaWordCtrl'
            })
            .when('/:lessonId/:partId/connect', {
                templateUrl: 'connect.html',
                controller: 'kanaConnectCtrl'
            })
            .when('/:lessonId/:partId/write', {
                templateUrl: 'write.html',
                controller: 'kanaWriteCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);

kanaApp.service('dataService', function($http) {

    this.kana1 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_1.json"
    });

    this.kana2 = $http({
        method: "GET",
        url: "../../data/kana/json/kana_2.json"
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

kanaApp.service('restService', function($http, $q) {
    this.getRestPromise = function(course) {
        switch (course) {
            case "kana":
                return $http({
                    method: "GET",
                    url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=kana&userid=" + getUser().id
                });
                break;
            default:
                return null;
                break;
        }
    }
});

kanaApp.controller('rootController', function($scope,  $http, $window, $sce, authService, $route, $location) {
    $scope.rootPlay = function(data, course, step, id) {
        try {
            var selId = "choices-" + step + "-" + id;
            var audioSrc = document.getElementById(selId).getElementsByTagName('source');
            $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
            document.getElementById(selId).load();
            document.getElementById(selId).play();
        } catch (err) {
            console.error(err);
        }
    };

    $scope.$on('$routeChangeStart', function(scope, next, curr) {
        $scope.isLoading = "true";
    });

    $scope.$on('$routeChangeSuccess', function(scope, next, curr) {
        $scope.isLoading = "false";
    });

    $scope.$on('$locationChangeStart', function(event, next, curr) {
        //We will do validation here
        if (authService.isAuth()) {
            if (!authService.hasViewAuth()) {
                event.preventDefault();
                window.location.href="/akira/view/total";
            }
        } else {
            window.location.href = "/";
        }
    });
});

kanaApp.factory('menuFactory', function($rootScope) {
    var navgroup = 0;
    var nav = 0;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
});
