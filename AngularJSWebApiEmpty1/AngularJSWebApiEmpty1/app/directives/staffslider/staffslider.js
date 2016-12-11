(function () {

    'use strict';
angular.module('stSL', ['rptC']) //dependency: ngrepeatcomplete directive
.directive('staffslider', ['ObjectTranslator', function (ObjectTranslator) {
    return {
        templateUrl: '/app/directives/staffslider/staffslider.html',
        scope: {},
        controller: function ($scope, $rootScope, $translate) {

            function initLang() {
                $scope.staff = ObjectTranslator.GetNested('staff', ['name', 'role', 'desc', 'fbhandle', 'photo']).then(function (res) {
                    $scope.staff = res[0].acts;
                })
            }

            initLang();

            $rootScope.$on('$translateChangeSuccess', function () {
                initLang();
            });

            $scope.checkLoaded = function (idx) {
                console.log(idx + ' ' + $scope.staff.length);
                if (idx == $scope.staff.length - 1) {
                    $scope.$emit('staffsliderloaded');
                }
            }

        },
        link: function (scope) {

            scope.$on('staffsliderloaded', function(){
                var sslider = new MasterSlider();
                sslider.setup('bsiStaff', {
                    loop: true,
                    width: 240,
                    height: 240,
                    speed: 20,
                    view: 'fadeBasic',
                    preload: 0,
                    space: 0,
                    wheel: true
                });
                sslider.control('arrows');
                sslider.control('slideinfo', { insertTo: '#staff-info' });
            });
        }
    }
}])


})();