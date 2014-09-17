var appCtrls = angular.module('modularCtrls', []);

appCtrls.service("UserService", function() {
    var users = ["Peter", "Daniel", "Nina"];

    this.all = function() {
        console.log("ModuleCtrl -> UserService.all()");
        return 1;
    }

});


appCtrls.controller('moduleCtrl', function($scope, UserService) {
    $scope.modular = "moduleCtrl: Scope";
    $scope.
     = UserService;
    $scope.test = function(){
    	console.log("WTF");
    }
});
