(function () {

    'use strict';
angular.module('eFac', [])
.directive('facilities', ['ObjectTranslator', function (ObjectTranslator) {
    return {
        restrict: 'E',
        scope: {}, // isolate scope
        templateUrl: '/app/directives/facilities/facilities.html',
        controller: ['$scope', function ($scope) {
            function initLang(){
                $scope.tabs = ObjectTranslator.Get('home.offer', ['id', 'title', 'thumb', 'summary']).then(function (res) {
                    $scope.tabs = res;
                })
            }

            ObjectTranslator.Subscribe($scope, initLang);
        }]
    }
}])

})();