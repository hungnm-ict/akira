var akrSharedDirectives = angular.module("akrSharedDirectives", []);

akrSharedDirectives.directive('akrprofile', function() {
    function link(scope, element, attrs) {
        if (sessionStorage.hasOwnProperty("user")) {
            scope.user = JSON.parse(sessionStorage.getItem("user"));
        } else {
            scope.user = "Anonymous";
        }
    }
    return {
        restrict: 'E',
        link: link,
        templateUrl: '../../view/_shared/profileoverview.html'
    };
});


akrSharedDirectives.directive('akrleaderboard', function($http) {

    // Runs during compile
    var urlStr = "http://akira.edu.vn/wp-content/plugins/akira-api/akira_rank.php";

    function link(scope, element, attrs) {
        $http({
                method: "GET",
                url: urlStr
            })
            .success(function(data, status) {
                scope.rank = data;
            });
    }
    return {
        restrict: 'E',
        link: link,
        controller: function($scope, $sce) {
            $scope.renderHtml = function(e) {
                return $sce.trustAsHtml(e);
            }

            $scope.callChat = function(uname) {
                chatWith(uname);
            }
        },
        templateUrl: '../../view/_shared/leaderboard.html'
    };

});

akrSharedDirectives.directive('akirawizard', function() {
    function link(scope, element, attrs) {
        setTimeout(function() {
            //Jquery Smart Wizard
            $('#' + attrs.id).smartWizard({
                enableAllSteps: "true" === attrs.enablestep,
                keyNavigation: false,
                onLeaveStep: akrLeaveStep,
                onShowStep: akrShowStep,
                transitionEffect: 'slide'
            });
            $('#' + attrs.id + ' .actionBar').hide();
            changeLang();
            //Popover information
            $.each($('#' + attrs.id + " ul li").has("i.fa.fa-lock"), function(k, v) {
                $(v).popover();
            });

        }, 200);

    }

    return {
        restrict: 'A',
        link: link
    };
});

akrSharedDirectives.directive('akrlife', function() {
    function link(scope, element, attrs) {
        scope.ret = attrs.ret;
        attrs.$observe('life', function(value) {
            scope.life = attrs.life;
        });

        attrs.$observe('progress', function(value) {
            scope.progress = attrs.progress;
        });
    }

    return {
        restrict: 'E',
        link: link,
        templateUrl: '../../view/_shared/life.html'
    };
});
