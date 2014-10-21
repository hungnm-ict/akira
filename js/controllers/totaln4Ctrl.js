var totaln4Ctrls = angular.module('totaln4Ctrls', []);

totaln4Ctrls.controller('mainCtrl', function($scope, $http,restService) {
    $scope.course = "totaln4";

    //Total star initialize
    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    restService.getRestPromise("totaln4").then(function(deferred) {
        var stars = getTotalStar(deferred.data, 'totaln4');
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;

        var progress = getTotalProgress(deferred.data, 'totaln4', 4, 5);
        $scope.vocabprogress = progress.vocab;
        $scope.grammarprogress = progress.grammar;
    });

    $scope.partId = window.sessionStorage.getItem("mainSelected") == null ? 0 : window.sessionStorage.getItem("mainSelected");
    $scope.subtopicChanged = function(id) {
        window.sessionStorage.clear();
        $scope.partId = id;
        window.sessionStorage.setItem("mainSelected", id - 1);
    }
});

totaln4Ctrls.controller('subCtrl', function($scope, $routeParams, $http,restService) {
    $scope.course = "totaln4";
    $scope.lessonId = $routeParams.lessonId;

    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    $scope.starData;
    $scope.progress;
    $scope.enabled;

    restService.getRestPromise("totaln4").then(function(deferred) {
        var stars = getTotalLessonStar(deferred.data, 'totaln4', $routeParams.lessonId);
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;
        $scope.starData = deferred.data;
        $scope.progress = deferred.data;
        $scope.enabled = getUnlockedSub($scope.starData, 'totaln4', $routeParams.lessonId);
    });

    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }
     $scope.subtopicChanged = function(id) {
        $scope.partId = id;
        window.sessionStorage.setItem("subSelected", id - 1);
    }
});

/*===========================================================
=            Controller for totaln4 - Vocab game            =
===========================================================*/

totaln4Ctrls.controller('writeCtrl', function($scope, $routeParams, $http, dataService) {
    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 1).then(function(deferred) {
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
        $scope.gameObject.life -= 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.enterPress = function() {

        var step = $("#writeWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step+"[type='text']").attr("disabled", "disabled");
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
        $("audio#" + id + " source").attr("src", "../../data/totaln4/vocab/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

totaln4Ctrls.controller('pictureCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.course = "totaln4";
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

    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 2).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.keyPress = function(keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, "totaln4/vocab", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, "totaln4/vocab", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, "totaln4/vocab", $scope.step, 2);
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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

totaln4Ctrls.controller('wordCtrl', function($scope, $routeParams, $http, dataService) {
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

    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 3).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.keyPress = function(keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, "totaln4/vocab", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, "totaln4/vocab", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, "totaln4/vocab", $scope.step, 2);
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
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

totaln4Ctrls.controller('listenCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/totaln4/vocab/audio/" + $scope.data[id].filename + ".mp3");
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
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct,$scope.data.length);
        }
    };

    $scope.enterPress = function() {
        var step = $("#listenWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#listenWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            var correct = $("#listenWizard #step-" + step + " #correct-answer-wrapper").text().trim();

            if (compare(correct, userSlt)) {
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct,$scope.data.length);
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

totaln4Ctrls.controller('connectCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 5).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if (angular.equals($scope.gameObject.life, 0)) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct ,5);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct ,5);
        }
    }
});
/*-----  End of Controller for totaln4 - Vocab game  ------*/

/*=============================================================
=            Controller for totaln4 - Grammar game            =
=============================================================*/

totaln4Ctrls.controller('grammarListenCtrl', function($scope, $routeParams, $http, dataService) {
    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 1).then(function(deferred) {
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
        $("audio#" + id + " source").attr("src", "../../data/totaln4/grammar/audio/" + $scope.data[id].filename + ".mp3");
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
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct,$scope.data.length);
        }
    }

    $scope.enterPress = function() {
        var step = $("#grammarListenWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarListenWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            $("#grammarListenWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#grammarListenWizard #step-" + step + " #correct-answer-wrapper").text().trim();

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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct,$scope.data.length);
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
});

totaln4Ctrls.controller('grammarChoiceCtrl', function($scope, $routeParams, $http,dataService) {
    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 2).then(function(deferred) {
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
        $("audio#" + id + " source").attr("src", "../../data/totaln4/grammar/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        document.getElementById(id).play();
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
           gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct,$scope.data.length);
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct,$scope.data.length);
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

totaln4Ctrls.controller('grammarTranslateCtrl', function($scope, $routeParams, $http,dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct,$scope.data.length);
        }
    };

    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 3).then(function(deferred) {
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct,$scope.data.length);
            }
            $scope.keyCode = 0;
            $scope.stage = 0;
            $scope.step++;
            $("#grammarTranslateWizard").smartWizard('goForward');
        }
        $scope.$apply();
        changeLang();
    }
});

totaln4Ctrls.controller('grammarReadCtrl', function($scope, $routeParams, $http,dataService) {
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
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
        }
    };


    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
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
            if ([49, 50, 51].indexOf($scope.keyCode) == -1) {
                $scope.stage = 1;
            }
            $scope.keyCode = keyCode;
        }
        $scope.$apply();
        changeLang();
    }
});

totaln4Ctrls.controller('grammarWordCtrl', function($scope, $routeParams, $http,dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct,$scope.data.length);
        }
    };

    dataService.getDataPromise("totaln4", $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
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
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct,$scope.data.length);
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
});

/*-----  End of Controller for totaln4 - Grammar game  ------*/

totaln4Ctrls.controller('testoutCtrl', function($scope, $routeParams, testoutData, dataService) {
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
                $("audio#" + id + " source").attr("src", "../../data/totaln4/" + type + "/audio/" + $scope.data[id].data.filename + ".mp3");
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
                    $("#testoutWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
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
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, "totaln4/vocab", $scope.step, 0);
                    break;
                case 50:
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, "totaln4/vocab", $scope.step, 1);
                    break;
                case 51:
                    $scope.$parent.testoutPlay($scope.vocabMultiChoice, "totaln4/vocab", $scope.step, 2);
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