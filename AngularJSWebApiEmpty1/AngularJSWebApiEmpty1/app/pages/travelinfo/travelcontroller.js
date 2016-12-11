(function () {
    'use strict';

    var congressApp = angular.module('trvCtrl', [])

    .controller('trvcontroller', ['$scope', '$routeParams', '$translate', 'ObjectTranslator', function ($scope, $routeParams, $translate, ObjectTranslator) {

         function initLang() {
            var fields = ['name', 'address', 'phone', 'website', 'wdist', 'img', 'desc'];
            $scope.tabs = ObjectTranslator.GetNested('travelinfo', fields).then(function (res) {
                $scope.tabs = res[0].acts;
            })
        }

        ObjectTranslator.Subscribe($scope, initLang);

    }])

})();
