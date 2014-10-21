var app = angular.module('kanjinApp', ['ngRoute', 'kanjinCtrls', 'commonCtrls', 'akrSharedDirectives']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/:degree', {
                controller: 'mainCtrl',
                templateUrl: function(url) {
                    var valid = ["n5", "n4"];
                    if (valid.indexOf(url.degree) != -1) {
                        return 'main.html';
                    } else {
                        return '../../view/_shared/error.html';
                    }
                }
            })
            .when('/:degree/testout/:type/:lessonId', {
                templateUrl: 'testout.html',
                controller: 'testoutCtrl',
                resolve: {
                    testoutData: function($q, dataService, $route) {
                        var deferred = $q.defer();
                        $q.all(dataService.getTestoutPromise($route.current.params.degree)).then(function(response) {
                            deferred.resolve(response);
                        });
                        return deferred.promise;
                    }
                }
            })
            .when('/:degree/:lessonId', {
                controller: 'subCtrl',
                templateUrl: 'subtopic.html',
            })
            .when('/:degree/:lessonId/:partId/learn', {
                templateUrl: 'learn.html',
                controller: 'learnCtrl'
            })
            .when('/:degree/:lessonId/:partId/picture', {
                templateUrl: 'picture.html',
                controller: 'pictureCtrl'
            })
            .when('/:degree/:lessonId/:partId/word', {
                templateUrl: 'word.html',
                controller: 'wordCtrl'
            })
            .when('/:degree/:lessonId/:partId/connect', {
                templateUrl: 'connect.html',
                controller: 'connectCtrl'
            })
            .otherwise({
                redirectTo: '/n5'
            });
    }
]);


app.service('dataService', function($http) {
    this.n4Kanji = $http({
        method: "GET",
        url: "../../data/kanjin4/json/n4kanji.json"
    });

    this.n5Kanji = $http({
        method: "GET",
        url: "../../data/kanjin5/json/n5kanji.json"
    });

    this.filter = function(data, key1, lessonId, key2, partId) {
        var uniqueGroups = [];
        $.each(data, function(idx, val) {
            if (data[idx][key1] == lessonId && data[idx][key2] == partId) {
                uniqueGroups.push(data[idx]);
            }
        });
        return uniqueGroups;
    };

    this.getDataPromise = function(course, lessonId, subId, skill) {
        switch (course) {
            case "kanjin4":
                return this.n4Kanji;
                break;
            case "kanjin5":
                return this.n5Kanji;
                break
            default:
                return null;
                break;
        }
    };

    this.getTestoutPromise = function(degree) {
        var promise = [];
        switch (degree) {
            case "n5":
                promise.push(this.n5Kanji)
                break;
            case "n4":
                promise.push(this.n5Kanji);
                break;
        }
        return promise;
    }


    /**
     * Return an array of 30 question item
     * an question item include: {type:'vocabwrite[vocabpic|vocabword|vocablisten|grammarlisten|grammarchoice|grammartranslate|grammarread|grammarword], data: '...'}
     * @param  {[type]} data     [description]
     * @param  {[type]} type     [description]
     * @param  {[type]} lessonId [description]
     * @return {[type]}          [description]
     */
    this.getTestoutData = function(data, type, lessonId) {
        var ret = [];
        var vocabPool = mergeData(data[0].data, type, lessonId, "topic");
        var recipe = [{
            "type": "kanjilearn",
            "number": 10,
            "datapool": vocabPool
        }, {
            "type": "kanjipic",
            "number": 10,
            "datapool": vocabPool
        }, {
            "type": "kanjiword",
            "number": 10,
            "datapool": vocabPool
        }];

        //Recipe for 30 question randomize:
        //Vocab: 3 vocab learn, 3 vocab pic, 4 vocab word, 5 vocab listen, 3 grammar listen, 3 grammar choice, 3 grammar translate, 3 grammar read, 3 grammarword
        var randIdx;
        angular.forEach(recipe, function(value, key) {
            for (var i = 0; i < value.number; i++) {
                randIdx = Math.floor(Math.random() * value.datapool.length);
                ret.push({
                    type: value.type,
                    data: value.datapool[randIdx]
                });
            };
        });

        // return akiraShuffle2(ret);
        return ret;
    }
});

app.service('restService', function($http) {
    this.n4Star = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=kanjin4&userid=" + getUser().id
    });

    this.n5Star = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=kanjin5&userid=" + getUser().id
    });


    this.getRestPromise = function(course) {
        switch (course) {
            case "kanjin4":
                return this.n4Star;
                break;
            case "kanjin5":
                return this.n5Star;
                break
            default:
                return null;
                break;
        }
    }

});



app.controller('root', function($scope, $routeParams, $route, $http, $window) {
    $scope.rootPlay = function(data, course, step, id) {
        var selId = "choices-" + step + "-" + id;
        var audioSrc = document.getElementById(selId).getElementsByTagName('source');
        $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
        document.getElementById(selId).load();
        document.getElementById(selId).play();
    }

    $scope.check = function(degree, lesson) {
        //Get current key point for this courses
        $http({
            method: "GET",
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_user_info.php?key=kanji" + degree + "&userid=" + getUser().id
        }).success(function(data, status) {
            if (akrParseInt(data) >= (lesson - 1)) {
                $window.location.href = "#/" + degree + "/" + lesson;
            } else {
                alert(i18n.t("message.info.keypoint"));
            }
        });
    };

    $scope.pass = function(degree, type, lesson) {
        //Firstly check if user have enough day_remain or not
        $http({
            method: "GET",
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_user_info.php?key=day_remain&userid=" + getUser().id
        }).success(function(data, status) {
            if (akrParseInt(data) > 0) {
                $window.location.href = "#/" + degree + "/testout/" + type + "/" + lesson;
            } else {
                alert(i18n.t("message.info.buy"));
            }
        });
    };

    $scope.$on('$routeChangeStart', function(scope, next, curr) {
        $scope.isLoading = "true";
    });

    $scope.$on('$routeChangeSuccess', function(scope, next, curr) {
        $scope.isLoading = "false";
    });
});

app.factory('menuFactory', function($rootScope) {
    var navgroup = 0;
    var nav = 1;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
})
