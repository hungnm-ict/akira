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



app.controller('root', function($scope, $routeParams, $route) {
    //Default route to KanjiN5 menu
    // $scope.navgroup = 0;
    // $scope.nav = 1;

    $scope.update = function(navgroup, nav) {
        alert();
        $scope.navgroup = navgroup;
        $scope.nav = nav;
    }

    $scope.rootPlay = function(data, course, step, id) {
        var selId = "choices-" + step + "-" + id;
        var audioSrc = document.getElementById(selId).getElementsByTagName('source');
        $("audio#" + selId + " source").attr("src", "../../data/" + course + "/audio/" + data[step][id].filename + ".mp3");
        document.getElementById(selId).load();
        document.getElementById(selId).play();
    }
});

app.service('selectedMenu', function($scope) {

});
