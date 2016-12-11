(function () {
    'use strict';

    var congressApp = angular.module('ctCtrl', [])

    .controller('contentcontroller', ['$scope', 'ObjectTranslator', '$translate',  '$routeParams', function ($scope, ObjectTranslator, $translate,  $routeParams) {

        function initLang() {
            var contentpageId = $routeParams.contentid;
            $scope.pagetitle = $translate.instant(contentpageId + '.pagetitle');
            $scope.pagect = ObjectTranslator.GetNested(contentpageId, ['section', 'title', 'p1', 'p2','img']).then(function (res) {
                $scope.pagect = res[0].acts;
            })
        }

        ObjectTranslator.Subscribe($scope, initLang);

        $scope.isArr = function (obj) {
            return angular.isArray(obj); // werkt niet in {{ }} notatie
        };

    }])

})();
