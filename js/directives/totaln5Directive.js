var totaln5Directives = angular.module('totaln5Directives', []);

totaln5Directives.directive('akiradirective', function() {
    setInterval(function() {
        $('#listenWizard').smartWizard({
            enableAllSteps: true,
            includeFinishButton: false,
            //labelNext:"Check",
            //onLeaveStep: leaveAStepCallback
        });
        $('#listenWizard .buttonPrevious').hide();
        $('#listenWizard .buttonNext').hide();
        $('#listenWizard .buttonFinish').hide();
    }, 200);
    clearInterval();

    return {
        restrict: 'A'
    };
}).directive('ngRepeatShuffle', function() {
    var id = setInterval(function() {
        $(".hira-wrapper span").shuffle();
        $(".vi-wrapper span").shuffle();
        window.clearInterval(id);
    }, 200);

    return {
        restrict: 'A'
    };
}).directive('grammarListenDirective', function() {
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
}).directive('grammarChoiceDirective', function() {
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
