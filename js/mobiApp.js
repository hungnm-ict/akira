var mobi = angular.module('mobiRoot', ['ngRoute', 'ionic', 'mobiCtrl']);

mobi.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/:degree', {
                templateUrl: function(urlAttr) {
                    switch (urlAttr.degree) {
                        case "n5":
                            return 'n5.html';
                            break;
                        case "n4":
                            return 'n4.html';
                            break;
                        default:
                            return '../../view/_shared/error.html';
                            break;
                    }
                },
                controller: 'mainCtrl'
            }).otherwise({
                redirectTo: '/n5'
            });
    }
]);

mobi.controller('rootCtrl', function($scope) {
    $scope.test = "alo";
})
