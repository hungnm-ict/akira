var totaln5Ctrls = angular.module('totaln5Ctrls', ['akrUtilService']);

totaln5Ctrls.controller('mainCtrl', function($scope, $http, $window, totalStar, $routeParams, menuFactory, $rootScope) {

    $scope.course = "total" + $routeParams.degree;
    switch ($routeParams.degree) {
        case "n5":
            menuFactory.navgroup = 0;
            menuFactory.nav = 1;
            break;
        case "n4":
            menuFactory.navgroup = 1;
            menuFactory.nav = 0;
            break;
    }
    $rootScope.$broadcast('handleBroadcast');

    //Total star initialize
    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    var stars = getTotalStar(totalStar.data, $scope.course);
    $scope.vocabstar = stars.vocab;
    $scope.grammarstar = stars.grammar;

    var progress = getTotalProgress(totalStar.data, $scope.course, 4, 5);
    $scope.vocabprogress = progress.vocab;
    $scope.grammarprogress = progress.grammar;

    $scope.partId = window.sessionStorage.getItem("mainSelected") == null ? 0 : window.sessionStorage.getItem("mainSelected");

    $scope.subtopicChanged = function(id) {
        window.sessionStorage.clear();
        $scope.partId = id;
        window.sessionStorage.setItem("mainSelected", id - 1);
    }


    $scope.isLocked = function(lesson) {
        try {
            switch ($routeParams.degree) {
                case "n5":
                    if (lesson - 1 <= getUser().totaln5)
                        return ""
                    else return "lessonlocked";
                    break;
                case "n4":
                    if (lesson - 1 <= getUser().totaln4)
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

totaln5Ctrls.controller('subCtrl', function($scope, $routeParams, $http, dataService, restService) {
    $scope.course = "total" + $routeParams.degree;

    restService.getRestPromise($routeParams.degree).then(function(deferred) {
        var stars = getTotalLessonStar(deferred.data, $scope.course, $routeParams.lessonId);
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;
        $scope.starData = deferred.data;
        $scope.progress = deferred.data;
        $scope.enabled = getUnlockedSub($scope.starData, $scope.course, $routeParams.lessonId);
    });

    $scope.partId = window.sessionStorage.getItem("subSelected") == null ? 0 : window.sessionStorage.getItem("subSelected");
    $scope.degree = $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    $scope.starData;
    $scope.progress;
    $scope.enabled;

    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }

    $scope.subtopicChanged = function(id) {
        $scope.partId = id;
        window.sessionStorage.setItem("subSelected", id - 1);
    }
});

/*===========================================================
=            Controller for totaln5 - Vocab game            =
===========================================================*/

totaln5Ctrls.controller('writeCtrl', function($scope, $routeParams, $http, dataService, writeData, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
    $scope.data = akiraShuffle(dataService.filter(writeData.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));

    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    $scope.removeLife = function() {
        $scope.gameObject.life -= 1;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.enterPress = function() {

        var step = $("#writeWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#writeWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            // console.log($scope.data[$scope.step]);
            var hira = $scope.data[$scope.step].hiragana;
            var romaji = $scope.data[$scope.step].romaji;
            if (compare(hira, userSlt) || compare(romaji, userSlt)) {
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
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
        $("audio#" + id + " source").attr("src", "../../data/" + $scope.course + "/vocab/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

totaln5Ctrls.controller('pictureCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
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

    $scope.keyPress = function(e, keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, $scope.course + "/vocab", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, $scope.course + "/vocab", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, $scope.course + "/vocab", $scope.step, 2);
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

totaln5Ctrls.controller('wordCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
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

    $scope.keyPress = function(e, keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, $scope.course + "/vocab", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, $scope.course + "/vocab", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, $scope.course + "/vocab", $scope.step, 2);
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

totaln5Ctrls.controller('listenCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/" + $scope.course + "/vocab/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.enterPress = function() {
        var step = $("#listenWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#listenWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            $("#listenWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#listenWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            console.log($scope.data[$scope.step]);
            var hira = $scope.data[$scope.step].hiragana;
            var romaji = $scope.data[$scope.step].romaji;
            if (compare(hira, userSlt) || compare(romaji, userSlt)) {

                // if (compare(correct, userSlt)) {
                playCorrect();
                $("#listenWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#listenWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct, $scope.data.length);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#listenWizard").smartWizard('goForward');
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
        }
        changeLang();
    }
});

totaln5Ctrls.controller('connectCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 5).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if (angular.equals($scope.gameObject.life, 0)) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, 5);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, 5);
        }
    }

    $scope.$on("itemSelected", function(scope, current, next) {
        if ($scope.selected == null || current.type == $scope.selected.type) {
            $scope.selected = current;
        } else {
            if (current.class == $scope.selected.class) {
                //Remove UI
                $("#" + current.id).detach();
                $("#" + $scope.selected.id).detach();
                $scope.selected = null;

                //Play notification and update score
                playCorrect()
                $scope.step++;
                $scope.gameObject.correct++;
                if (angular.equals($scope.step, 5)) {
                    gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, 5);
                }
            } else {
                playFail();
                $scope.removeLife();
                $(".selected").removeClass("selected");
                $("#" + $scope.selected.id).addClass("selected");
            }
        }
    });
});
/*-----  End of Controller for totaln5 - Vocab game  ------*/

/*=============================================================
=            Controller for totaln5 - Grammar game            =
=============================================================*/

totaln5Ctrls.controller('grammarListenCtrl', function($scope, $routeParams, $http, dataService, $sce, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 1).then(function(deferred) {
        $scope.data = akiraShuffle(filter(deferred.data, 'id', $routeParams.lessonId));
    });

    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/" + $scope.course + "/grammar/audio/" + $scope.data[id].filename + ".mp3");
        $("audio#" + id + " source").attr
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
        }
    }

    $scope.enterPress = function() {
        var step = $("#grammarListenWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarListenWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            $("#grammarListenWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#grammarListenWizard #step-" + step + " #correct-answer-wrapper").text().trim();

            // console.log($scope.data[$scope.step]);
            // var hira = $scope.data[$scope.step].hiragana;
            // var romaji = $scope.data[$scope.step].romaji;
            // if (compare(hira, userSlt) || compare(romaji, userSlt)) {
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#grammarListenWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#grammarListenWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
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
            $("#grammarListenWizard").smartWizard('goForward');
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
        }
        changeLang();
    }

    $scope.renderHtml = function(text) {
        return $sce.trustAsHtml(text);
    }
});

totaln5Ctrls.controller('grammarChoiceCtrl', function($scope, $routeParams, $http, dataService, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 2).then(function(deferred) {
        $scope.data = akiraShuffle(filter(deferred.data, 'id', $routeParams.lessonId));
        $scope.answers = genAnswers($scope.data, "answer", 3);
    });

    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;
    $scope.stage = 0;
    $scope.keyCode = 0;

    $scope.playSound = function(id) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/" + $scope.course + "/grammar/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        document.getElementById(id).play();
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.enterPress = function() {
        var step = $("#grammarChoiceWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarChoiceWizard #step-" + step + " #user-input-wrapper .selected").text().trim();
            var correct = $("#grammarChoiceWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#grammarChoiceWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#grammarChoiceWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#grammarChoiceWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }

    $scope.keyPress = function(keyCode) {
        if ($scope.stage != 2) {
            if ([49, 50, 51].indexOf($scope.keyCode) == -1) {
                $scope.stage = 1;
            }
            $scope.keyCode = keyCode;
        }
        $scope.$apply();
        changeLang();
    }
});

totaln5Ctrls.controller('grammarTranslateCtrl', function($scope, $routeParams, $http, dataService, $sce, utilService, gameService) {
    $scope.course = "total" + $routeParams.degree;
    $scope.degree = $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.stage = 0;
    $scope.step = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
        }
    };

    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 3).then(function(deferred) {
        $scope.data = akiraShuffle(filter(deferred.data, 'id', $routeParams.lessonId));
        $scope.answers = genAnswers2($scope.data);
    });

    $scope.enterPress = function() {
        var step = $("#grammarTranslateWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarTranslateWizard #step-" + step + " #user-input-wrapper #input-" + step).text().trim();
            var correct = $("#grammarTranslateWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            correct = correct.replace(/ /g, String.fromCharCode(12288)).replace(new RegExp(String.fromCharCode(12288) + "{1,}", 'g'), "");
            console.log(userSlt);
            console.log(correct);
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#grammarTranslateWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#grammarTranslateWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#grammarTranslateWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }

    $scope.renderHtml = function(text) {
        return $sce.trustAsHtml(text);
    }
});

totaln5Ctrls.controller('grammarReadCtrl', function($scope, $routeParams, $http, dataService, $sce, utilService, gameService) {
    $scope.degree = $routeParams.degree;
    $scope.course = "total" + $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;
    $scope.stage = 0;
    $scope.keyCode = 0;
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
        }
    };


    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
        $scope.data = akiraShuffle(filter(deferred.data, 'id', $routeParams.lessonId));
        $scope.answers = genAnswers($scope.data, "answer1", 2);
    });

    $scope.enterPress = function() {
        var step = $("#grammarReadWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarReadWizard #step-" + step + " #user-input-wrapper .selected").text().trim();
            var correct = $("#grammarReadWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#grammarReadWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#grammarReadWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#grammarReadWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }

    $scope.keyPress = function(keyCode) {
        if ($scope.stage != 2) {
            // if ([49, 50].indexOf($scope.keyCode) == -1) {
            $scope.stage = 1;
            $scope.keyCode = keyCode;
            $scope.$apply();
            changeLang();
            // }
        }
    }

    $scope.renderHtml = function(text) {
        return $sce.trustAsHtml(text);
    }
});

totaln5Ctrls.controller('grammarWordCtrl', function($scope, $routeParams, $http, dataService, $sce, utilService, gameService) {
    $scope.degree = $routeParams.degree;
    $scope.course = "total" + $routeParams.degree;
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
        }
    };

    dataService.getDataPromise($scope.course, $routeParams.lessonId, $routeParams.partId, 5).then(function(deferred) {
        $scope.data = akiraShuffle(filter(deferred.data, 'id', $routeParams.lessonId));
    });

    $scope.enterPress = function() {
        var step = $("#grammarWordWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarWordWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            $("#grammarWordWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#grammarWordWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            if (compare(correct, userSlt)) {
                playCorrect();
                $("#grammarWordWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                playFail();
                $("#grammarWordWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameService.gameOver($scope.course, $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#grammarWordWizard").smartWizard('goForward');
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
            }
        }
        changeLang();
    }

    $scope.renderHtml = function(text) {
        return $sce.trustAsHtml(text);
    }
});

/*-----  End of Controller for totaln5 - Grammar game  ------*/

totaln5Ctrls.controller('testoutCtrl', function($scope, $routeParams, $window, testoutData, dataService, utilService, gameService) {
    try {
        $scope.course = "total" + $routeParams.degree;
        $scope.degree = $routeParams.degre;
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
                if ($("#step-" + $scope.step + " .wrapper").hasClass("vocabType")) {
                    type = "vocab";
                } else {
                    type = "grammar";
                };

                var audioSrc = document.getElementById(id).getElementsByTagName('source');
                $("audio#" + id + " source").attr("src", "../../data/" + $scope.course + "/" + type + "/audio/" + $scope.data[id].data.filename + ".mp3");
                document.getElementById(id).load();
                if (isNormal) {
                    document.getElementById(id).playbackRate = 1;
                } else {
                    document.getElementById(id).playbackRate = 0.5;
                }
                document.getElementById(id).play();
            } catch (err) {
                // console.error(err);
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
            var type = "";
            if ($("#step-" + $scope.step + " .wrapper").hasClass("vocabType")) {
                type = "vocab";
            } else {
                type = "grammar";
            };

            switch (keyCode) {
                case 49:
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, $scope.course + "/" + type, $scope.step, 0);
                    break;
                case 50:
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, $scope.course + "/" + type, $scope.step, 1);
                    break;
                case 51:
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, $scope.course + "/" + type, $scope.step, 2);
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
