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