(function () {
    'use strict';

    var congressApp = angular.module('prodCtrl', [])

    .controller('productcontroller', ['$scope', 'ObjectTranslator', '$translate', function ($scope, ObjectTranslator, $translate) {

        function initLang() {
        }
        ObjectTranslator.Subscribe($scope, initLang);

    }])

})();
