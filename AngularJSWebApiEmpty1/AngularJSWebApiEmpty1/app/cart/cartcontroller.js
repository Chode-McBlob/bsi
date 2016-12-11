(function () {
    'use strict';

    var congressApp = angular.module('cartCtrl', ['sCart'])
    .controller('cartcontroller', ['$scope', '$http', 'shoppingCart', '$location','OrderSvc', function ($scope, $http, shoppingCart, $location,ORDER) {

        $scope.order = ORDER.Get();

        console.log(ORDER.Get());

        $scope.invalidpcode;
        $scope.prodstotal = 0;

        function getCart() {
            var cartTotal = 0;
            var prods = [];
            var cart = shoppingCart.listCart();
            cart.forEach(function (cartitem) {
                var prod = cartitem.value;
                delete prod['$$hashKey']; 
                prods.push(prod);
                cartTotal += parseInt(prod.total);
            });
            $scope.order.ordertotal = $scope.prodstotal = cartTotal;
            $scope.order.prods = prods;
            if ($scope.order.discountperc > 0)
                applyDiscount();
            ORDER.Update($scope.order);
        }

        getCart();

        $scope.updateItem = function (item) {
            var total = 0;
            var prods = [];
            for (var i in $scope.order.prods) {
                var prod = $scope.order.prods[i];
                if (prod.id == item.id) {
                    prod.total = parseInt(item.amount) * parseInt(item.price);
                    shoppingCart.updateCart(prod.id, prod);
                }
                total += prod.total;
                prods.push(prod);
            }
            $scope.order.prods = prods;
            $scope.order.ordertotal = $scope.prodstotal = total;
            if ($scope.order.discountperc > 0)
                applyDiscount();

            ORDER.Update($scope.order);
        };

        $scope.removeFromCart = function (item) {
            if (shoppingCart.count() > 1) {
                shoppingCart.removeItem(item.id);
            } else {
                resetOrder();
                shoppingCart.deleteCart();
            }
            getCart();
        }

        $scope.emptyCart = function () {
            shoppingCart.deleteCart();
            getCart();
        }

        $scope.checkout = function () {
            $location.url('/checkout');
        }

        $scope.getPromo = function () {
            if ($scope.order.promocode.length && $scope.order.promocode.length > 0) {
                for (var i in ORDER.promocodes) 
                    if (ORDER.promocodes[i].code == $scope.order.promocode) 
                        return ORDER.promocodes[i];
            }
            return null;
        }

        // pas kortingsperc. behorende bij promocode toe 
        $scope.applyPromo = function () {
            if ($scope.order.promocode.length && $scope.order.promocode.length > 0) {
                var found = false;
                for (var i in ORDER.promocodes) {
                    if (ORDER.promocodes[i].code == $scope.order.promocode) {
                        $scope.invalidpcode = false;
                        $scope.order.discountperc = 10;
                        applyDiscount();
                        ORDER.Update($scope.order);
                        found = true;
                    }
                }
                $scope.invalidpcode = !found;
            }
            else
                $scope.invalidpcode = true;
        }

        function applyDiscount() {
            $scope.order.discount = (parseInt($scope.order.discountperc) * $scope.order.ordertotal) / 100;
            $scope.order.ordertotal -= $scope.order.discount;
        }
       
        function resetOrder() {
            $scope.order.promocode = '';
            $scope.order.discountperc = 0;
            $scope.order.discount = 0;
            $scope.order.ordertotal = 0;
            $scope.order.prods = [];
            ORDER.Update($scope.order);
        }
    }])

})();
