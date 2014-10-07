var kanjinCtrls = angular.module('kanjinCtrls', []);

kanjinCtrls.controller('mainCtrl', function($scope, $http, $routeParams, $window) {
    $scope.course = "kanji" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    $scope.kanjistar = 0;
    $scope.kanjiprogress = [];

    $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=" + $scope.course + "&userid=" + getUser().id
    }).success(function(data, status) {
        $scope.kanjistar = getCourseStar(data, $scope.course);
        $scope.kanjiprogress = getCourseProgress(data, $scope.course, 3, 4);
    });

    switch ($routeParams.degree) {
        case "n4":
            $scope.$parent.navgroup = 1;
            $scope.$parent.nav = 1;
            break;
        case "n5":
            $scope.$parent.navgroup = 0;
            $scope.$parent.nav = 2;
            break;
        default:
            $scope.$parent.navgroup = 0;
            $scope.$parent.nav = 2;
            break;
    }
});

kanjinCtrls.controller('subCtrl', function($scope, $routeParams, $http) {
    $scope.course = "kanji" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.kanjistar = 0;
    $scope.starData;
    $scope.enabled;

    // Get totaln5 star information
    $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=" + $scope.course + "&userid=" + getUser().id
    }).success(function(data, status) {
        $scope.kanjistar = getLessonStar(data, $scope.course, $routeParams.lessonId);
        $scope.starData = data;
        $scope.enabled = getUnlockedSub($scope.starData, $scope.course, $routeParams.lessonId);
    });

    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }
});

kanjinCtrls.controller('learnCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.course = "kanji" + $routeParams.degree;

    dataService.promise.then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    dataService.getData($scope.course);

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
            gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
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
                gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
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
        $("audio#" + id + " source").attr("src", "../../data/kanjin5/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

kanjinCtrls.controller('pictureCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.course = "kanji" + $routeParams.degree;
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

    dataService.promise.then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
        }
    };

    $scope.keyPress = function(keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, $scope.course, $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, $scope.course, $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, $scope.course, $scope.step, 2);
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
            var userSlt = $("#pictureWizard #step-" + step + " #user-input-wrapper .selected span").text().trim();
            var correct = $("#pictureWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            console.log(correct + "-" + userSlt);
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
                gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
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

kanjinCtrls.controller('wordCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.course = "kanji" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
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

    dataService.promise.then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
        }
    };

    $scope.keyPress = function(keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, $scope.course, $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, $scope.course, $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, $scope.course, $scope.step, 2);
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
        var step = $("#wordWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#wordWizard #step-" + step + " #user-input-wrapper .selected").text().trim();
            var correct = $("#wordWizard #step-" + step + " #correct-answer-wrapper").text().trim();

            if (compare(correct, userSlt)) {
                playCorrect();
                $("#wordWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#wordWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
            }
            //Nguoi dung dang o buoc continue va nhan enter
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#wordWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }
});

kanjinCtrls.controller('connectCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.course = "kanji" + $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    dataService.promise.then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if (angular.equals($scope.gameObject.life, 0)) {
            gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct * 2);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct * 2);
        }
    }
});
