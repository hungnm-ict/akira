var akrDirectiveModule = angular.module("AKRShuffle", []);
akrDirectiveModule.directive('akrRepeatShuffle', function() {



    function link(scope, element, attrs) {}
    setTimeout(function() {
        $("#parent-wrapper div").shuffle();
    }, 200);

    return {
        restrict: 'A',
        link: link
    };
})
