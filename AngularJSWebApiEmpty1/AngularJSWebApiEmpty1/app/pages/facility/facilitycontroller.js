(function () {
    'use strict';

    var congressApp = angular.module('facilityCtrl', [])

    .controller('facilitycontroller', ['$scope', '$routeParams', 'ObjectTranslator', '$translate', '$location', function ($scope, $routeParams, ObjectTranslator, $translate,  $location) {
        function initLang() {
            var fields = ['bigpic', 'bigpicalt', 'title', 'subtitle', 'par', 'parb', 'adtitle', 'adline', 'city', 'cttitle', 'phline', 'phone', 'emlline', 'email', 'fb', 'tw'];
            $scope.article = ObjectTranslator.GetById('facility', fields, $routeParams.contentid);
            console.log($scope.article)
            if (!$scope.article || $scope.article.title == 'title')
                $location.url('/notfound');
        }

        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();
