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
                    var validType = ["0", "1", "2", "3"];
                    var validTime = ["10", "20", "30"];

                    if (validCourse.indexOf(urlAttrs.degree) != -1 && validType.indexOf(urlAttrs.type) != -1 && validTime.indexOf(urlAttrs.min) != -1) {
                        return 'game.html';
                    } else {
                        return '../../view/_shared/error.html';
                    }
                },
                resolve: {
                    data: function($q, dataService, $route, $log) {
                        var deferred = $q.defer();

                        //Filter list các promise object trả về từ dataService
                        var dataPromise = dataService.getDataPromise($route.current.params.degree, $route.current.params.type);

                        //Chờ cho đến khi tất cả các promise đã được resolve
                        $q.all(dataPromise).then(function(response) {
                            //Resolve object
                            deferred.resolve(response);
                        });

                        return deferred.promise;
                    },
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

testApp.service('dataService', function($http, $log) {
    /*===============================
    =            N4 data            =
    ===============================*/

    /*=================================
    =            N4- vocab            =
    =================================*/
    this.n4vocab1 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_1.json"
    });

    this.n4vocab2 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_2.json"
    });

    this.n4vocab3 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_3.json"
    });

    this.n4vocab4 = $http({
        method: "GET",
        url: "../../data/testn4/json/vocab_4.json"
    });

    /*==================================
    =            N4-Grammar            =
    ==================================*/

    this.n4grammar1 = $http({
        method: "GET",
        url: "../../data/testn4/json/grammar_1.json"
    });

    this.n4grammar2 = $http({
        method: "GET",
        url: "../../data/testn4/json/grammar_2.json"
    });

    this.n4grammar3 = $http({
        method: "GET",
        url: "../../data/testn4/json/grammar_3.json"
    });

    /*===============================
    =            N4-Read            =
    ===============================*/

    this.n4read1 = $http({
        method: "GET",
        url: "../../data/testn4/json/read_1.json"
    });

    this.n4read2 = $http({
        method: "GET",
        url: "../../data/testn4/json/read_2.json"
    });

    this.n4read3 = $http({
        method: "GET",
        url: "../../data/testn4/json/read_3.json"
    });

    this.n4write1 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_1.json"
    });

    this.n4write2 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_2.json"
    });

    this.n4write3 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_3.json"
    });

    this.n4write4 = $http({
        method: "GET",
        url: "../../data/testn4/json/write_4.json"
    });

    /*-----  End of N4 data  ------*/


    /*===============================
    =            N5 data            =
    ===============================*/
    /*=================================
    =            N4- vocab            =
    =================================*/

    this.n5vocab1 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_1.json "
    });

    this.n5vocab2 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_2.json"
    });

    this.n5vocab3 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_3.json"
    });

    this.n5vocab4 = $http({
        method: "GET",
        url: "../../data/testn5/json/vocab_4.json"
    });

    /*==================================
    =            n5-Grammar            =
    ==================================*/

    this.n5grammar1 = $http({
        method: "GET",
        url: "../../data/testn5/json/grammar_1.json"
    });

    this.n5grammar2 = $http({
        method: "GET",
        url: "../../data/testn5/json/grammar_2.json"
    });

    this.n5grammar3 = $http({
        method: "GET",
        url: "../../data/testn5/json/grammar_3.json"
    });

    /*===============================
    =            n5-Read            =
    ===============================*/

    this.n5read1 = $http({
        method: "GET",
        url: "../../data/testn5/json/read_1.json"
    });

    this.n5read2 = $http({
        method: "GET",
        url: "../../data/testn5/json/read_2.json"
    });

    this.n5read3 = $http({
        method: "GET",
        url: "../../data/testn5/json/read_3.json"
    });

    this.n5write1 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_1.json"
    });

    this.n5write2 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_2.json"
    });

    this.n5write3 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_3.json"
    });

    this.n5write4 = $http({
        method: "GET",
        url: "../../data/testn5/json/write_4.json"
    });

    /*-----  End of N5 data  ------*/
    this.getDataPromise = function(degree, type) {
        switch (degree) {
            case "n5":
                switch (type) {
                    case "0":
                        var promiseSet = [];
                        promiseSet.push(this.n5vocab1);
                        promiseSet.push(this.n5vocab2);
                        promiseSet.push(this.n5vocab3);
                        promiseSet.push(this.n5vocab4);
                        return promiseSet;
                        break;
                    case "1":
                        var promiseSet = [];
                        promiseSet.push(this.n5grammar1);
                        promiseSet.push(this.n5grammar2);
                        promiseSet.push(this.n5grammar3);
                        // promiseSet.push(this.n5grammar4);
                        return promiseSet;
                        break;
                    case "2":
                        var promiseSet = [];
                        promiseSet.push(this.n5read1);
                        promiseSet.push(this.n5read2);
                        promiseSet.push(this.n5read3);
                        // promiseSet.push(this.n5read4);
                        return promiseSet;
                        break;
                    case "3":
                        var promiseSet = [];
                        promiseSet.push(this.n5write1);
                        promiseSet.push(this.n5write2);
                        promiseSet.push(this.n5write3);
                        promiseSet.push(this.n5write4);
                        return promiseSet;
                        break;
                    default:
                        return null;
                        break;
                }
                break;
            case "n4":
                switch (type) {
                    case "0":
                        var promiseSet = [];
                        promiseSet.push(this.n4vocab1);
                        promiseSet.push(this.n4vocab2);
                        promiseSet.push(this.n4vocab3);
                        promiseSet.push(this.n4vocab4);
                        return promiseSet;
                        break;
                    case "1":
                        var promiseSet = [];
                        promiseSet.push(this.n4grammar1);
                        promiseSet.push(this.n4grammar2);
                        promiseSet.push(this.n4grammar3);
                        // promiseSet.push(this.n4grammar4);
                        return promiseSet;
                        break;
                    case "2":
                        var promiseSet = [];
                        promiseSet.push(this.n4read1);
                        promiseSet.push(this.n4read2);
                        promiseSet.push(this.n4read3);
                        // promiseSet.push(this.n4read4);
                        return promiseSet;
                        break;
                    case "3":
                        var promiseSet = [];
                        promiseSet.push(this.n4write1);
                        promiseSet.push(this.n4write2);
                        promiseSet.push(this.n4write3);
                        promiseSet.push(this.n4write4);
                        return promiseSet;
                        break;
                    default:
                        return null;
                        break;
                }
                return promiseSet;
                break;
            default:
                return null;
                break;
        }
    }

    this.genDataSet = function(data, type, min) {
        // Vocab data rule set
        var vocabRule = [{
            "part": "1",
            "rule": {
                "10": "2",
                "20": "4",
                "30": "6"
            }
        }, {
            "part": "2",
            "rule": {
                "10": "2",
                "20": "3",
                "30": "5"
            }
        }, {
            "part": "3",
            "rule": {
                "10": "2",
                "20": "3",
                "30": "5"
            }
        }, {
            "part": "4",
            "rule": {
                "10": "1",
                "20": "2",
                "30": "3"
            }
        }];
        var grammarRule = [{
            "part": "1",
            "rule": {
                "10": "3",
                "20": "6",
                "30": "9"
            }
        }, {
            "part": "2",
            "rule": {
                "10": "1",
                "20": "2",
                "30": "3"
            }
        }, {
            "part": "3",
            "rule": {
                "10": "1",
                "20": "2",
                "30": "3"
            }
        }];
        var readRule = [{
            "part": "1",
            "rule": {
                "10": "1",
                "20": "1",
                "30": "2"
            }
        }, {
            "part": "2",
            "rule": {
                "10": "1",
                "20": "1",
                "30": "2"
            }
        }, {
            "part": "3",
            "rule": {
                "10": "0",
                "20": "1",
                "30": "1"
            }
        }];
        var writeRule = [{
            "part": "1",
            "rule": {
                "10": "1",
                "20": "2",
                "30": "3"
            }
        }, {
            "part": "2",
            "rule": {
                "10": "1",
                "20": "2",
                "30": "3"
            }
        }, {
            "part": "3",
            "rule": {
                "10": "1",
                "20": "2",
                "30": "3"
            }
        }, {
            "part": "4",
            "rule": {
                "10": "1",
                "20": "2",
                "30": "3"
            }
        }];

        var ret = [];
        switch (type) {
            case "0":
                angular.forEach(data, function(value, key) {
                    ret[key] = randTake(value.data, vocabRule[key]["rule"][min])
                });
                return ret;
                break;
            case "1":
                angular.forEach(data, function(value, key) {
                    ret[key] = randTake(value.data, grammarRule[key]["rule"][min])
                });
                return ret;
                break;
            case "2":
                angular.forEach(data, function(value, key) {
                    ret[key] = randTake(value.data, readRule[key]["rule"][min])
                });
                break;
            case "3":
                angular.forEach(data, function(value, key) {
                    ret[key] = randTake(value.data, writeRule[key]["rule"][min])
                });
                break;
            default:
                break;
        }
    }
});


testApp.factory('menuFactory', function($rootScope) {
    var navgroup = 0;
    var nav = 3;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
})
