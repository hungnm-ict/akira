var appCtrls = angular.module('testN5Ctrls', []);

appCtrls.controller('mainCtrl', function($scope, $location) {
    $scope.courseCollection = ["common.vocab", "common.grammar", "common.read", "common.listen-compre"];
    $scope.courseSelectedIndex = 0;
    $scope.timeCollection = ["10", "20", "30"];
    $scope.timeSelectedIndex = 0;

    $scope.type = 0;
    $scope.time = 10;

    $scope.play = function() {
        $location.path('/game/' + $scope.type + '/' + $scope.time);
    }

    $scope.change = function(selectedType, selectedIndex) {

        if (selectedType == 1) {
            $scope.courseSelectedIndex = selectedIndex;
            $scope.type = selectedIndex;
        } else if (selectedType == 2) {
            $scope.timeSelectedIndex = selectedIndex;
            $scope.time = 10 * selectedIndex + 10;
        }
    }
});


appCtrls.controller('gameCtrl', function($scope, $location, $stateParams, $http) {
    var urlStr = "../../data/testn5/json/vocab.json"
    $http({
        method: "GET",
        url: urlStr
    }).success(function(data, status) {
        $scope.dataset = data;

    });
    console.info($stateParams);
    $scope.type = $stateParams.type;
    $scope.time = $stateParams.min;
});
