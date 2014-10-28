var kanjinCtrls = angular.module('kanjinCtrls', ['akrUtilService']);

kanjinCtrls.controller('mainCtrl', function($scope, $http, $routeParams, $rootScope, restService, menuFactory) {
    switch ($routeParams.degree) {
        case "n5":
            menuFactory.navgroup = 0;
            menuFactory.nav = 2;
            $scope.page = [0];
            break;
        case "n4":
            menuFactory.navgroup = 1;
            menuFactory.nav = 1;
            $scope.page = [0, 1];
            break;
    }
    $rootScope.$broadcast('handleBroadcast');

    $scope.course = "kanji" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    $scope.kanjistar = 0;
    $scope.kanjiprogress = [];

    restService.getRestPromise($scope.course).then(function(deferred) {
        $scope.kanjistar = getCourseStar(deferred.data, $scope.course);
        $scope.kanjiprogress = getCourseProgress(deferred.data, $scope.course, 3, 4);
    });


    $scope.subtopicChanged = function(id) {
        window.sessionStorage.clear();
        $scope.partId = id;
        window.sessionStorage.setItem("mainSelected", id - 1);
    }


    $scope.isLocked = function(lesson) {
        try {
            switch ($routeParams.degree) {
                case "n5":
                    if (lesson - 1 <= getUser().kanjin5)
                        return ""
                    else return "lessonlocked";
                    break;
                case "n4":
                    if (lesson - 1 <= getUser().kanjin4)
                        return ""
                    else return "lessonlocked";
                    break;
                default:
                    return "lessonlocked";
            }
        } catch (err) {
            console.error(err);
            return "lessonlocked";
        }
    }
});

kanjinCtrls.controller('subCtrl', function($scope, $routeParams, $http, restService, $sce) {
    $scope.course = "kanji" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.kanjistar = 0;
    $scope.starData;
    $scope.enabled;

    restService.getRestPromise($scope.course).then(function(deferred) {
        $scope.kanjistar = getLessonStar(deferred.data, $scope.course, $routeParams.lessonId);
        $scope.starData = deferred.data;
        $scope.enabled = getUnlockedSub($scope.starData, $scope.course, $routeParams.lessonId);
    });

    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }

    $scope.partId = window.sessionStorage.getItem("subSelected") == null ? 0 : window.sessionStorage.getItem("subSelected");
    $scope.subtopicChanged = function(id) {
        $scope.partId = id;
        window.sessionStorage.setItem("subSelected", id - 1);
    }

});

kanjinCtrls.controller('learnCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
    $scope.course = "kanji" + $routeParams.degree;

    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 1).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
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
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
        $("audio#" + id + " source").attr("src", "../../data/" + $scope.course + "/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

kanjinCtrls.controller('pictureCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
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

    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 2).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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

kanjinCtrls.controller('wordCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
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
    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 3).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
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
            var userSlt = $("#wordWizard #step-" + step + " #user-input-wrapper #input-" + step).text().trim();
            $("#wordWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#wordWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            console.log(userSlt);
            console.log(correct);
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
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
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

kanjinCtrls.controller('connectCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
    $scope.course = "kanji" + $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if (angular.equals($scope.gameObject.life, 0)) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
        }
    }

        $scope.$on("itemSelected", function(scope,current,next) {
        if($scope.selected == null || current.type == $scope.selected.type ){
            $scope.selected= current;
        }else{
            if(current.class == $scope.selected.class){
                //Remove UI
                $("#"+current.id).detach();
                $("#"+$scope.selected.id).detach();
                $scope.selected=null;

                //Play notification and update score
                playCorrect()
                $scope.step++;
                $scope.gameObject.correct++;
                if (angular.equals($scope.step, 5)) {
                    gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
                }
            }else{
                playFail();
                $scope.removeLife();
                $(".selected").removeClass("selected");
                $("#"+$scope.selected.id).addClass("selected");
            }
        }
    });
});

kanjinCtrls.controller('testoutCtrl', function($scope, $routeParams, testoutData, dataService, utilService, gameService) {
    try {
        $scope.course = "kanji" + $routeParams.degree;
        $scope.degree = $routeParams.degre;
        $scope.data = dataService.getTestoutData(testoutData, $routeParams.type, $routeParams.lessonId);

        //Create data object for vocab[picture|word] game(Multichoice game)
        $scope.vocabMultiChoice = genVocabMultichoice($scope.data, mergeData(testoutData[0].data, $routeParams.type, $routeParams.lessonId, "topic"), 3);

        //Create data object for grammar choice game
        // $scope.grammarMultiChoice = genVocabMultichoice($scope.data, mergeData(testoutData[2].data, $routeParams.type, $routeParams.lessonId, "id"), 3);


        //Create answer for grammar[]
        $scope.answers = genAnswers5($scope.data);

        $scope.gameObject = {
            "life": 3,
            "correct": 0
        };
        $scope.step = 0;
        $scope.stage = 0;

        $scope.playSound = function(id, isNormal, type) {
            try {

                var audioSrc = document.getElementById(id).getElementsByTagName('source');
                $("audio#" + id + " source").attr("src", "../../data/" + $scope.course + "/" + "/audio/" + $scope.data[id].data.filename + ".mp3");
                document.getElementById(id).load();
                if (isNormal) {
                    document.getElementById(id).playbackRate = 1;
                } else {
                    document.getElementById(id).playbackRate = 0.5;
                }
                document.getElementById(id).play();
            } catch (err) {
                console.error(err);
            }
        };

        $scope.removeLife = function() {
            $scope.gameObject.life -= 1;
            if ($scope.gameObject.life == 0) {
                gameService.testoutOver(false, $scope.course, $routeParams.lessonId, $routeParams.type);
            }
        };

        $scope.enterPress = function() {
            try {

                var step = $("#testoutWizard").smartWizard('currentStep') - 1;
                if (1 == $scope.stage) {
                    //Nguoi dung dap an -> an enter -> kiem tra dung / sai
                    var userSlt = akrGetUserInput("#testoutWizard #step-" + step + " #user-input-wrapper .selected#input-" + step);
                    $("#testoutWizard #step-" + step + " #user-input-wrapper #input-" + step + "[type='text']").attr("disabled", "disabled");
                    var correct = $("#testoutWizard #step-" + step + " #correct-answer-wrapper").text().trim();
                    if (compare(correct, userSlt)) {
                        playCorrect();
                        $("#testoutWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                        $scope.gameObject.correct++;
                    } else {
                        playFail();
                        $("#testoutWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                        $scope.removeLife();
                    }

                    $scope.stage = 2;
                } else if (2 == $scope.stage) {
                    //Nguoi dung dang o buoc continue va nhan enter
                    if (angular.equals($scope.step, $scope.data.length - 1)) {
                        gameService.testoutOver(true, $scope.course, $routeParams.lessonId, $routeParams.type);
                    }
                    $scope.keyCode = 0;
                    $scope.stage = 0;
                    $scope.step++;
                    $("#testoutWizard").smartWizard('goForward');
                }
                $scope.$apply();
                changeLang();
            } catch (err) {
                console.error(err);
            }
        }

        $scope.keyPress = function(e, keyCode) {
            switch (keyCode) {
                case 49:
                    $scope.$parent.rootPlay($scope.vocabMultiChoice, $scope.course, $scope.step, 0);
                    break;
                case 50:
                    $scope.$parent.rootPlay($scope.vocabMultiChoice, $scope.course, $scope.step, 1);
                    break;
                case 51:
                    $scope.$parent.rootPlay($scope.vocabMultiChoice, $scope.course, $scope.step, 2);
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
    } catch (err) {
        console.error(err);
    }
});
