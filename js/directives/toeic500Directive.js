var toeic500Directives = angular.module('toeic500Directives', []);

toeic500Directives.directive('ngRepeatShuffle', function() {
    var id = setInterval(function() {
        $(".hira-wrapper span").shuffle();
        $(".vi-wrapper span").shuffle();
        window.clearInterval(id);
    }, 200);

    return {
        restrict: 'A'
    };
});
toeic500Directives.directive('grammarListenDirective', function() {
    setInterval(function() {
        $('#grammarListenWizard').smartWizard({
            enableAllSteps: true,
            includeFinishButton: false,
            labelNext: "Check",
            onLeaveStep: leaveAStepCallback
        });
        $('#grammarListenWizard .buttonPrevious').hide();
        $('#grammarListenWizard .buttonFinish').hide();
    }, 200);
    clearInterval();
});

toeic500Directives.directive('grammarChoiceDirective', function() {
    setInterval(function() {
        $('#grammarChoiceWizard').smartWizard({
            enableAllSteps: true,
            includeFinishButton: false,
            labelNext: "Check",
            onLeaveStep: grammarChoiceLeaveStep
        });
        $('#grammarChoiceWizard .buttonPrevious').hide();
        $('#grammarChoiceWizard .buttonFinish').hide();
    }, 200);
    clearInterval();

    return {
        restrict: 'A'
    };
});
