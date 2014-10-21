var ctrls = angular.module('profileCtrl', []);

ctrls.controller('mainCtrl', function($scope, $sce) {
    $scope.data = getUser();

    $scope.userLevel = calculateLevel(akrParseInt($scope.data.exp));
    $scope.userProgress = levelProgress(akrParseInt($scope.data.exp));
    $scope.mentorLevel = calculateLevel(akrParseInt($scope.data.mentor_exp));
    $scope.mentorProgress = levelProgress(akrParseInt($scope.data.mentor_exp));

    $scope.renderHtml = function(e) {
        return $sce.trustAsHtml(e);
    }
});
