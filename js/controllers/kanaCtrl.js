var totaln5Ctrls = angular.module('totaln5Ctrls', []);

totaln5Ctrls.controller('mainCtrl', function($scope, $http, $window, kanaStar) {
    $scope.course = "kana";
    $scope.kanastar = getCourseStar(kanaStar.data, 'kana');
    $scope.kanaprogress = getCourseProgress(kanaStar.data, 'kana', 5, 5);
    
    window.sessionStorage.clear();
});

totaln5Ctrls.controller('subCtrl', function($scope, $routeParams, $http, dataService, restService) {
    restService.getRestPromise("kana").then(function(deferred) {
        $scope.progress = deferred.data;
        $scope.starData = deferred.data;
        $scope.kanaStar = getLessonStar(deferred.data, 'kana', $routeParams.lessonId);
        $scope.enabled = getUnlockedSub(deferred.data, 'kana', $routeParams.lessonId);
    });

    $scope.partId = window.sessionStorage.getItem("subSelected") == null ? 0 : window.sessionStorage.getItem("subSelected");
    $scope.course = "kana";
    $scope.lessonId = $routeParams.lessonId;

    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }

    $scope.subtopicChanged = function(id) {
        $scope.partId = id;
        window.sessionStorage.setItem("subSelected", id - 1);
    }
});

/*============================
=            KANA            =
============================*/

totaln5Ctrls.controller('kanaLearnCtrl', function($scope, $routeParams, $http, dataService) {
    dataService.getDataPromise("kana", $routeParams.lessonId, $routeParams.partId, 1).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topicid", $routeParams.lessonId, "subid", $routeParams.partId));
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
            gameOver('kana', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
                gameOver('kana', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('kanaPictureCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.course = "kana";
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

    dataService.getDataPromise("kana", $routeParams.lessonId, $routeParams.partId, 2).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topicid", $routeParams.lessonId, "subid", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('kana', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.keyPress = function(e,keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, "kana", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, "kana", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, "kana", $scope.step, 2);
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
                gameOver('kana', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('kanaWordCtrl', function($scope, $routeParams, $http, dataService) {
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
    dataService.getDataPromise("kana", $routeParams.lessonId, $routeParams.partId, 3).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topicid", $routeParams.lessonId, "subid", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);

    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver('kana', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.keyPress = function(e,keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, "kana", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, "kana", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, "kana", $scope.step, 2);
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
                gameOver('kana', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('kanaConnectCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    dataService.getDataPromise("kana", $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topicid", $routeParams.lessonId, "subid", $routeParams.partId));
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if (angular.equals($scope.gameObject.life, 0)) {
            gameOver('kana', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameOver('kana', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct, $scope.data.length);
        }
    }
});

totaln5Ctrls.controller('kanaWriteCtrl', function($scope, $routeParams, $http, dataService) {
    dataService.getDataPromise("kana", $routeParams.lessonId, $routeParams.partId, 5).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topicid", $routeParams.lessonId, "subid", $routeParams.partId));
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
            gameOver('kana', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct);
        }
    };

    $scope.enterPress = function() {

        var step = $("#writeWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            //$("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#writeWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#writeWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#writeWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver('kana', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#writeWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }

    $scope.keyPress = function(e, keyCode) {
        if (13 != keyCode) {
            if ("" == $("#input-" + e).val()) {
                $scope.stage = 0;
            } else {
                $scope.stage = 1;
            }
            changeLang();
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
/*-----  End of KANA  ------*/


totaln5Ctrls.controller('testoutCtrl', function($scope, $routeParams, testoutData, dataService) {
    try {
        $scope.data = dataService.getTestoutData(testoutData, $routeParams.type, $routeParams.lessonId);

        //Create data object for vocab[picture|word] game(Multichoice game)
        $scope.vocabMultiChoice = genVocabMultichoice($scope.data, mergeData(testoutData[0].data, $routeParams.type, $routeParams.lessonId, "topic"), 3);

        //Create data object for grammar choice game
        $scope.grammarMultiChoice = genVocabMultichoice($scope.data, mergeData(testoutData[2].data, $routeParams.type, $routeParams.lessonId, "id"), 3);


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
                if (type === undefined) {
                    type = "vocab";
                }

                var audioSrc = document.getElementById(id).getElementsByTagName('source');
                $("audio#" + id + " source").attr("src", "../../data/totaln5/" + type + "/audio/" + $scope.data[id].data.filename + ".mp3");
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
                // gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
            }
        };

        $scope.enterPress = function() {
            try {

                var step = $("#testoutWizard").smartWizard('currentStep') - 1;
                if (1 == $scope.stage) {
                    //Nguoi dung dap an -> an enter -> kiem tra dung / sai
                    var userSlt = akrGetUserInput("#testoutWizard #step-" + step + " #user-input-wrapper .selected#input-" + step);
                    $("#testoutWizard #step-" + step + " #user-input-wrapper #input-" + step+"[type='text']").attr("disabled", "disabled");
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
                        // gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, "totaln5/vocab", $scope.step, 0);
                    break;
                case 50:
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, "totaln5/vocab", $scope.step, 1);
                    break;
                case 51:
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, "totaln5/vocab", $scope.step, 2);
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
