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
        hasViewPermission();
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
 * Loadstar information for specific
 * @param  {[type]} courseName Availabel courses in website: kana/totaln5/kanjin5/totaln4/kanjin4
 * @param  {[type]} lesson     Availabel lesson in each course: 1..25
 * @param  {[type]} subtopic   Availabel subtopic in each lesson: hira,kana,vocab1,vocab2,vocab3,grammar
 * @param  {[type]} game       Availabel skill in each subtopic: write,picture,word,listen,connect,write,listen(grammar),translate,read(grammar),write(grammar),chooice(grammar)
 * @return {[type]}            [description]
 */
function loadStar(courseName, lesson, subtopic, game) {
    $.getJSON("../../data/star.json", function(data) {
        console.info("Get star for: " + courseName + " / " + lesson + " / " + subtopic + " / " + game);
    });
}
/**
 * Check current user have permission to view current page or not.
 * @return {Boolean}
 */
function hasViewPermission() {
    return sessionStorage.getItem("authorized") === "true";
}

function getUser() {
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

function gameOver(correctAns) {
    console.log(correctAns);

    var star;
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
    saveScore(xp);
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


function saveScore(xp) {
    var uid = 0;
    $.getJSON("http://akira.edu.vn/wp-content/plugins/akira-api/akira_score.php", {
        id: uid,
        score: xp
    })
        .done(function(data) {
            console.info("Score saved");
        });
}

/**
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
/*===================================
=            UX handlers            =
===================================*/


/**
 * Keyboard handler for TotalN5-Listen&Write(maybe) game
 * @param  {[type]} idWizard [description]
 * @return {[type]}          [description]
 */
function handleKey2(idWizard) {
    $(document).keydown(function(e) {
        var key = $("#" + idWizard).smartWizard('currentStep') - 1;
        if (e.keyCode == 13) {
            angular.element("#" + idWizard).scope().check(key);
        }
    });
}


/**
 * Keyboard handler for TotalN5-Vocab&Grammar game
 * @param  {[type]} idWizard [description]
 * @return {[type]}          [description]
 */
function handleKey(idWizard) {
    //Register event trigger for windows
    $(document).keydown(function(e) {
        var key = $("#" + idWizard).smartWizard('currentStep') - 1;
        if (e.keyCode == 13) {
            angular.element("#" + idWizard).scope().check(key);
        }
        switch (e.keyCode) {
            case 49:
                angular.element("#" + idWizard).scope().select(key, 0);
                break;
            case 50:
                angular.element("#" + idWizard).scope().select(key, 1);
                break;
            case 51:
                angular.element("#" + idWizard).scope().select(key, 2);
                break;
        }
    });
}



/*-----  End of UX handlers  ------*/


/*=========================================
=            Validation method            =
=========================================*/
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
    console.info("Akira validation....");
    return true;
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
