var totaln5Ctrls = angular.module('totaln4Ctrls', []);

totaln5Ctrls.controller('mainCtrl', function($scope, $http) {
    $scope.course = "totaln4";
    $scope.kana = "true";

    //Total star initialize
    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    // Get totaln5 star information
    $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=totaln4&userid=" + getUser().id
    }).success(function(data, status) {
        var stars = getTotalStar(data, 'totaln4');
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;

        var progress = getTotalProgress(data, 'totaln4', 4, 5);
        $scope.vocabprogress = progress.vocab;
        $scope.grammarprogress = progress.grammar;
    });
});

totaln5Ctrls.controller('subCtrl', function($scope, $routeParams, $http) {
    $scope.course = "totaln4";
    $scope.lessonId = $routeParams.lessonId;

    $scope.vocabstar = 0;
    $scope.vocabprogress = [];
    $scope.grammarstar = 0;
    $scope.grammarprogress = [];

    $scope.starData;
    $scope.progress;
    $scope.enabled;

    // Get totaln5 star information
    $http({
        method: "GET",
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/akira_star.php?course=totaln4&userid=" + getUser().id
    }).success(function(data, status) {
        var stars = getTotalLessonStar(data, 'totaln4', $routeParams.lessonId);
        $scope.vocabstar = stars.vocab;
        $scope.grammarstar = stars.grammar;
        $scope.starData = data;
        $scope.progress = data;
        $scope.enabled = getUnlockedSub($scope.starData, 'totaln4', $routeParams.lessonId);
    });
    $scope.isEnabled = function(stepNumber) {
        return jQuery.inArray(stepNumber, $scope.enabled) !== -1;
    }
});

/**
 * Controller for write game vocab
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} $http        [description]
 * @return {[type]}              [description]
 */
totaln5Ctrls.controller('writeCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    var urlStr = "../../data/totaln5/data/vocab/json/default.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = akiraShuffle(data);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
        }
    };

    $scope.enterPress = function() {

        var step = $("#writeWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#writeWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            var correct = $("#writeWizard #step-" + step + " #correct-answer-wrapper").text().trim();
            if (compare(correct, userSlt)) {
                $("#writeWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                $("#writeWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            //Nguoi dung dang o buoc continue va nhan enter
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 1, $scope.gameObject.correct);
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
            // $scope.enterPress();
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
        $("audio#" + id + " source").attr("src", "../../data/totaln4/data/vocab/audio/" + $scope.data[id].short + ".mp3");
        document.getElementById(id).load();
        if (isNormal) {
            document.getElementById(id).playbackRate = 1;
        } else {
            document.getElementById(id).playbackRate = 0.5;
        }
        document.getElementById(id).play();
    };
});

/**
 * Controller for Vocab - Picture game
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} $http        [description]
 * @return {[type]}              [description]
 */
totaln5Ctrls.controller('pictureCtrl', function($scope, $routeParams, $http, $sce) {
    $scope.course = "totaln4";
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId; //Current step

    $scope.step = 0;
    $scope.choices = [];

    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };

    //UX behaviour
    $scope.keyCode = 0;
    $scope.stage = 0;

    var urlStr = "../../data/totaln4/data/vocab/json/default.json";
    $http({
        method: "GET",
        url: urlStr
    }).success(function(data, status) {
        $scope.data = akiraShuffle(data);
        $scope.choices = genAnswers($scope.data, "short", 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
        }
    };

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

    $scope.enterPress = function() {
        var step = $("#pictureWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#pictureWizard #step-" + step + " #user-input-wrapper .selected").text().trim();
            var correct = $("#pictureWizard #step-" + step + " #correct-answer-wrapper").text().trim();

            if (compare(correct, userSlt)) {
                $("#pictureWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                $("#pictureWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 2, $scope.gameObject.correct);
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

/**
 * Controller for Vocab - Word game
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} $http        [description]
 * @return {[type]}              [description]
 */
totaln5Ctrls.controller('wordCtrl', function($scope, $routeParams, $http) {
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
    var urlStr = "../../data/totaln4/data/vocab/json/default.json";

    $http({
        method: "GET",
        url: urlStr
    }).success(function(data, status) {
        $scope.data = akiraShuffle(data);
        $scope.choices = genAnswers($scope.data, "hiragana", 3);
    });

    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
        }
    };

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

    $scope.enterPress = function() {
        var step = $("#wordWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#wordWizard #step-" + step + " #user-input-wrapper .selected").text().trim();
            var correct = $("#wordWizard #step-" + step + " #correct-answer-wrapper").text().trim();

            if (compare(correct, userSlt)) {
                $("#wordWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                $("#wordWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
                $scope.removeLife();
            }

            $scope.stage = 2;
        } else if (2 == $scope.stage) {
            if (angular.equals($scope.step, $scope.data.length - 1)) {
                gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 3, $scope.gameObject.correct);
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


/**
 * Controller for Vocab - Listen game
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} $http        [description]
 * @return {[type]}              [description]
 */
totaln5Ctrls.controller('listenCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.step = 0;
    $scope.stage = 0;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    var urlStr = "../../data/totaln4/data/vocab/json/default.json";

    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = akiraShuffle(data);
    });

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/totaln4/data/vocab/audio/" + $scope.data[id].short + ".mp3");
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
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 4, $scope.gameObject.correct);
        }
    };

    $scope.enterPress = function() {
        var step = $("#listenWizard").smartWizard('currentStep') - 1;
        if (1 == $scope.stage) {
            //Nguoi dung dap an -> an enter -> kiem tra dung / sai
            var userSlt = $("#listenWizard #step-" + step + " #user-input-wrapper #input-" + step).val().trim();
            var correct = $("#listenWizard #step-" + step + " #correct-answer-wrapper").text().trim();

            if (compare(correct, userSlt)) {
                $("#listenWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("success");
                $scope.gameObject.correct++;
            } else {
                $("#listenWizard #step-" + step + " #aki-answer-wrapper").removeClass().addClass("failed");
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

/**
 * Controller for Vocab - Connect game
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} $http        [description]
 * @return {[type]}              [description]
 */
totaln5Ctrls.controller('connectCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "correct": 0
    };
    $scope.step = 0;

    var urlStr = "../../data/totaln4/data/vocab/json/default.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = akiraShuffle(data);
    });


    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if (angular.equals($scope.gameObject.life, 0)) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct * 2);
        }
    };

    $scope.check = function() {
        $scope.step++;
        $scope.gameObject.correct++;
        if (angular.equals($scope.step, 5)) {
            gameOver('totaln4', $routeParams.lessonId, $routeParams.partId, 5, $scope.gameObject.correct * 2);
        }
    }
});


/*Grammar controller*/
totaln5Ctrls.controller('grammarListenCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };
    var urlStr = "../../data/totaln5/data/grammar/json/type1.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
    });

    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/totaln5/data/grammar/audio/" + $scope.data[id].filename + ".mp3");
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
            gameOver();
        }
    }
});

totaln5Ctrls.controller('grammarChoiceCtrl', function($scope, $routeParams, $http) {
    var urlStr = "../../data/totaln5/data/grammar/json/type2.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
        $scope.answers = genAnswers($scope.data, "answer", 3);
    });

    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };


    $scope.playSound = function(id) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/totaln5/lesson" + $routeParams.lessonId + "/sub4/audio/" + $scope.data[id].filename + ".mp3");
        document.getElementById(id).load();
        document.getElementById(id).play();
    };

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver();
        }
    };
});

totaln5Ctrls.controller('grammarTranslateCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver();
        }
    };

    var urlStr = "../../data/totaln5/data/grammar/json/type3.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
        $scope.answers = genAnswers2($scope.data);
    });
});

totaln5Ctrls.controller('grammarReadCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver();
        }
    };

    var urlStr = "../../data/totaln5/data/grammar/json/type4.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
        $scope.answers = genAnswers($scope.data, "answer1", 2);
        console.log($scope.answers);
    });
});

totaln5Ctrls.controller('grammarWordCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };
    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver();
        }
    };

    var urlStr = "../../data/totaln5/data/grammar/json/type5.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
    });
});


totaln5Ctrls.controller('hiraCtrl', function($scope, $routeParams, $http) {});

totaln5Ctrls.controller('kataCtrl', function($scope, $routeParams, $http) {});
