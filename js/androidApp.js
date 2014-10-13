var mobi = angular.module('mobileRoot', ['commonCtrls', 'akrSharedDirectives']);


mobi.factory('menuFactory', function($rootScope) {
    var navgroup = 3;
    var nav = 0;

    var menu = {
        "navgroup": navgroup,
        "nav": nav
    };

    return menu;
})
