(function () {

    'use strict';
angular.module('eSched', [])
.directive('eventschedule', ['ObjectTranslator', function (ObjectTranslator) {
    return {
        restrict :'E',
        templateUrl: '/app/directives/eventschedule/schedule.html',
        scope: {},
        controller: ['$scope', function ($scope) {

            function initLang() {
                $scope.tabs = ObjectTranslator.GetNested('schedule', ['ctid', 'cttitle', 'ctthumb', 'ctsummary', 'ctartist', 'ctcompany', 'cttime', 'ctlocation','show']).then(function (res) {
                    $scope.tabs = res;
                 })
            }
            ObjectTranslator.Subscribe($scope, initLang);

        }]
    }
}])

})();
