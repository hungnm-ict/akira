var totaln5Ctrls = angular.module('totaln5Ctrls', []);

totaln5Ctrls.controller('mainCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    //Get course stars objects
    $scope.vocabstar = "100";
    $scope.progress = [];
    var object = {
        "vocab": 60,
        "grammar": 10
    }
    $scope.progress.push(object);
    $scope.grammarstar = "100";

}).controller('subCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = 1;

    //Get lesson stars objects
    $scope.vocabstar = "10";
    $scope.grammarstar = "80";
    console.log($routeParams);

}).controller('learnCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
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

    $scope.prev = function(id) {
        if (!angular.equals($scope.step, 0)) {
            $scope.step--;
            $('#' + id).smartWizard("goBackward");
        }
    }

    $scope.next = function(id) {
        if (!angular.equals($scope.step, $scope.data.length)) {
            $scope.step++;
            $('#' + id).smartWizard("goForward");
        }else{
            gameOver();
        }
    }
}).controller('pictureCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };
    $scope.selected = -1;
    $scope.step = 0;
    $scope.answer = [];
    $scope.choices = [];

    var urlStr = "../../data/totaln5/data/vocab/json/default.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = akiraShuffle(data);

        for (i = 0; i < $scope.data.length; i++) {
            var answer = Math.floor(Math.random() * 3);
            $scope.answer[i] = answer;
            var temp = [];
            temp[answer] = $scope.data[i].short;
            for (j = 0; j < 3; j++) {
                if (j == answer)
                    continue;
                else {
                    var id;
                    do
                        id = Math.floor(Math.random() * data.length);
                    while ($.inArray($scope.data[id].short, temp) > -1);
                }
                temp[j] = $scope.data[id].short;
            }
            $scope.choices.push(temp);
        }
    });

    $scope.removeLife = function() {
        $scope.gameObject.life = $scope.gameObject.life - 1;
        if ($scope.gameObject.life == 0) {
            gameOver();
        }
    };

    $scope.select = function(id, btn) {
        $(".imageSelected").removeClass("imageSelected");
        $("#img-" + id + "-" + btn).addClass("imageSelected");

        if ($scope.selected != btn) {
            $("div#" + id + " button[name='btn" + btn + "']").attr("class", 'btn btn-success');
            if ($scope.selected != -1)
                $("div#" + id + " button[name='btn" + $scope.selected + "']").attr("class", 'btn btn-default');
            $scope.selected = btn;
        } else {
            $("div#" + id + " button[name='btn" + btn + "']").attr("class", 'btn btn-default');
            $scope.selected = -1;
        }
    };

    $scope.check = function(id) {
        if ($scope.selected == -1)
            return;

        if ($scope.selected == $scope.answer[id]) {
            if (id < $scope.data.length - 1) {
                $("#listenWizard").smartWizard('goForward');
                $scope.step++;
            } else {
                gameOver();
            }
            $scope.selected = -1;
        } else {
            $scope.removeLife();
        }
    };

}).controller('wordCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };
    $scope.answer = [];
    $scope.choices = [];
    $scope.selected = -1;
    $scope.step = 0;

    var urlStr = "../../data/totaln5/data/vocab/json/default.json";
    $http({
        method: "GET",
        url: urlStr
    })
        .success(function(data, status) {
            $scope.data = akiraShuffle(data);

            for (i = 0; i < $scope.data.length; i++) {
                var answer = Math.floor(Math.random() * 3);
                $scope.answer[i] = answer;
                var temp = [];
                temp[answer] = $scope.data[i].hiragana;
                for (j = 0; j < 3; j++) {
                    if (j == answer)
                        continue;
                    else {
                        var id;
                        do
                            id = Math.floor(Math.random() * data.length);
                        while ($.inArray($scope.data[id].hiragana, temp) > -1);
                    }
                    temp[j] = $scope.data[id].hiragana;
                }
                $scope.choices.push(temp);
            }
        });



    $scope.removeLife = function() {
        $scope.gameObject.life--;
        if ($scope.gameObject.life == 0) {
            gameOver();
        }
    };


    $scope.select = function(id, btn) {
        if ($scope.selected != btn) {
            $("div#" + id + " button[name='btn" + btn + "']").attr("class", 'btn btn-success');
            if ($scope.selected != -1)
                $("div#" + id + " button[name='btn" + $scope.selected + "']").attr("class", 'btn btn-default akr-btn');
            $scope.selected = btn;
        } else {
            $("div#" + id + " button[name='btn" + btn + "']").attr("class", 'btn btn-default akr-btn');
            $scope.selected = -1;
        }
    };

    $scope.check = function(id) {
        if ($scope.selected == -1)
            return;
        if ($scope.selected == $scope.answer[id]) {
            if (id < $scope.data.length - 1) {
                $("#listenWizard").smartWizard('goForward');
                $scope.step++;
            } else {
                gameOver();
            }
            $scope.selected = -1;
        } else {
            $scope.removeLife();
        }
    };

});

totaln5Ctrls.controller('listenCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };
    $scope.step = 0;

    var urlStr = "../../data/totaln5/lesson" + $routeParams.lessonId + "/sub" + $routeParams.partId + "/json/default.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = akiraShuffle(data);
    });



    $scope.playSound = function(id, isNormal) {
        var audioSrc = document.getElementById(id).getElementsByTagName('source');
        $("audio#" + id + " source").attr("src", "../../data/totaln5/data/vocab/audio/" + $scope.data[id].short + ".mp3");
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
            gameOver();
        }
    };

    $scope.check = function(id) {
        var ret = akiraStepValidation(id);
        if (!ret) {
            $scope.removeLife();
        }
        $("#btn-check-" + id).hide();
        $("#btn-next-" + id).show();
    }

    $scope.next = function(id) {
        if (!angular.equals($scope.step, $scope.data.length)) {
            $scope.step++;
            $("#listenWizard").smartWizard('goForward');
        } else {
            gameOver();
        }
    }
}).controller('connectCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3,
        "score": 0
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
        if (angular.equals($scope.gameObject.life, 0)) {
            gameOver();
        }
    };

    $scope.check = function() {
        $scope.step++;
        if (angular.equals($scope.step, 7)) {
            gameOver();
        }
    }
}).controller('writeCtrl', function($scope, $routeParams, $http) {
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
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
            gameOver();
        }
    };

    $scope.check = function(id) {
        var ret = akiraStepValidation(id);
        if (!ret) {
            $scope.removeLife();
        }
        $("#btn-check-" + id).hide();
        $("#btn-next-" + id).show();
    }

    $scope.next = function(id) {
        if (!angular.equals($scope.step, $scope.data.length)) {
            $scope.step++;
            $("#writeWizard").smartWizard('goForward');
        } else {
            gameOver();
        }
    }
});

/*Grammar controller*/
totaln5Ctrls.controller('grammarListenCtrl', function($scope, $routeParams, $http) {
    var urlStr = "../../data/totaln5/data/grammar/json/type1.json";
    $http({
        method: "GET",
        url: urlStr
    }).
    success(function(data, status) {
        $scope.data = filter(data, 'id', $routeParams.lessonId);
    });
    $scope.lessonId = $routeParams.lessonId;
    $scope.partId = $routeParams.partId;
    $scope.gameObject = {
        "life": 3
    };

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
