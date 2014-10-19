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
            })
            .when('/testout/:type/:lessonId', {
                templateUrl: 'testout.html',
                controller: 'testoutCtrl',
                resolve: {
                    testoutData: function($q, dataService) {
                        var deferred = $q.defer();
                        $q.all(dataService.getTestoutPromise()).then(function(response) {
                            deferred.resolve(response);
                        });
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
            .when('/:lessonId/:partId/write', {
                templateUrl: 'write.html',
                controller: 'kanaWriteCtrl'
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
                        return this.kana1;
                        break;
                }
                break;
            default:
                return null;
                break;
        }
    }

    this.getTestoutPromise = function() {
        var promise = [this.n5Vocab, this.n5Grammar1, this.n5Grammar2, this.n5Grammar3, this.n5Grammar4, this.n5Grammar5];
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
    // this.n5Star = $http({
    //     method: "GET",
    //     url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=totaln5&userid=" + getUser().id
    // });

    this.kanaStar = $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=kana&userid=" + getUser().id
    });

    this.getRestPromise = function(course) {
        switch (course) {
            // case "totaln5":
            //     return this.n5Star;
            //     break;
            case "kana":
                return this.kanaStar;
                break;
            default:
                return null;
                break;
        }
    }

});


totaln5App.controller('rootController', function($scope, $timeout, $http, $window,$sce) {
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
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_user_info.php?key=kana&userid=" + getUser().id
        }).success(function(data, status) {
            if (akrParseInt(data) > lesson) {
                console.info("Ban du keypoint de hoc bai nay");
                $window.location.href = "#/" + lesson;
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
                $window.location.href = "#/testout/" + type + "/" + lesson;
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
    var nav = 0;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
})
