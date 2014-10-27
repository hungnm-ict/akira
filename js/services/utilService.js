/**
 * @author AnhDN
 * @type {[type]}
 */
var serv = angular.module('akrUtilService', []);

serv.service('utilService', function($http, $rootScope) {
    var pU = [14, 17];

    /**
     * Update user related information from server
     * @param  {[type]} k [description]
     * @param  {[type]} v [description]
     * @return {[type]}   [description]
     */
    this.update = function(obj) {
        try {
            var u = getUser();
            $.each(obj, function(k, v) {
                if (u.hasOwnProperty(k)) {
                    u[k] = v;
                }
            });
            localStorage.setItem("user", JSON.stringify(u));
            $rootScope.$broadcast("userInfoUpdated");
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Show a step callback
     * @param  {[type]} obj     [description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    this.showStep = function(obj, context) {
        try {
            var ngScope = angular.element("#" + obj.context.id).scope();

            //Check if this is autoplay audio
            if ($("#" + obj.context.id).attr("akrautoplayaudio") == "true") {
                ngScope.playSound(context.toStep - 1, true);
            }

            //Check if this is autofocus input
            if ($("#" + obj.context.id).attr("akrfocus") == "true") {
                setTimeout(function() {
                    $("#input-" + (context.toStep - 1)).focus();
                }, 1);
            }

            if ($("#" + obj.context.id).attr("clear") == "true") {
                $('.drop-zone').html('');
            }

        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Leave a step callback
     * @param  {[type]} obj     [description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    this.leaveStep = function(obj, context) {
        try {
            //If user is power user we automatically transfer it
            if (pU.indexOf(getUser().id)) {
                return true;
            };

            var ngScope = angular.element("#" + obj.context.id).scope();

            if (ngScope.lessonId === undefined) {
                // console.log("Bạn đang ở màn hình chọn lesson.");
            } else if (ngScope.lessonId !== undefined && ngScope.partId !== undefined && "subtopicWizard" === obj.context.id) {
                // console.log("Bạn đang ở khóa học: " + ngScope.course + ", bài học: " + ngScope.lessonId + ", subtopic : " + context.fromStep + ", và đang chuyển sang subtopic: " + context.toStep);
                // console.log("Bạn cần tối thiểu: " + context.toStep * 10 + " sao ở các suctopic trước.");
                var stars = getCurrentStar(ngScope.starData, ngScope.course, ngScope.lessonId, context.toStep);
                // console.log("Số sao bạn có là: " + stars);
                if (context.toStep === 4 && ("totaln5" == ngScope.course || "totaln4" == ngScope.course)) {
                    // console.error("Bạn cần là thành viên VIP mới có thể sử dụng tính năng này");
                    return false;
                }
                if (stars < (context.toStep - 1) * 10) {
                    // console.info("Bạn chưa đạt đủ số sao yêu cầu. Bạn còn thiếu: " + (context.toStep * 10 - stars));
                    return false;
                }
            } else {
                // console.log("Bước này không xác định hoặc là chưa xác định được");
            }
            return true;
        } catch (err) {
            console.error(err);
        }
    };
});


serv.service('gameService', function(utilService,$window) {
    this.saveScore = function(course, lesson, subtopic, game, star, exp) {
        $.ajax({
            type: 'POST',
            url: "http://akira.edu.vn/wp-content/plugins/akira-api/save_score.php",
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
            console.log(data);
            utilService.update(data);
        }).fail(function(xhr, status, err) {
            console.error(err);
        });
    };

    this.gameOver = function(course, lesson, subtopic, game, correctAns, noOfQuestion) {
        var star = 0;
        if (correctAns / noOfQuestion >= 0.8) {
            star = 3;
        } else if (correctAns / noOfQuestion >= 0.5) {
            star = 2;
        } else if (correctAns / noOfQuestion >= 0.3) {
            star = 1;
        } else {
            star = 0;
        }
        var xp = correctAns;
        this.saveScore(course, lesson, subtopic, game, star, xp);
        $(".game-over-modal-sm .game-star").html(star);
        $(".game-over-modal-sm .game-score").html(xp);
        $(".game-over-modal-sm .star-wrapper").addClass("star-" + star);
        $(".game-over-modal-sm").modal({
            keyboard: true
        });

        $('.game-over-modal-sm').on('hide.bs.modal', function(e) {
            window.location.reload();
            window.history.back();
        });
    };

    this.testoutOver = function(course, lesson, subtopic, game, correctAns, noOfQuestion) {
        try {
            if (status) {
                $(".testout-over-modal-sm .message").html(i18n.t("message.info.testsucess"));
                $.ajax({
                    type: 'POST',
                    url: "http://akira.edu.vn/wp-content/plugins/akira-api/save_keypoint.php",
                    crossDomain: true,
                    data: {
                        userid: getUser().id,
                        course: course,
                        lessonid: lessonid,
                        type: type,
                    }
                }).done(function(data) {
                    console.info(data);
                    utilService.update(data);
                }).fail(function(xhr, status, err) {
                    console.error(err);
                });
            } else {
                $(".testout-over-modal-sm .message").html(i18n.t("message.info.testfailed"));
            }
            $(".testout-over-modal-sm").modal({
                keyboard: true
            });
            $('.testout-over-modal-sm').on('hide.bs.modal', function(e) {
                window.history.back();
            });
        } catch (err) {
            console.error(err);
        }
    };
});
