var aDirect = angular.module("akrSharedDirectives", ['akrUtilService']);

aDirect.directive('akrprofile', function($window) {
    function link(scope, element, attrs) {
        scope.upt();
    };

    return {
        restrict: 'E',
        link: link,
        templateUrl: '../../view/_shared/profileoverview.html',
        controller: function($scope, $sce, utilService) {
            $scope.renderHtml = function(e) {
                return $sce.trustAsHtml(e);
            };

            $scope.redeem = function() {
                var code = $('#code').val();
                $.ajax({
                    type: 'POST',
                    url: 'http://akira.edu.vn/wp-content/plugins/akira-api/redeem.php',
                    data: {
                        code: code,
                        userId: getUser().id
                    }
                }).done(function(success) {
                    utilService.update(success);
                }).fail(function(error) {
                    console.log(error);
                });
            };

            $scope.upt = function() {
                if (localStorage.hasOwnProperty("user")) {
                    var user = JSON.parse(localStorage.getItem("user"));
                    $scope.user = user;
                    $scope.userLevel = calculateLevel(akrParseInt(user.exp));
                    $scope.userProgress = levelProgress(akrParseInt(user.exp));
                    $scope.mentorLevel = calculateLevel(akrParseInt(user.mentor_exp));
                    $scope.mentorProgress = levelProgress(akrParseInt(user.mentor_exp));
                } else {
                    $scope.user = "Anonymous";
                }
            }

            $scope.logout = function() {
                localStorage.clear();
                $window.location.href="/";
            }

            $scope.$on('userInfoUpdated', function(e, d) {
                $scope.upt();
                $scope.$apply();
            });
        }
    };
});

aDirect.directive('akrleaderboard', function($http) {
    var urlStr = "http://akira.edu.vn/wp-content/plugins/akira-api/akira_rank.php";

    function link(scope, element, attrs) {
        $http({
                method: "GET",
                url: urlStr
            })
            .success(function(data, status) {
                scope.rank = data;
            });
    }
    return {
        restrict: 'E',
        link: link,
        controller: function($q,$scope, $sce) {
            $scope.onl = [];

            $scope.renderHtml = function(e) {
                return $sce.trustAsHtml(e);
            }

            $scope.callChat = function(uname,uid) {
                if (uid != getUser().id){
                	chatWith(uid,uname);
                }
            }

            $scope.isOn=function(uid){
                if($scope.onl.indexOf(uid.toString())!=-1){
                    return true
                }else{
                    return false;
                }
            }

            $scope.updOnline =function(lst){
                $scope.onl = lst;
                $scope.$apply();
            }
        },
        templateUrl: '../../view/_shared/leaderboard.html'
    };
});

aDirect.directive('akirawizard', function(utilService) {
    function link(scope, element, attrs) {
        setTimeout(function() {
            // Decide the effect of jquerysmard wizard based on the current screen
            var effect = "slide";
            if (attrs.id == "subtopicWizard") {
                effect = "slideleft";
            }

            $('#' + attrs.id).smartWizard({
                enableAllSteps: "true" === attrs.enablestep,
                keyNavigation: false,
                onShowStep: utilService.showStep, //akrShowStep,
                onLeaveStep: utilService.leaveStep, //akrLeaveStep,
                selected: attrs.step,
                transitionEffect: effect
            });

            //Hide action bar
            $('#' + attrs.id + ' .actionBar').hide();
            changeLang();

            // Initialize tooltip
            $(".fa-lock").tooltip();
            $('#' + attrs.id).show();

            //Initialize Kanji Dict
            kanjiDict();
        }, 500);
    }

    return {
        restrict: 'A',
        link: link
    };
});

aDirect.directive('akrlife', function() {
    function link(scope, element, attrs) {
        scope.ret = attrs.ret;
        attrs.$observe('life', function(value) {
            scope.life = attrs.life;
        });

        attrs.$observe('progress', function(value) {
            scope.progress = attrs.progress;
        });
    };

    var _isNotMobile = (function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return !check;
    })();

    return {
        restrict: 'E',
        link: link,
        templateUrl: function(urlAttr) {
            return (_isNotMobile) ? '../../view/_shared/life.html' : '../../view/_shared/mobi_life.html';
        }
    };
});

aDirect.directive('akrdomshuffle', function() {
    function link(scope, element, attrs) {
        setTimeout(function() {
            $(".hira-wrapper span").shuffle();
            $(".vi-wrapper span").shuffle();
        }, 10);
    }

    return {
        restrict: 'AC',
        link: link
    };
})

aDirect.directive('akrhint', function() {
    function link(scope, element, attrs) {
        scope.ret = attrs.ret;
        attrs.$observe('life', function(value) {
            scope.life = attrs.life;
        });

        attrs.$observe('progress', function(value) {
            scope.progress = attrs.progress;
        });
    };

    var _isNotMobile = (function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return !check;
    })();

    return {
        restrict: 'E',
        link: link,
        templateUrl: function(urlAttr) {
            return (_isNotMobile) ? '../../view/_shared/hint.html' : '../../view/_shared/mobi_hint.html';
        }
    };
});

aDirect.directive('akrconnect', function() {
    function link(scope, element, attrs) {
    };

    return {
        restrict: 'E',
        link: link,
        templateUrl: '../../view/_shared/connectitem.html',
        scope:{
            itemtitle:'@title',
            itemid :'@id',
            itemclass:'@class',
            itemtype: '@type'
        },
        controller:function($scope,$rootScope){   
            $scope.onselect = function(e){
                $(".selected").removeClass("selected");
                $("#"+e.itemid).addClass("selected");
                $rootScope.$broadcast('itemSelected',{"id":e.itemid,"class":e.itemclass,"type":e.itemtype});
            }
        }
    };
});

aDirect.directive('mobiansitem', function() {
    function link(scope, element, attrs) {
    };

    return {
        restrict: 'E',
        link: link,
        templateUrl: '../../view/_shared/mobiitem.html',
        scope:{
            itemtitle:'@title',
            itemid :'@id',
            itemclass:'@class',
            itemtype: '@type',
            itemimage: '@image',
            itemaudio :'@audio'
        },
        controller:function($scope,$rootScope){   
            $scope.onselect = function(e){
                var selId = "audioPlayer";
                var audioSrc = document.getElementById(selId).getElementsByTagName('source');
                $("audio source").attr("src", "../../data/" + e.itemaudio + ".mp3");
                document.getElementById(selId).load();
                document.getElementById(selId).play();

                $(".selected").removeClass("selected");
                $("#"+e.itemid).addClass("selected");
                $rootScope.$broadcast('itemSelected',{"id":e.itemid,"class":e.itemclass,"type":e.itemtype});
            }
        }
    };   
});

aDirect.directive('multilang', function() {
    function link(scope, element, attrs) {

    };

    return {
        restrict: 'E',
        link: link,
        templateUrl: '../../view/_shared/multilang.html',
        scope:{
            obj: '=' 
        },
        controller:function($scope,$rootScope){
            $scope.$on("siteLangChanged",function(e,args){
                $scope.lang = args.lang;
            });
        }
    };
});