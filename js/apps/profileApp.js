var app = angular.module('profileApp', ['profileCtrl', 'ngRoute', 'commonCtrls', 'akrSharedDirectives']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainCtrl'
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
