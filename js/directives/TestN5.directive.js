var direct = angular.module('directiveModule', []);

direct.directive('akrmodel', function() {

    return {
        restrict: 'EAC',
        template: "Akr Model Directive Seperated in module example"
    }
});
