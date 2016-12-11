(function () {

    'use strict';
    var congressApp = angular.module('homeCtrl', [])

.controller('homecontroller', ['$scope', '$routeParams', 'ObjectTranslator', '$translate', function ($scope, $routeParams, ObjectTranslator, $translate) {
        $scope.initLang = function() {
            var fields = ['icon', 'title', 'desc', 'link'];
            $scope.tabs = ObjectTranslator.GetNested('goodies', fields).then(function (res) {
                $scope.tabs = res[0].acts;
            });
        }

        ObjectTranslator.Subscribe($scope, $scope.initLang);
}])

.directive('bsigmap', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var address = elem.data("address");
            var latlng = elem.data("latlng");
            var zoom = elem.data("zoom");
            var mapstyle = elem.data("mapstyle");
            var title = elem.data("title");
            var descr = elem.data("popupstring-id");
            var marker = elem.data("marker");
            var map = gmapUtil.setgmap(elem, address, latlng, zoom, mapstyle, title, descr, marker);
            elem.data("gmap", map);
        }
    };
});

})();


