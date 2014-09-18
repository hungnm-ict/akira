var akrProfileModule = angular.module("AKRProfile", []);

akrProfileModule.directive('akiraprofile', function() {
    function link(scope, element, attrs) {
		scope.mins=10;    	
        if (sessionStorage.hasOwnProperty("user")) {
            scope.user = JSON.parse(sessionStorage.getItem("user"));
        } else {
            scope.user = "Anonymous";
        }
    }
    return {
        restrict: 'E',
        link: link,
        templateUrl: '../../view/_shared/time.html'
    };
});
