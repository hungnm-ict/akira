var totaln5Ctrls = angular.module('totaln5Ctrls', []);

totaln5Ctrls.controller('mainCtrl', function($scope, $http, $window, /* restService, */ kanaStar, totalStar) {

    $scope.course = "totaln5";
    $scope.kana = "true";

    //Total star initialize
    $scope.kanastar;
    $scope.kanaprogress;
    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    // Get kana star information
    // restService.getRestPromise("kana").then(function(deferred) {
    $scope.kanastar = getCourseStar(kanaStar.data, 'kana');
    $scope.kanaprogress = getCourseProgress(kanaStar.data, 'kana', 5, 5);
    // });

    // restService.getRestPromise("totaln5").then(function(deferred) {
    var stars = getTotalStar(totalStar.data, 'totaln5');
    $scope.vocabstar = stars.vocab;
    $scope.grammarstar = stars.grammar;

    var progress = getTotalProgress(totalStar.data, 'totaln5', 4, 5);
    $scope.vocabprogress = progress.vocab;
    $scope.grammarprogress = progress.grammar;
    // });

    $scope.show = function(e) {
        $scope.kana = e;
    }

    $scope.check = function(lesson) {
        //Get current key point for this courses
        $http({
            method: "GET",
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_user_info.php?key=totaln5&userid=" + getUser().id
        }).success(function(data, status) {
            console.log(data);
            if (data > lesson) {
                console.info("Ban du keypoint de hoc bai nay");
                $window.location.href = "#/" + lesson;
            } else {
                console.info("Ban khong du keypoint de hoc bai nay");
            }
        });
    }

    $scope.pass = function(noOfLess) {
        //Firstly check if user have enough day_remain or not
        $http({
            method: "GET",
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_user_info.php?key=day_remain&userid=" + getUser().id
        }).success(function(data, status) {
            if(data>0){
                console.log("Ban con ngay su dung va co the choi phan nay");
                // Go to lesson exam test
            }else{
                console.log("Ban da het ngay su dung vui long mua the va nap them");
            }
        });
    }
});

totaln5Ctrls.controller('subCtrl', function($scope, $routeParams, $http, dataService, restService) {
    restService.getRestPromise("totaln5").then(function(deferred) {
        var stars = getTotalLessonStar(deferred.data, 'totaln5', $routeParams.lessonId);
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;
        $scope.starData = deferred.data;
        $scope.progress = deferred.data;
        $scope.enabled = getUnlockedSub($scope.starData, 'totaln5', $routeParams.lessonId);
    });

    $scope.course = "totaln5";
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
});

/*===========================================================
=            Controller for totaln5 - Vocab game            =
===========================================================*/

totaln5Ctrls.controller('writeCtrl', function($scope, $routeParams, $http, dataService, writeData) {
    /*  dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 1).then(function(deferred) {
          $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
      });*/

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
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
        }
    };

    $scope.enterPress = function() {

        var step = $("#writeWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
        $("audio#" + id + " source").attr("src", "../../data/totaln5/vocab/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

totaln5Ctrls.controller('pictureCtrl', function($scope, $routeParams, $http, dataService) {
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

    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 2).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('wordCtrl', function($scope, $routeParams, $http, dataService) {
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

    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 3).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('listenCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/totaln5/vocab/audio/" + $scope.data[id].filename + ".mp3");
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
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct, $scope.data.length);
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('connectCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 5).then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if (angular.equals($scope.gameObject.life, 0)) {
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, 5);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, 5);
        }
    }
});
/*-----  End of Controller for totaln5 - Vocab game  ------*/

/*=============================================================
=            Controller for totaln5 - Grammar game            =
=============================================================*/

totaln5Ctrls.controller('grammarListenCtrl', function($scope, $routeParams, $http, dataService) {
    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 1).then(function(deferred) {
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
        $("audio#" + id + " source").attr("src", "../../data/totaln5/grammar/audio/" + $scope.data[id].filename + ".mp3");
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
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('grammarChoiceCtrl', function($scope, $routeParams, $http, dataService) {
    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 2).then(function(deferred) {
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
        $("audio#" + id + " source").attr("src", "../../data/totaln5/grammar/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        document.getElementById(id).play();
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('grammarTranslateCtrl', function($scope, $routeParams, $http, dataService) {
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
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
        }
    };

    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 3).then(function(deferred) {
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct, $scope.data.length);
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

totaln5Ctrls.controller('grammarReadCtrl', function($scope, $routeParams, $http, dataService) {
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
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
        }
    };


    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
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

totaln5Ctrls.controller('grammarWordCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
        }
    };

    dataService.getDataPromise("totaln5", $routeParams.lessonId, $routeParams.partId, 4).then(function(deferred) {
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
                gameOver('totaln5', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct, $scope.data.length);
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

/*-----  End of Controller for totaln5 - Grammar game  ------*/


/*============================
=            KANA            =
============================*/

totaln5Ctrls.controller('kanaCtrl', function($scope, $routeParams, $http, restService) {
    $scope.course = "kana";
    $scope.lessonId = $routeParams.lessonId;

    restService.getRestPromise("kana").then(function(deferred) {
        $scope.progress = deferred.data;
        $scope.starData = deferred.data;
        $scope.kanaStar = getLessonStar(deferred.data, 'kana', $routeParams.lessonId);
        $scope.enabled = getUnlockedSub(deferred.data, 'kana', $routeParams.lessonId);
    });

    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }
});

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

    $scope.keyPress = function(keyCode) {
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

    $scope.keyPress = function(keyCode) {
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
        console.log(deferred.data);

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


totaln5Ctrls.controller('testoutCtrl',  function(){
   alert(); 
});