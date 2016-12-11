(function () {
    'use strict';

    var congressApp = angular.module('abssCtrl', ['vcRecaptcha'])

    .controller('absscontroller', ['$scope', '$http', '$routeParams', '$translate', 'CountrySVC', 'rcKey', 'vcRecaptchaService', function ($scope, $http, $routeParams, $translate, CountrySVC, rcKey, vcRecaptchaService) {

        $scope.recaptchakey = rcKey;

        $scope.setCaptchaResponse = function (response) {
            $scope.captcharesponse = response;
        }

        $scope.setWidgetId = function (widgetId) {
            $scope.captchawidgetid = widgetId;
        }

        $scope.formsent;
        $scope.countries = CountrySVC.getCountries();
        $scope.frmuser = { name: '', email: '', city: '', country: 'SK', fb: '', prefs: [] };

        var musicprefs = $translate.instant('ambassadors.frmstyles');
        $scope.prefs = musicprefs.split(',');

        $scope.togglePrefs = function (pref) { // toggle selection for a given fruit by name
            var idx = $scope.frmuser.prefs.indexOf(pref);
            if (idx > -1)// is currently selected
                $scope.frmuser.prefs.splice(idx, 1);
            else// is newly selected 
                $scope.frmuser.prefs.push(pref);
        }

        $scope.sendForm = function () {
            var vm = {
                id: 2,
                captcha: $scope.captcharesponse,
                email: $scope.frmuser.email,
                name: $scope.frmuser.name,
                fb: $scope.frmuser.fb,
                city: $scope.frmuser.city,
                country: $scope.frmuser.country,
                prefs: $scope.frmuser.prefs.join(",")
            };

            //send form
            $http.post('/api/mc.php', angular.toJson(vm)).then(function (response) {
                console.log(response);
            }, function error(err) {
                //TODO:
                console.log('form did not post successful! ' + JSON.stringify(err));
            });
            // show thank you for registering
            $scope.formsent = true;
        }



    }])

})();
