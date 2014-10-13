/*
 *----------------------------------------------------
 * TOEIC 500 Controller
 *----------------------------------------------------
 * Author: CuongDD
 * Last update: 11/10/2014
 */
var toeic500Ctrls = angular.module('toeic500Ctrls', []);

toeic500Ctrls.controller('mainCtrl', function($scope, $http,dataService) {
    dataService.promise.then(function(deferred) {
        $scope.data = deferred.data;
    });

    $scope.course = "toeic500";
    $scope.kana = "false";
    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    // Get toeic500 star information
    $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=toeic500&userid=" + getUser().id
    }).success(function(data, status) {
        var stars = getTotalStar(data, 'toeic500');
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;

        var progress = getTotalProgress(data, 'toeic500',4, 5);
        $scope.vocabprogress = progress.vocab;
        $scope.grammarprogress = progress.grammar;
    });

    $scope.show = function(e) {
        $scope.kana = e;
    }
});

toeic500Ctrls.controller('subCtrl', function($scope, $routeParams, $http, dataService) {
    // Find the number of subtopic in a lesson
    dataService.promise.then(function(deferred) {
        $scope.noSub = dataService.numOfSub(deferred.data, $routeParams.lessonId);
    });



    $scope.course = "toeic500";
    $scope.lessonId = $routeParams.lessonId;
    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    $scope.starData;
    $scope.progress;
    $scope.enabled;

    // Get toeic500 star information
    $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=toeic500&userid=" + getUser().id
    }).success(function(data, status) {
        var stars = getTotalLessonStar(data, 'toeic500', $routeParams.lessonId);
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;
        $scope.starData = data;
        $scope.progress = data;
        $scope.enabled = getUnlockedSub($scope.starData, 'toeic500', $routeParams.lessonId);
    });

    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }

    $scope.isLast = function($last){
        console.log("this is last element");
    }
});

/*
 *----------------------------------------------------
 * TOEIC 500 Controller - Vocab Game
 *----------------------------------------------------
 */

toeic500Ctrls.controller('writeCtrl', function($scope, $routeParams, $http, dataService) {
    dataService.promise.then(function(deferred) {
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
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
        }
    };

    $scope.enterPress = function() {

        var step = $("#writeWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            // Nguoi dung dap an -> an enter -> kiem tra dung / sai
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
            // Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
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
        $("audio#" + id + " source").attr("src", "../../data/toeic500/vocab/audio/" + $routeParams.lessonId + "/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

toeic500Ctrls.controller('pictureCtrl', function($scope, $routeParams, $http, $sce, dataService) {
    $scope.course = "toeic500";
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
        $scope.choices = genAnswers($scope.data, "filename", 3);
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
        }
    };

    $scope.keyPress = function(keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, "toeic500/vocab", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, "toeic500/vocab", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, "toeic500/vocab", $scope.step, 2);
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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
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

toeic500Ctrls.controller('wordCtrl', function($scope, $routeParams, $http, dataService) {
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
        // $scope.choices = genAnswers($scope.data, "hiragana", 3);
        $scope.choices2 = genAnswers3($scope.data, 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
        }
    };

    $scope.keyPress = function(keyCode) {
        switch (keyCode) {
            case 49:
                $scope.$parent.rootPlay($scope.choices2, "toeic500/vocab", $scope.step, 0);
                break;
            case 50:
                $scope.$parent.rootPlay($scope.choices2, "toeic500/vocab", $scope.step, 1);
                break;
            case 51:
                $scope.$parent.rootPlay($scope.choices2, "toeic500/vocab", $scope.step, 2);
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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
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

toeic500Ctrls.controller('listenCtrl', function($scope, $routeParams, $http, dataService) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    dataService.promise.then(function(deferred) {
        $scope.data = akiraShuffle(dataService.filter(deferred.data, "topic", $routeParams.lessonId, "sub", $routeParams.partId));
    });

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/toeic500/vocab/audio/" + $routeParams.lessonId + "/" + $scope.data[id].filename + ".mp3");
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
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
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

toeic500Ctrls.controller('connectCtrl', function($scope, $routeParams, $http, dataService) {
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
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct * 2);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct * 2);
        }
    }
});
/*-----  End of Controller for toeic500 - Vocab game  ------*/

/*
 *----------------------------------------------------
 * TOEIC 500 Controller - Grammar Game
 *----------------------------------------------------
 */


toeic500Ctrls.controller('grammarListenCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    $http({
        method: "GET",
        url: "../../data/toeic500/grammar/json/type2.json"
    }).success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
        console.log($scope.data);
    });

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/toeic500/grammar/audio/" + $routeParams.lessonId + "/" + $scope.data[id].filename + ".mp3");
        console.log("../../data/toeic500/grammar/audio/" + $routeParams.lessonId + "/" + $scope.data[id].filename + ".mp3");
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
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
        }
    }

    $scope.enterPress = function() {
        var step = $("#grammarListenWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarListenWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            // CuongDD: 12/10/2014 We should lowercase all answers before compare them
            userSlt = userSlt.toLowerCase();
            $("#grammarListenWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#grammarListenWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            correct = correct.toLowerCase();

            // TODO: CuongDD: 12/10/2014
            // If the user's answer only does not contain "?" we should only show warning, and still accept that answer
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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
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


toeic500Ctrls.controller('grammarChoiceCtrl', function($scope, $routeParams, $http) {
    $http({
        method: "GET",
        url: "../../data/toeic500/grammar/json/type2.json"
    }).success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
        // CuongDD: 12/10/2014
        // Get answers and shuffle them
        $scope.answers = genAnswers($scope.data, "englisha", 3);
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
        $("audio#" + id + " source").attr("src", "../../data/toeic500/grammar/audio/" + $routeParams.lessonId + "/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        document.getElementById(id).play();
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver();
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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
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

/**

    TODO:
    - Lỗi kéo thả ở câu tiếp theo
    - Lỗi check đúng sai

**/
toeic500Ctrls.controller('grammarTranslateCtrl', function($scope, $routeParams, $http) {
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
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
        }
    };
    $http({
        method: "GET",
        url: "../../data/toeic500/grammar/json/type3.json"
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
        $scope.answers = genEnglishAnswers($scope.data);
    });

    $scope.enterPress = function() {
        var step = $("#grammarTranslateWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarTranslateWizard #step-" + step + " #user-input-wrapper #input-" + step).text().trim();
            // CuongDD
            userSlt = userSlt.toLowerCase();
            var correct = $("#grammarTranslateWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            correct = correct.replace(/ /g,'');
            correct = correct.toLowerCase();
            // End CuongDD

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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
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

toeic500Ctrls.controller('grammarReadCtrl', function($scope, $routeParams, $http) {
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
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
        }
    };

    $http({
        method: "GET",
        url: "../../data/toeic500/grammar/json/type4.json"
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
        $scope.answers = genAnswers($scope.data, "correct", 2);
    });

    $scope.enterPress = function() {
        var step = $("#grammarReadWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarReadWizard #step-" + step + " #user-input-wrapper .selected").text().trim();
            // CuongDD:
            userSlt = userSlt.toLowerCase();
            var correct = $("#grammarReadWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            correct = correct.toLowerCase();

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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
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

toeic500Ctrls.controller('grammarWordCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct);
        }
    };

    $http({
        method: "GET",
        url: "../../data/toeic500/grammar/json/type5.json"
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
    });

    $scope.enterPress = function() {
        var step = $("#grammarWordWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#grammarWordWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            userSlt = userSlt.toLowerCase();
            $("#grammarWordWizard #step-" + step + " #user-input-wrapper #input-" + step).attr("disabled", "disabled");
            var correct = $("#grammarWordWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            correct = correct.toLowerCase();
            
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
                gameOver('toeic500', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct);
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

/*-----  End of Controller for toeic500 - Grammar game  ------*/