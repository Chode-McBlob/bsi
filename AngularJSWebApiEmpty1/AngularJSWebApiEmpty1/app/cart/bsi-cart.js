(function () {
    'use strict';
    var congressApp = angular.module('sCart', ['lStorage'])

.factory('shoppingCart', ['$sessionstorage', '$rootScope', function ($sessionstorage, $rootScope) {
    var fac = {};

    var storageObj = $sessionstorage;

    fac.updateCart = function (itemkey, itemvalueArray) {
        var cartItem = { key: itemkey, value: itemvalueArray };
        var cart = storageObj.getObject('cart');
        var cartTemp = [];
        //console.log(itemkey + ' - ' + itemvalueArray);
        // voeg element toe aan lege cart
        if (Object.keys(cart).length == 0 || cart === []) {
            cartTemp.push(cartItem);
        } else {
            cartTemp = cart;
            //console.log('duplicate filter start')
            cart.forEach(function (el, idx) { // vermijd duplicate keys
                //console.log(el + ' - ' + idx);
                if (el.key == cartItem.key) {
                    cartTemp.splice(cartTemp.indexOf(idx), 1);
                }
            });
            //console.log('duplicate filter end')
            cartTemp.push(cartItem);
        }
        storageObj.setObject('cart', cartTemp);
        $rootScope.$broadcast('cartChanged', cartTemp); // broadcast change event
    };

    fac.count = function () {
        return storageObj.getObject('cart').length;
    }

    fac.listCart = function () {
        return storageObj.getObject('cart');
    }

    fac.removeItem = function (itemkey) {
        var cart = storageObj.getObject('cart');
        var isempty = (Object.keys(cart).length == 0 || cart === []);
        if (!isempty) {
            var cartTemp = cart;
            for (var i = 0; i < cartTemp.length; i++) {
                if (cartTemp[i].key == itemkey)
                    cart.splice(i, 1);
            }
            storageObj.setObject('cart', cart);
            $rootScope.$broadcast('cartChanged', cart); // broadcast change event
        }
    }

    fac.deleteCart = function () {
        $sessionstorage.clearItem('cart');
        $rootScope.$broadcast('cartChanged', null); // broadcast change event
    }
    return fac;
}])

.factory('OrderSvc', ['$sessionstorage', '$rootScope', function ($sessionstorage, $rootScope) {
    var fac = {};
    var objname = 'bsiOrder';

    fac.promocodes = [
        { name: 'Unga Bunga', code: 'BSI-UNGAB' }
    ];

    fac.model = { guid:'', gender: 'F', fname: '', lname: '', phone: '', email: '', address: '', zip: '', city: '', country: 'SK', prods: [], promocode: '', discountperc: 0, discount: 0, ordertotal: 0, payment: '' };

    fac.Update = function (vm) {
        $sessionstorage.setObject(objname, vm);
        $rootScope.$broadcast('orderChanged', vm); // broadcast change event
    };

    fac.Get = function () {
        var o = $sessionstorage.getObject(objname);
        return  IsEmpty(o) ? fac.model : o;
    }

    fac.Delete = function () {
        $sessionstorage.clearItem(objname);
        $rootScope.$broadcast('orderChanged', null); // broadcast change event
    }

    function IsEmpty(obj) {
        for (var prop in obj) {
            if (prop !== 'gender') {
                if (!(obj[prop] === '' || obj[prop] == 0))
                    return false;
            }
        }
        return true;
    }

    return fac;
}])

})();
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


(function () {
    'use strict';

    var congressApp = angular.module('jackpot', [])
    .controller('jackpotcontroller', ['$scope', function ($scope) {

        //var tMax = 3000, // animation time, ms
        //height = 210,
        //speeds = [],
        //r = [],
        //reels = [
        //    ['5%', '10%', '25%'],
        //    ['5%', '10%', '25%'],
        //    ['5%', '10%', '25%']
        //],
        //reelElms,
        //start;
        $scope.stopgame = false;
        $scope.result = "Hit Start";

        //    reelElms = $('.reel').each(function (i, el) {
        //        el.innerHTML = '<div><p>' + reels[i].join('</p><p>') + '</p></div><div><p>' + reels[i].join('</p><p>') + '</p></div>'
        //    });

        //    $scope.hits = 3;

        //    $scope.Roll = function () {
        //        action();
        //        animate();
        //        $scope.hits--;
        //    }

        //    function action() {
        //        if (start !== undefined) return;

        //        for (var i = 0; i < 3; ++i) {
        //            speeds[i] = Math.random() + .5;
        //            r[i] = (Math.random() * 3 | 0) * height / 3;
        //        }
        //        $scope.result = "Spinning...";
        //    }

        //    function animate(now) {
        //        if (!start) start = now;
        //        var t = now - start || 0;

        //        for (var i = 0; i < 3; ++i)
        //            reelElms[i].scrollTop = (speeds[i] / tMax / 2 * (tMax - t) * (tMax - t) + r[i]) % height | 0;

        //        if (t < tMax)
        //            requestAnimationFrame(animate);
        //        else {
        //            start = undefined;
        //            $scope.$evalAsync(function () {
        //                $scope.result = check()
        //            })
        //        }
        //    }

        //    function check() {
        //        var msg = $scope.hits > 0 ? 'Try again' : 'Bummer...';
        //        var won = r[0] === r[1] && r[1] === r[2];
        //        if (won) {
        //            $scope.hits = 0;
        //            $scope.stopgame = true;
        //        }
        //        msg = won
        //            ? 'You won! Enjoy your ' + reels[1][(r[0] / 70 + 1) % 3 | 0].split(' ')[0]
        //            : msg;

        //        return msg;
        //    }

        //    function requestAnimationFrm(w) {
        //        var lastTime = 0,
        //            vendors = ['webkit', /*'moz',*/ 'o', 'ms'];
        //    for (var i = 0; i < vendors.length && !w.requestAnimationFrame; ++i) {
        //        w.requestAnimationFrame = w[vendors[i] + 'RequestAnimationFrame'];
        //        w.cancelAnimationFrame = w[vendors[i] + 'CancelAnimationFrame']
        //            || w[vendors[i] + 'CancelRequestAnimationFrame'];
        //    }

        //    if (!w.requestAnimationFrame)
        //        w.requestAnimationFrame = function (callback, element) {
        //            var currTime = +new Date(),
        //                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        //                id = w.setTimeout(function () { callback(currTime + timeToCall) }, timeToCall);
        //            lastTime = currTime + timeToCall;
        //            return id;
        //        };

        //    if (!w.cancelAnimationFrame)
        //        w.cancelAnimationFrame = function (id) {
        //            clearTimeout(id);
        //        };
        //}

    }]);

})();
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