var appCtrls = angular.module('testN5Ctrls', []);

appCtrls.controller('mainCtrl', function($scope, $location,$sce) {
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
    $scope.html="<u title='Hello world'>html </u> <br>asdsadsad＿★" ;
    $scope.renderHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };
});


appCtrls.controller('gameCtrl', function($scope, $location, $stateParams, $http) {
    courseCollection = ["common.vocab", "common.grammar", "common.read", "common.listen-compre"];
    $scope.title = courseCollection[$stateParams.type];
    var urlStr;
    if ($stateParams.type == 0) {
        urlStr = "../../data/testn5/json/vocab-1.json";
    } else if ($stateParams.type == 1) {
        urlStr = "../../data/testn5/json/grammar-1.json";
    } else if ($stateParams.type == 2) {
        urlStr = "../../data/testn5/json/read-1.json";
    } else if ($stateParams.type == 3) {
        urlStr = "../../data/testn5/json/write-1.json";
    }

    $http({
        method: "GET",
        url: urlStr
    }).success(function(data, status) {
        $scope.dataset = akiraShuffle(data);

    });
    $scope.type = $stateParams.type;
    $scope.time = $stateParams.min;

});

