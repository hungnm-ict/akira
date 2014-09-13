
var tpl= angular.module('demo',['ngRoute','tplControllers']);

tpl.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'main.html',
                controller: 'mainCtrl'
            })
            .when('/:lessonId',{
                templateUrl: 'subtopic.html',
                controller: 'subCtrl' 
            })
            .when('/:lessonId/:partId/learn',{
                templateUrl:'vocab/learn.html',
                controller: 'learnCtrl'
            })
            .when('/:lessonId/:partId/picture',{
                templateUrl:'vocab/picture.html',
                controller: 'pictureCtrl'
            })
            .when('/:lessonId/:partId/word',{
                templateUrl:'vocab/word.html',
                controller: 'wordCtrl'
            })
            .when('/:lessonId/:partId/listen',{
                templateUrl:'vocab/listen.html',
                controller: 'listenCtrl'
            })
            .when('/:lessonId/:partId/connect',{
                templateUrl:'vocab/connect.html',
                controller: 'connectCtrl'
            })
            .when('/:lessonId/:partId/write',{
                templateUrl:'vocab/write.html',
                controller: 'writeCtrl'
            });
    }]);

/*tpl.directive('fuckingdirective',function(){
    //Set tab
   /* setInterval(function () {
        $('#listenWizard').smartWizard({
            enableAllSteps : true,
            includeFinishButton : false,
            labelNext:"Check",
            labelPrevious: "",
            onLeaveStep:function(){alert("validate"); $('#listenWizard').smartWizard('showMessage','Hello! World');
return true;}
        });
/*$('#listenWizard ul.anchor').hide();*/
/*                    clearInterval();
    },200);*/

    // Reload audio data
/* });*/

var tplController = angular.module('tplControllers',[]);

tplController.controller('mainCtrl',function($scope,$routeParams){
    $scope.lessonId=$routeParams.lessonId;
});

tplController.controller('subCtrl',function($scope,$routeParams){
    $scope.lessonId=$routeParams.lessonId;
    $scope.partId = 1;
});


tplController.controller('learnCtrl',function($scope,$routeParams){
    $scope.lessonId=$routeParams.lessonId;
    $scope.partId= $routeParams.partId;

    var urlStr="../../data/totaln5/"+ $routeParams.lessonId + "/" + $routeParams.partId + "/1/json/default.json";
    $http({method: "GET", url: urlStr}).
        success(function(data, status) {
            $scope.data = data;
        });
});

tplController.controller('pictureCtrl',function($scope,$routeParams){
    $scope.lessonId=$routeParams.lessonId;
    $scope.partId = $routeParams.partId;

    var urlStr="../../data/totaln5/"+ $routeParams.lessonId + "/" + $routeParams.partId + "/2/json/default.json";
    $http({method: "GET", url: urlStr}).
        success(function(data, status) {
            $scope.data = data;
        });
});

tplController.controller('wordCtrl',function($scope,$routeParams,$http){
    $scope.lessonId=$routeParams.lessonId;
    $scope.partId= $routeParams.partId;

    var urlStr="../../data/totaln5/"+ $routeParams.lessonId + "/" + $routeParams.partId + "/3/json/default.json";
    $http({method: "GET", url: urlStr}).
        success(function(data, status) {
            $scope.data = data;
        });
});

tplController.controller('listenCtrl',function($scope,$routeParams,$http){
    var urlStr="../../data/totaln5/"+ $routeParams.lessonId +  "/" + $routeParams.partId +"/json/default.json";
    $http({method: "GET", url: urlStr}).
        success(function(data, status) {
            $scope.data = data;
        });
    
    $scope.lessonId=$routeParams.lessonId;
    $scope.partId= $routeParams.partId;
    
    $scope.test =function(id){
        document.getElementById(id).play();
    };

}).directive('myCustomer', function() {
    return {
      template: 'Name: {{gameObject.life}} Address: {{gameObject.score}}'
    };
});

tplController.controller('connectCtrl',function($scope,$routeParams,$http){
    $scope.lessonId=$routeParams.lessonId;
    $scope.partId= $routeParams.partId;
    $scope.gameObject = {"life":3,"score":0};   
    $scope.removeLife =function(){
        $scope.gameObject.life --;
        if($scope.gameObject.life == 0){
            alert("Game over");
        }
    };

    var urlStr="../../data/totaln5/"+ $routeParams.lessonId + "/" + $routeParams.partId + "/json/default.json";
    $http({method: "GET", url: urlStr}).
        success(function(data, status) {
            $scope.data = data;
        });
});

tplController.controller('writeCtrl',function($scope,$routeParams){
    $scope.lessonId=$routeParams.lessonId;
    $scope.partId= $routeParams.partId;

    var urlStr="../../data/totaln5/"+ $routeParams.lessonId + "/" + $routeParams.partId + "/6/json/default.json";
    $http({method: "GET", url: urlStr}).
        success(function(data, status) {
            $scope.data = data;
        });
});