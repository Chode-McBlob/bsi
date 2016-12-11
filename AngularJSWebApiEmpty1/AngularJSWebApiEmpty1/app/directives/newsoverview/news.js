(function () {

    'use strict';
angular.module('eNews', [])
.directive('newsoverview', ['ObjectTranslator', function (ObjectTranslator) {
    return {
        restrict :'E',
        templateUrl: '/app/directives/newsoverview/news.html',
        scope: {},
        controller: ['$scope', function ($scope) {
            $scope.tabs;
            $scope.djs;

            function initLang() {
                $scope.tabs = ObjectTranslator.Get('home.newsoverview', ['id', 'title', 'thumb', 'summary', 'articledate', 'authorthumb', 'nat','readmore']).then(function (res) {
                    $scope.tabs = res;
                });
                $scope.djs = ObjectTranslator.Get('home.djs', ['id', 'title', 'thumb', 'summary', 'articledate', 'authorthumb', 'nat', 'readmore']).then(function (res) {
                    $scope.djs = res;
                });
            }
            ObjectTranslator.Subscribe($scope, initLang);
        }]
    }
}])

})();


