var totaln5App = angular.module('totaln5App', ['ngRoute', 'totaln5Ctrls', 'totaln5Directives', 'commonCtrls', 'akrSharedDirectives']);

totaln5App.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/:degree', {
                templateUrl: 'main.html',
                controller: 'mainCtrl',
                resolve: {
                    totalStar: function($q, restService, $routeParams, $route) {
                        var deferred = $q.defer();
                        deferred.resolve(restService.getRestPromise($route.current.params.degree));
                        return deferred.promise;
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
                templateUrl: function(urlAttr) {
                    return 'subtopic.html';
                },
                controller: 'subCtrl'
            })
            .when('/:degree/:lessonId/:partId/write', {
                templateUrl: 'vocab/write.html',
                controller: 'writeCtrl',
                resolve: {
                    writeData: function($q, $route, dataService) {
                        var deferred = $q.defer();
                        deferred.resolve(dataService.getDataPromise("total" + $route.current.params.degree, $route.current.params.lessonId, $route.current.params.partId, 1));
                        return deferred.promise;
                    }
                }
            })
            .when('/:degree/:lessonId/:partId/picture', {
                templateUrl: 'vocab/picture.html',
                controller: 'pictureCtrl'
            })
            .when('/:degree/:lessonId/:partId/word', {
                templateUrl: 'vocab/word.html',
                controller: 'wordCtrl'
            })
            .when('/:degree/:lessonId/:partId/listen', {
                templateUrl: 'vocab/listen.html',
                controller: 'listenCtrl'
            })
            .when('/:degree/:lessonId/:partId/connect', {
                templateUrl: 'vocab/connect.html',
                controller: 'connectCtrl'
            })
            .when('/:degree/:lessonId/:partId/listen1', {
                templateUrl: 'grammar/listen.html',
                controller: 'grammarListenCtrl'
            })
            .when('/:degree/:lessonId/:partId/choice', {
                templateUrl: 'grammar/choice.html',
                controller: 'grammarChoiceCtrl'
            })
            .when('/:degree/:lessonId/:partId/translate', {
                templateUrl: 'grammar/translate.html',
                controller: 'grammarTranslateCtrl'
            })
            .when('/:degree/:lessonId/:partId/read', {
                templateUrl: 'grammar/read.html',
                controller: 'grammarReadCtrl'
            })
            .when('/:degree/:lessonId/:partId/word1', {
                templateUrl: 'grammar/word.html',
                controller: 'grammarWordCtrl'
            })
            .otherwise({
                redirectTo: '/n5'
            });
    }
]);

totaln5App.service('dataService', function($http) {
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

    this.n4Vocab = $http({
        method: "GET",
        url: "../../data/totaln4/vocab/json/n4vocab.json"
    });

    this.n4Grammar1 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type1.json"
    });

    this.n4Grammar2 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type2.json"
    });

    this.n4Grammar3 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type3.json"
    });

    this.n4Grammar4 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type4.json"
    });

    this.n4Grammar5 = $http({
        method: "GET",
        url: "../../data/totaln4/grammar/json/type5.json"
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
            case "totaln4":
                switch (subId) {
                    case "1":
                    case "2":
                    case "3":
                        return this.n4Vocab;
                        break;
                    case "4":
                        switch (skill) {
                            case 1:
                                return this.n4Grammar1;
                                break;
                            case 2:
                                return this.n4Grammar2;
                                break;
                            case 3:
                                return this.n4Grammar3;
                                break;
                            case 4:
                                return this.n4Grammar4;
                                break;
                            case 5:
                                return this.n4Grammar5;
                                break;
                            default:
                                return null;
                                break;
                        }
                        break;
                }
                break;
            default:
                return null;
                break;
        }
    }

    this.getTestoutPromise = function(degree) {
        switch (degree) {
            case "n5":
                return [this.n5Vocab, this.n5Grammar1, this.n5Grammar2, this.n5Grammar3, this.n5Grammar4, this.n5Grammar5];
                break;
            case "n4":
                return [this.n4Vocab, this.n4Grammar1, this.n4Grammar2, this.n4Grammar3, this.n4Grammar4, this.n4Grammar5];
                break;
            default:
                return null;
        }
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
        var grammar1Pool = mergeData(data[1].data, type, lessonId, "id");
        var grammar2Pool = mergeData(data[2].data, type, lessonId, "id");
        var grammar3Pool = mergeData(data[3].data, type, lessonId, "id");
        var grammar4Pool = mergeData(data[4].data, type, lessonId, "id");
        var grammar5Pool = mergeData(data[5].data, type, lessonId, "id");
        var recipe = [{
            "type": "vocablearn",
            "number": 3,
            "datapool": vocabPool
        }, {
            "type": "vocabpic",
            "number": 3,
            "datapool": vocabPool
        }, {
            "type": "vocabword",
            "number": 4,
            "datapool": vocabPool
        }, {
            "type": "vocablisten",
            "number": 5,
            "datapool": vocabPool
        }, {
            "type": "grammarlisten",
            "number": 3,
            "datapool": grammar1Pool
        }, {
            "type": "grammarchoice",
            "number": 3,
            "datapool": grammar2Pool
        }, {
            "type": "grammartranslate",
            "number": 3,
            "datapool": grammar3Pool
        }, {
            "type": "grammarread",
            "number": 3,
            "datapool": grammar4Pool
        }, {
            "type": "grammarword",
            "number": 3,
            "datapool": grammar5Pool
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

totaln5App.service('restService', function($http) {
    this.n5Star = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=totaln5&userid=" + getUser().id
    });

    this.n4Star = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=totaln4&userid=" + getUser().id
    });

    this.getRestPromise = function(course) {
        switch (course) {
            case "n5":
                return this.n5Star;
                break;
            case "n4":
                return this.n4Star;
                break;
            default:
                return null;
                break;
        }
    }
});

totaln5App.controller('rootController', function($scope, $timeout, $http, $window, $sce, $routeParams) {

    /**
     * Play sound for common game
     * @param  {[type]} data   : Data array for game
     * @param  {[type]} course : Path on the data folder
     * @param  {[type]} step   : Current step on jQuery Smart Wizard
     * @param  {[type]} id     :
     * @param  {[type]} speed  : Audio speed: 1/0.5
     * @return {[type]}        [description]
     */
    $scope.rootPlay = function(data, course, step, id, speed) {
        try {
            var selId = "choices-" + step + "-" + id;
            var audioSrc = document.getElementById(selId).getElementsByTagName('source');
            $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
            document.getElementById(selId).load();
            document.getElementById(id).playbackRate = speed;
            document.getElementById(selId).play();
        } catch (err) {
            console.error(err);
        }
    };

    $scope.testoutPlay = function(data, course, step, id) {
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

    $scope.check = function(lesson) {
        //Get current key point for this courses
        $http({
            method: "GET",
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_user_info.php?key=total" + $routeParams.degree + "&userid=" + getUser().id
        }).success(function(data, status) {
            if (akrParseInt(data) >= (lesson - 1)) {
                console.info("Ban du keypoint de hoc bai nay");
                $window.location.href = "#/" + $routeParams.degree + "/" + lesson;
            } else {
                alert(i18n.t("message.info.keypoint"));
            }
        });
    };

    $scope.pass = function(type, lesson) {
        //Firstly check if user have enough day_remain or not
        $http({
            method: "GET",
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_user_info.php?key=day_remain&userid=" + getUser().id
        }).success(function(data, status) {
            if (akrParseInt(data) > 0) {
                console.log("Ban con ngay su dung va co the choi phan nay");
                $window.location.href = "#/" + $routeParams.degree + "/testout/" + type + "/" + lesson;
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

totaln5App.factory('menuFactory', function($rootScope) {
    var navgroup = 0;
    var nav = 1;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
})
