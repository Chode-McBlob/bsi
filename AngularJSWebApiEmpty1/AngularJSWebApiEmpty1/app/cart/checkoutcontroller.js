(function () {
    'use strict';

    var congressApp = angular.module('checkoutCtrl', ['sCart'])
    
    .controller('checkoutcontroller', ['$scope','$http','$location', 'shoppingCart', 'CountrySVC', 'OrderSvc', function ($scope, $http, $location, shoppingCart, CountrySVC, ORDER) {
        //console.log(JSON.stringify(ORDER.Get()))
        $scope.order = ORDER.Get();
        $scope.countries = CountrySVC.getCountries();

        $scope.sendForm = function () {
            ORDER.Update($scope.order);
            $location.url('/thankyou');

            $scope.order.guid = 5;
           // verstuur mail met payment link, register order in mailchimp
            //$http.post('/api/eventim.php', angular.toJson($scope.order)).then(function (response) {
            //    ORDER.Update($scope.order);
            //    $location.url('/ordercomplete');
            //}, function error(err) {
            //    console.log(JSON.stringify(err));
            //});
        }
    }])

})();
