(function () {

    'use strict';
    var mslider = angular.module('quickContact', ['vcRecaptcha'])
.directive('quickcontact', ['rcKey','vcRecaptchaService',function (rcKey, recaptcha) {
    return {
        templateUrl: '/app/directives/quickcontact/quickcontact.html',
        scope: {},
        controller: function ($scope, $http) {
            $scope.charlimit = 40;
            $scope.formsent;
            $scope.eml;
            $scope.msg = '';
            $scope.recaptchakey = rcKey;
            $scope.captcharesponse;

            $scope.setCaptchaResponse = function (response) {
                $scope.captcharesponse = response;
            }

            $scope.setWidgetId = function (widgetId) {
                $scope.captchawidgetid = widgetId;
            }

            $scope.sendForm = function () {
                var vm = { id: 1, captcha: $scope.captcharesponse, email: $scope.eml, msg: $scope.msg};
                $http.post('/api/mc.php', angular.toJson(vm)).then(function (response) {
                     console.log(response);
                }, function error() {
                    //In case of a failed validation you need to reload the captcha
                    // because each response can be checked just once
                    recaptcha.reload($scope.captchawidgetid);
                });
                $scope.formsent = true;
            }
        }
    }
}])

})();