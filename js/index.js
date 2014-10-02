/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        changeLang(i18n.lng());
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

};

function changeLang(code) {
    var item = (code === undefined || code === "" || code === null) ? "vi" : code;
    i18n.init({
        lng: code,
        resGetPath: '../../locales/__lng__/__ns__.json'
    }, function() {
        $('body').i18n();
    });
}

/**
 * Get user information from session storage
 * @return {[type]} [description]
 */
function getUser() {
    return {
        "id": 17
    };
    return JSON.parse(sessionStorage.user);
}


/**
 * Compare two string
 * @param  {[type]} oldStr [description]
 * @param  {[type]} newStr [description]
 * @return {[type]}        [description]
 */
function compare(oldStr, newStr) {
    return (oldStr.trim().replace(/ /g, "") === newStr.trim().replace(/ /g, ""));
}

/**
 * Filter correct data for course, because now all data for a coures is in a file
 * @param  {[type]} data  [description]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function filter(data, key, value) {
    var uniqueGroups = [];
    $.each(data, function(idx, val) {
        if (data[idx][key] == value) {
            uniqueGroups.push(data[idx]);
        }
    });
    return uniqueGroups;
}

function gameOver(course, lesson, subtopic, game, correctAns) {
    var star = 0;
    if (correctAns >= 8) {
        star = 3;
    } else if (correctAns >= 5) {
        star = 2;
    } else if (correctAns >= 3) {
        star = 1;
    } else {
        star = 0;
    }
    var xp = correctAns;
    saveScore(course, lesson, subtopic, game, star, xp);
    $(".game-over-modal-sm .game-star").html(star);
    $(".game-over-modal-sm .game-score").html(xp);
    $(".game-over-modal-sm").modal({
        keyboard: false
    });

    $('.game-over-modal-sm').on('hide.bs.modal', function(e) {
        window.location.href = "./";
    });
}



/**
 * Shuffle an array
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function akiraShuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array.splice(0, 9);
}


/**
 * Need to shuffle the generated answer again
 * @param  {[type]} data   [description]
 * @param  {[type]} ansKey [description]
 * @return {[type]}        [description]
 */
function genAnswers(data, ansKey, numberOfAns) {
    var uniqueGroups = [];
    $.each(data, function(idx, val) {
        var obj = [];

        var rand1;
        obj.push(data[idx][ansKey]);

        do {
            rand1 = Math.floor((Math.random() * data.length));
        } while (rand1 == idx);
        obj.push(data[rand1][ansKey]);

        if (numberOfAns == 3) {
            var rand2;
            do {
                rand2 = Math.floor((Math.random() * data.length));
            } while (rand2 == idx || rand2 == rand1);
            obj.push(data[rand2][ansKey]);
        }

        uniqueGroups[idx] = akiraShuffle(obj);
    });
    return uniqueGroups;
}

/**
 * Generate answer for translate game in grammar
 * @return {[type]} [description]
 */
function genAnswers2(data) {
    var uniqueGroups = [];
    $.each(data, function(idx, val) {
        var obj = data[idx]["hiragana"].trim().replace(/ /g, String.fromCharCode(12288)).replace(new RegExp(String.fromCharCode(12288) + "{1,}", 'g'), "|").split("|");
        uniqueGroups[idx] = akiraShuffle(obj);
    });
    return uniqueGroups;
}


function saveScore(course, lesson, subtopic, game, star, exp) {
    $.ajax({
        type: 'POST',
        url: "http://akira.edu.vn/wp-content/plugins/akira-api/save_score.php",
        crossDomain: true,
        data: {
            userId: getUser().id,
            course: course,
            lesson: lesson,
            subtopic: subtopic,
            game: game,
            star: star,
            exp: exp
        }
    }).done(function(data) {
        console.info("Score saved");
    });
}

/**
 * @deprecated [description]
 * Common validation method for answer check
 * event fired -> get user ans -> compare with correct ans -> show message -> change fired event text & behave.
 * @param  {[type]} e        [description]
 * @param  {[type]} wizardId [description]
 * @return {[type]}          [description]
 */
function akiraStepValidation(id) {
    //Get user ans
    var ans = $("#input-" + id).val();
    var correct = $("#ans-" + id).val();
    var message = $("#mess-" + id).html();

    $(".mess-holder-" + id + " >div").first().html(message);
    $(".failed").removeClass("failed");
    $(".success").removeClass("success");
    if (compare(ans, correct)) {
        $(".mess-holder-" + id).addClass("success");
        $(".mess-holder-" + id + " >div").first().find(".fa").css("color", "green");
        return true;

    } else {
        $(".mess-holder-" + id).addClass("failed");
        $(".mess-holder-" + id + " >div").first().find(".fa").css("color", "red");
        return false;

        // $("#sublife").trigger("click");
    }
}

/*=========================================
=            Validation method            =
=========================================*/
/**
 * @deprecated
 * @param  {[type]} obj     [description]
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
function leaveAStepCallback(obj, context) {
    var classStr = "success";
    var ret = compare($("#ans-" + (context.fromStep - 1)).val(), $("#input-" + (context.fromStep - 1)).val())

    if (!ret) {
        $("#sublife").trigger("click");
        classStr = "failed";
    }
    $(".swMain .actionBar .msgBox").removeClass("failed");
    $(".swMain .actionBar .msgBox").removeClass("success");
    $(".swMain .actionBar .msgBox").addClass(classStr);
    $(".swMain").smartWizard('showMessage', $("#mess-" + (context.fromStep - 1)).html());

    return ret;
};

function grammarChoiceLeaveStep(obj, context) {
    var ret = compare($("#ans-" + (context.fromStep - 1)).val(), $("#input-" + (context.fromStep - 1)).val());
    if (!ret) {
        $("#sublife").trigger("click");
        $(".swMain").smartWizard('showMessage', $("#mess-" + (context.fromStep - 1)).html());
    }

    return ret;
}

/**
 * Global leave step validation method
 * @param  {[type]} obj     [description]
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
function akrLeaveStep(obj, context) {
    // return false;
    var ngScope = angular.element("#" + obj.context.id).scope();
    console.log(obj.context.id);
    if (ngScope.lessonId === undefined) {
        console.log("Bạn đang ở màn hình chọn lesson.");
    } else if (ngScope.lessonId !== undefined && ngScope.partId !== undefined && "subtopicWizard" === obj.context.id) {
        console.log("Bạn đang ở khóa học: " + ngScope.course + ", bài học: " + ngScope.lessonId + ", subtopic : " + context.fromStep + ", và đang chuyển sang subtopic: " + context.toStep);
        console.log("Bạn cần tối thiểu: " + context.toStep * 10 + " sao ở các suctopic trước.");
        var stars = getCurrentStar(ngScope.starData, ngScope.course, ngScope.lessonId, context.toStep);
        console.log("Số sao bạn có là: " + stars);
        if (context.toStep === 4) {            
            console.error("Bạn cần là thành viên VIP mới có thể sử dụng tính năng này");
            return false;
        }
        if (stars < (context.toStep - 1) * 10) {
            console.info("Bạn chưa đạt đủ số sao yêu cầu. Bạn còn thiếu: " + (context.toStep * 10 - stars));
            return false;
        }
    } else {
        console.log("Bước này không xác định hoặc là chưa xác định được");

    }
    return true;
}

function getCurrentStar(data, courseName, lessonId, partId) {console.log(data);
    var totalStar = 0;
    //Each subtopic inside a lesson on a course
    $.each(data[courseName][lessonId], function(idx) {
        if (idx > partId) {
            return false;
        }
        //Each game in a subtopic
        $.each(data[courseName][lessonId][idx], function(e) {
            totalStar = totalStar + parseInt(data[courseName][lessonId][idx][e]);
        });
    });

    return totalStar;
}

/**
 * Tính tổng số sao của một khóa học dùng cho các khóa(kana,kanjin5,kanjin5) ở màn hình  lựa chọn lesson
 * @param  {[type]} data   [description]
 * @param  {[type]} course [description]
 * @return {[type]}        [description]
 */
function getCourseStar(data, course) {
    var totalStar = 0;
    $.each(data[course], function(lesson) {
        $.each(data[course][lesson], function(sub) {
            $.each(data[course][lesson][sub], function(game) {
                totalStar += parseInt(data[course][lesson][sub][game]);
            });
        });
    });
    return totalStar;
}

/**
 * Tính progress của từng bài học trong một khoá(kana,kanjin4,kanjin5) ở màn hình lựa chọn lesson phần progress bar
 * @param  {[type]} data      [description]
 * @param  {[type]} course    [description]
 * @param  {[type]} subInLess [description]
 * @param  {[type]} gameInSub [description]
 * @return {[type]}           [description]
 */
function getCourseProgress(data, course, subInLess, gameInSub) {
    var progress = [];
    var maxstar = subInLess * gameInSub * 3;
    $.each(data[course], function(lesson) {
        var currstar = 0;
        $.each(data[course][lesson], function(sub) {
            $.each(data[course][lesson][sub], function(game) {
                currstar += parseInt(data[course][lesson][sub][game]);
            });
        });
        progress[lesson] = currstar / maxstar * 100;
    });
    return progress;
}

/**
 * Tính tổng số sao của một khóa( totaln5 và totaln4). ở màn hình lựa chọn lesson
 * @param  {[type]} data   [description]
 * @param  {[type]} course [description]
 * @return {[type]}        [description]
 */
function getTotalStar(data, course) {
    var vocabStar = 0;
    var grammarStar = 0;
    $.each(data[course], function(lesson) {
        $.each(data[course][lesson], function(sub) {
            $.each(data[course][lesson][sub], function(game) {
                if (sub == 4) {
                    grammarStar += parseInt(data[course][lesson][sub][game]);
                } else {
                    vocabStar += parseInt(data[course][lesson][sub][game]);
                }
            });
        });
    });

    return {
        "vocab": vocabStar,
        "grammar": grammarStar
    }
}

/**
 * Tính progress của từng bài học trong một khóa( totaln5 và totaln4). ở màn hình lựa chọn lesson phần progress bar
 * @param  {[type]} data      [description]
 * @param  {[type]} course    [description]
 * @param  {[type]} subInLess [description]
 * @param  {[type]} gameInSub [description]
 * @return {[type]}           [description]
 */
function getTotalProgress(data, course, subInLess, gameInSub) {
    var vocabProgress = [];
    var grammarProgress = [];
    var maxVocabStar = (subInLess - 1) * gameInSub * 3;
    var maxgrammarStar = gameInSub * 3;

    $.each(data[course], function(lesson) {
        var vocabStar = 0;
        var grammarStar = 0;

        $.each(data[course][lesson], function(sub) {
            $.each(data[course][lesson][sub], function(game) {
                if (sub == 4) {
                    grammarStar += parseInt(data[course][lesson][sub][game]);
                } else {
                    vocabStar += parseInt(data[course][lesson][sub][game]);
                }
            });
        });

        vocabProgress[lesson] = vocabStar / maxVocabStar * 100;
        grammarProgress[lesson] = grammarStar / maxgrammarStar * 100;
    });

    return {
        "vocab": vocabProgress,
        "grammar": grammarProgress
    }
}

/**
 * Tính tổng số sao trong một bài học của khóa(totaln5 và totaln4). Ở màn hình chọn subtopic và game
 * @param  {[type]} data   [description]
 * @param  {[type]} course [description]
 * @param  {[type]} lesson [description]
 * @return {[type]}        [description]
 */
function getTotalLessonStar(data, course, lesson) {
    var vocabStar = 0;
    var grammarStar = 0;
    /*  $.each(data[course], function(lesson) {
        if (lesson === lesson) {*/

    $.each(data[course][lesson], function(sub) {
        $.each(data[course][lesson][sub], function(game) {
            if (sub == 4) {
                grammarStar += parseInt(data[course][lesson][sub][game]);
            } else {
                vocabStar += parseInt(data[course][lesson][sub][game]);
            }
        });
    });
    /*        }
    });*/

    return {
        "vocab": vocabStar,
        "grammar": grammarStar
    }
}

/**
 * Tinh tong so sao cua mot bai hoc trong cac khoa: Kana, KanjiN5, KanjiN4
 * @param  {[type]} data   [description]
 * @param  {[type]} course [description]
 * @param  {[type]} lesson [description]
 * @return {[type]}        [description]
 */
function getLessonStar(data, course, lesson) {
    var star = 0;
    $.each(data[course][lesson], function(sub) {
        $.each(data[course][lesson][sub], function(game) {
            star += parseInt(data[course][lesson][sub][game]);
        });
    });
    return star;
}

function kanjiDict() {
    $(".kanji-dict").hover(function(e) {
        $(e.target).popover({
            content: translate($(e.target).text()),
            placement: 'bottom',
            trigger: 'hover'
        });

        $(e.target).popover('show');
    });
}

function translate(kanji) {
    return kanji;
}

/**
 * Tính toán xem trong bài học(lesson) này của khóa học(course) đã mở được đến topic nào rồi
 * @param  {[type]} data   [description]
 * @param  {[type]} course [description]
 * @param  {[type]} lesson [description]
 * @return {[type]}        [description]
 */
function getUnlockedSub(data, course, lesson) {
    var unlocked = [];
    var currentStar = 0;
    console.log(data[course]);
    $.each(data[course][lesson], function(sub) {
        var openSubStar = (sub - 1) * 10;

        $.each(data[course][lesson][sub], function(game) {
            currentStar += parseInt(data[course][lesson][sub][game]);
        });

        console.log("Số sao hiện tại là: " + currentStar);
        console.log("Tổng số sao cần để mở subtopic: " + sub + " của bài " + lesson + " trong course " + course + " là " + openSubStar);
        if (currentStar >= openSubStar) {
            console.log(sub);
            unlocked.push(parseInt(sub));
        } else {
            return false;
        }

    });

    console.log(unlocked);
    return unlocked;
}

/*-----  End of Validation method  ------*/

(function($) {
    /**
     * Create a DOM shuffle method for connect game
     * @return {[type]} [description]
     */
    $.fn.shuffle = function() {

        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function() {
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
            });

        this.each(function(i) {
            $(this).replaceWith($(shuffled[i]));
        });

        return $(shuffled);
    };
})(jQuery);
