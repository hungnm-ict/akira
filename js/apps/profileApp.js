var app = angular.module('profileApp', ['profileCtrl', 'ngRoute', 'commonCtrls', 'akrSharedDirectives']);

app.config(['$routeProvider',
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
            }).otherwise({
                redirectTo: '/'
            });
    }
]);
app.factory('menuFactory', function($rootScope) {
    var navgroup = null;
    var nav = null;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
})
