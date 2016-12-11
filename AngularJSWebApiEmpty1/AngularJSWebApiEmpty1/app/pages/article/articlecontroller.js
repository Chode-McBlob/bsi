(function () {
    'use strict';

    var app = angular.module('articleCtrl', [])

    .controller('articlecontroller', ['$scope', 'ObjectTranslator', '$routeParams', '$location', function ($scope, ObjectTranslator, $routeParams, $location) {
        $scope.article;
        $scope.links;

        $scope.initLanguage = function () {
            var fields = ['id', 'title', 'headline', 'smry', 'smryb', 'par', 'parquote', 'parquoter', 'parthumb', 'parb', 'parbthumb','nat'];
            $scope.article = ObjectTranslator.GetById('articles', fields, $routeParams.contentid);

            //if (!$scope.article || $scope.article.title == 'title')
                //$location.url('/notfound');

            $scope.links = ObjectTranslator.GetNested('articles.links', ['link', 'url']).then(function (res) {
                $scope.links = res[0].acts;
            })
        }

        ObjectTranslator.Subscribe($scope, $scope.initLanguage);
    }])

})();


