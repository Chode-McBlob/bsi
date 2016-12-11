(function () {

    'use strict';

    var app = angular.module('congressapp', ['ngRoute', 'mSlider', 'homeCtrl', 'ticketsCtrl', 'quickContact', 'prodCtrl', 'actCtrl', 'cartCtrl', 'checkoutCtrl', 'facilityCtrl', 'faqCtrl', 'ctCtrl', 'conCtrl', 'abssCtrl', 'custAtt', 'trvCtrl', 'articleCtrl', 'pascalprecht.translate', 'ngCookies', 'eSched', 'eFac', 'eNews', 'trObj', 'nfCtrl', 'formz','stSL'])
    .constant('rcKey', '6LdalyITAAAAAJfvK1Ns1cGwY9PRk0HCMdzfsWAp')
    .constant('gmapKey', 'AIzaSyB1jp-eEwKT9cbQKUFnhHstn56hc3pVTz0')
    .config(['$routeProvider', '$locationProvider', '$translateProvider', function ($routeProvider, $locationProvider, $translateProvider) {
        $routeProvider.
          when('/', {
              templateUrl: '/app/pages/home/home.html',
              controller: 'homecontroller'
          }).
          when('/tickets', {
              templateUrl: '/app/pages/tickets/tickets.html',
              controller: 'ticketscontroller'
          }).
          when('/contact', {
              templateUrl: '/app/pages/contact/contact.html',
              controller: 'contactcontroller'
          }).
          when('/product/:contentid', {
              templateUrl: '/app/pages/product/product.html',
              controller: 'productcontroller'
          }).
          when('/activity/:contentid', {
              templateUrl: '/app/pages/activity/activity.html',
              controller: 'activitycontroller'
          }).
          when('/cart', {
              templateUrl: '/app/cart/cart.html',
              controller: 'cartcontroller'
          }).
          when('/travelinfo', {
              templateUrl: '/app/pages/travelinfo/travel.html',
              controller: 'trvcontroller'
          }).
          when('/checkout', {
              templateUrl: '/app/cart/checkout.html',
              controller: 'checkoutcontroller'
          }).
          when('/jackpot', {
              templateUrl: '/app/cart/jackpot.html',
              controller: 'jackpotcontroller'
          }).
          when('/thankyou', {
              templateUrl: '/app/cart/ordercomplete.html',
              controller: 'ordercompletecontroller'
          }).
          when('/ambassadors', {
              templateUrl: '/app/pages/ambassadors/ambassadors.html',
              controller: 'absscontroller'
          }).
          when('/facility/:contentid', {
              templateUrl: '/app/pages/facility/facility.html',
              controller: 'facilitycontroller'
          }).
          when('/survey/:contentid', {
              templateUrl: '/app/pages/survey/survey.html',
              controller: 'surveycontroller'
          }).
          when('/content/:contentid', {
              templateUrl: '/app/pages/content/content.html',
              controller: 'contentcontroller'
          }).
           when('/article/:contentid', {
               templateUrl: '/app/pages/article/article.html',
               controller: 'articlecontroller'
           }).
           when('/notfound', {
               templateUrl: '/app/pages/notfound/notfound.html',
               controller: 'notfoundcontroller'
           })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        $translateProvider.useStaticFilesLoader({
            prefix: 'app/l10n/',
            suffix: '.json'
        });

        // config available languages and fallback language
        $translateProvider.fallbackLanguage('en_US');
        // Tell the module what language to use by default
        $translateProvider.preferredLanguage('en_US');
        // security strategie (anders warning thrown door angular-translate)
        //$translateProvider.useSanitizeValueStrategy('escape');
    }])

   .run(function ($rootScope, $location, $anchorScroll, $routeParams) {
       // Scrolling To An Element By ID With Routing
       // ex: <a href="#/test/123/?scrollTo=foo">Test id=123, scroll to #foo</a>
       $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
           $location.hash($routeParams.scrollTo);
           $anchorScroll();
       });
   })

    .controller('navmenucontroller', ['$scope', '$rootScope', '$translate', 'shoppingCart', function ($scope, $rootScope, $translate, shoppingCart) {

        $scope.CartItems = shoppingCart.count();
        $scope.cartActive = false;
        $scope.$on('cartChanged', function (events, cart) {
            $scope.CartItems = shoppingCart.count();
        })

        $scope.tabs = [
           // { id: "navmenu.h", link: '/', label: 'Home', active: false },
            { id: "navmenu.tick", link: '/tickets', label: 'tickets', active: false },
            { id: "navmenu.ambs", link: '/ambassadors', label: 'ambassadors', active: false },
            { id: "navmenu.trvl", link: '/travelinfo', label: 'travel', active: false }
            //{ id: "navmenu.ct", link: '/contact', label: 'contact', active: false }
        ];

        $rootScope.$on('$translateChangeSuccess', function () {
            $translate(['navmenu.tick', 'navmenu.ambs', 'navmenu.trvl']).then(function (menulabels) {
                for (var i = 0; i < $scope.tabs.length; i++) {
                    var itm = menulabels[$scope.tabs[i].id];
                    if (itm) $scope.tabs[i].label = itm;
                }
            }, function error(err) { console.log('menu not loaded: ' + err) });
        })
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            //console.log('current: ' + current);
            //console.log('next: ' + next);

            if (next.indexOf('#') < 0) { // negeer navigatie met # => wordt door bootstrap/jquery gebruikt in widgets zoals tab
                var hash = next.lastIndexOf('/');
                var nextTab = next.substring(hash);
                hash = nextTab.indexOf('?') // negeren scrollTo parameters
                if (hash > -1) nextTab = nextTab.substring(0, hash);
                $scope.setSelectedTab(nextTab);
                $scope.cartActive = nextTab.indexOf('cart') > 0;
            }
        });

        $scope.activeTab;
        $scope.setSelectedTab = function (tab) {
            $scope.activeTab = tab;
            for (var i = 0; i < $scope.tabs.length; i++) {
                var tabObj = $scope.tabs[i];
                tabObj.active = (tab == tabObj.link);
            }
        }

        $scope.setLang = function (langKey) {
            $translate.use(langKey);
        }
    }])

    .controller('footercontroller', ['$scope', 'ObjectTranslator', '$translate', function ($scope, ObjectTranslator, $translate) {
        function initLang() {
            $scope.flinks = ObjectTranslator.GetNested('home.footerlinks', ['link', 'url']).then(function (res) {
                $scope.flinks = res[0].acts;
            })

            $scope.social = ObjectTranslator.GetNested('home.footersocial', ['icon', 'url']).then(function (res) {
                $scope.social = res[0].acts;
            })

            $scope.ftags = ObjectTranslator.GetNested('home.footertags', ['tag', 'url']).then(function (res) {
                $scope.ftags = res[0].acts;
            })
        }
        ObjectTranslator.Subscribe($scope, initLang);
    }])

    .factory('CountrySVC', ['$http', '$translate', function ($http, $translate) { // Flags in json file
        return  {
            getCountries: function () {
                var result = {"00": $translate.instant('phrases.select-country')};
                $http.get('/app/l10n/countries.json').success(function (data) {
                    var cnames = [];
                    angular.forEach(data, function (val, key) {
                        cnames.push(val); // extract landnamen naar array
                    });
                    cnames.sort();// sort op alfabet
                    for (var n in cnames) {
                        for (var i in data) {
                            if (cnames[n] == data[i]) {
                                result[i] = data[i];
                                break;
                            }
                        }
                    }
                });
                return result;
            },
            sortObjectByKey: function (o) { //http://stackoverflow.com/questions/1359761/sorting-a-javascript-object-by-property-name
                var sorted = {}, key, a = [];
                for (key in o) 
                    if (o.hasOwnProperty(key)) 
                        a.push(key);
                a.sort();
                for (key = 0; key < a.length; key++) 
                    sorted[a[key]] = o[a[key]];
                return sorted;
            }
        }
    }])

    .directive('flag', [function () { // f16 class geplaatst op een parent element, nat uit json data uitlezen en flag renderen
        return {
            restrict: 'E',
            scope: {
                nts: '@'
            },
            template: '<i class="flag {{n}}" ng-repeat="n in nats"></i>',
            controller: function ($scope) {
                $scope.nats = $scope.nts + '';
                $scope.nats = $scope.nats.split(',');
            },
            link: function (scope,elem) {
                elem.parent().addClass('f16');
            }
        }
    }])
})();