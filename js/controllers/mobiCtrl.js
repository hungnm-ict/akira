var mobiCtrl = angular.module('mobiCtrl', []);

mobiCtrl.controller('mainCtrl', function($scope, $http, $routeParams) {
    $scope.degree = $routeParams.degree;
    $scope.coursename = "Japanese " + angular.uppercase($routeParams.degree);
});

mobiCtrl.controller('subCtrl', function($scope, $http, $routeParams) {
    $scope.degree = $routeParams.degree;
    $scope.course = $routeParams.course;
    $scope.lessonId = $routeParams.lessonId;
    $scope.subtopic = 1;
});

/**

	TODO:
	- Gameover couse name
**/

mobiCtrl.controller('learnCtrl', function($scope, $http, $routeParams, mobiService) {
    mobiService.getPromise($routeParams.degree, $routeParams.course).then(function(deferred) {
        if (deferred.data != null) {
            $scope.data = mobiService.filterData(deferred.data, $routeParams.lessonId, $routeParams.subid);
        } else {
            console.log("Null data returned!!!!");
        }
    });

    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;


    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver('kana', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
        }
    };

    $scope.enterPress = function() {

        var step = $("#learnWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            $("#learnWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var userSlt = $("#learnWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            var correct = $("#learnWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#learnWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#learnWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver('kana', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#learnWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }

    $scope.keyPress = function(e, keyCode) {
        if ($scope.stage != 2) {
            if (13 != keyCode) {
                if ("" == $("#input-" + e).val()) {
                    $scope.stage = 0;
                } else {
                    $scope.stage = 1;
                }
                changeLang();
            }
        }
    }

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/kana/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

mobiCtrl.controller('pictureCtrl', function($scope, $http, $routeParams,mobiService) {
	mobiService.getPromise($routeParams.degree, $routeParams.course).then(function(deferred) {
        if (deferred.data != null) {
            $scope.data = mobiService.filterData(deferred.data, $routeParams.lessonId, $routeParams.subid);
            $scope.choices2 = genAnswers3($scope.data, 4);
        } else {
            console.log("Null data returned!!!!");
        }
    });

    $scope.course = "totaln5";
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;

    $scope.step = 0;
    $scope.choices = [];

    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    //UX behaviour
    $scope.keyCode = 0;
    $scope.stage = 0;


    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
        }
    };

    $scope.keyPress = function(keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, "totaln5/vocab", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, "totaln5/vocab", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, "totaln5/vocab", $scope.step, 2);
                break;
            default:
                break;
        }

        if ($scope.stage != 2) {
            if ([49, 50, 51].indexOf($scope.keyCode) == -1) {
                $scope.stage = 1;
            }
            $scope.keyCode = keyCode;
        }
        $scope.$apply();
        changeLang();
    }

    $scope.enterPress = function() {
        var step = $("#pictureWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#pictureWizard #step-" + step + " #user-input-wrapper .selected h5").text().trim();
            var correct = $("#pictureWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            console.log(userSlt + "-" + correct);
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#pictureWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#pictureWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
            }
            //Nguoi dung dang o buoc continue va nhan enter
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#pictureWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }
});

mobiCtrl.controller('wordCtrl', function($scope, $http, $routeParams,mobiService) {
	mobiService.getPromise($routeParams.degree, $routeParams.course).then(function(deferred) {
        if (deferred.data != null) {
            $scope.data = mobiService.filterData(deferred.data, $routeParams.lessonId, $routeParams.subid);
            $scope.choices2 = genAnswers3($scope.data, 4);
        } else {
            console.log("Null data returned!!!!");
        }
    });

    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.choices = [];
    $scope.step = 0;
    $scope.keyCode = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
});

mobiCtrl.controller('listenCtrl', function($scope, $http, $routeParams,mobiService) {

});

mobiCtrl.controller('connectCtrl', function($scope, $http, $routeParams,mobiService) {

});

mobiCtrl.controller('choiceCtrl', function($scope, $http, $routeParams,mobiService) {

});

mobiCtrl.controller('translateCtrl', function($scope, $http, $routeParams,mobiService) {

});

mobiCtrl.controller('readCtrl', function($scope, $http, $routeParams,mobiService) {

});

mobiCtrl.controller('writeCtrl', function($scope, $http, $routeParams,mobiService) {

});
