(function () {
    'use strict';

    var congressApp = angular.module('conCtrl', [])

    .controller('contactcontroller', ['$scope', 'ObjectTranslator', '$translate', function ($scope, ObjectTranslator, $translate) {

        function initLang() {
        }

        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();
