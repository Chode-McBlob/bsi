(function () {
    'use strict';

    var congressApp = angular.module('actCtrl', [])

    .controller('activitycontroller', ['$scope', '$routeParams', 'ObjectTranslator','$translate', '$location', function ($scope, $routeParams, ObjectTranslator,$translate, $location) {

        function initLang() {
            var fields = ['title', 'bigpic', 'bigpicalt', 'par', 'parquote', 'parquoter', 'parthumb', 'parb', 'parb2', 'parbthumb'];
            $scope.article = ObjectTranslator.GetById('activity', fields, $routeParams.contentid);
            if (!$scope.article || $scope.article.title == 'title') {
                $location.url('/notfound');
            }
        }
    
        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();
