(function () {
    'use strict';

    var congressApp = angular.module('occCtrl', ['sCart'])

    .controller('ordercompletecontroller', ['$scope', 'OrderSvc', '$location', function ($scope, ORDER, $location) {

        console.log('AAA');

        //$scope.order = ORDER.Get();

        //if(!$scope.order || $scope.order.guid <= 0)
        //    $location.url('/tickets');

        //ORDER.Delete();
    }])

})();

