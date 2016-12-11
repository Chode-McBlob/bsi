(function () {

    'use strict';
    
    var congressApp = angular.module('ticketsCtrl', ['sCart', 'vcRecaptcha'])

.controller('ticketscontroller', ['$http','rcKey','vcRecaptchaService','$scope', '$routeParams', '$translate', 'ObjectTranslator', 'shoppingCart','$location', function ($http, rcKey,vcRecaptchaService,$scope, $routeParams, $translate, ObjectTranslator, shoppingCart,$location) {

    $scope.recaptchakey = rcKey;

    $scope.setCaptchaResponse = function (response) {
        $scope.captcharesponse = response;
    }

    $scope.setWidgetId = function (widgetId) {
        $scope.captchawidgetid = widgetId;
    }

    $scope.formsent;
    $scope.frmuser = {name: '', email: '', fb: '' };

    $scope.sendForm = function () {
        var vm = {
            id: 3,
            captcha: $scope.captcharesponse,
            email: $scope.frmuser.email,
            name: $scope.frmuser.name,
            fb: $scope.frmuser.fb
        };
        $http.post('/api/mc.php', angular.toJson(vm)).then(function (response) {
            console.log(response);
        }, function error(err) {
            console.log('form did not post successful! ' + JSON.stringify(err));
        });
        $scope.formsent = true;
    }

    $scope.actualprizes = [{ id: 'pass-single-party', price: 20 }, { id: 'pass-full-party', price: 40 }, { id: 'pass-workshops', price: 40 }, { id: 'pass-fullpass', price: 70 }]

    function initLang() {
        $scope.passes = ObjectTranslator.GetNested('tickets', ['id', 'img', 'title', 'price', 'desc', 'type']).then(function (res) {
            var data = res[0].acts;

            // set actual prizes
            for (var i in $scope.actualprizes) {
                var actualprice = $scope.actualprizes[i];
                for (var j in data) {
                    if (data[j].id == actualprice.id) {
                        data[i]["price"] = actualprice.price;
                        data[i]["total"] = actualprice.price;
                    }
                }
            }

            // properties voor order die niet in json file zitten
            for (var i in data) {
                data[i]["marked"] = false;
                data[i]["amount"] = 1;
            }

            // toon alleen passes type 1
            var passes = [];
            for (var x in data) {
                if (data[x].type == 1)
                    passes.push(data[x]);
            }

            $scope.passes = passes;
        })
    }

    ObjectTranslator.Subscribe($scope, initLang);

    $scope.addToCart = function (item) {
         shoppingCart.updateCart(item.id, item);
         $location.url('/cart');
    }
}])

})();
