(function () {
    'use strict';

    var congressApp = angular.module('nfCtrl', [])

    .controller('notfoundcontroller', ['$scope', 'ObjectTranslator', '$translate', function ($scope, ObjectTranslator, $translate) {

        function initLang() {
        }

        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();
