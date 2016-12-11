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
(function () {
    'use strict';

    var congressApp = angular.module('trvCtrl', [])

    .controller('trvcontroller', ['$scope', '$routeParams', '$translate', 'ObjectTranslator', function ($scope, $routeParams, $translate, ObjectTranslator) {

         function initLang() {
            var fields = ['name', 'address', 'phone', 'website', 'wdist', 'img', 'desc'];
            $scope.tabs = ObjectTranslator.GetNested('travelinfo', fields).then(function (res) {
                $scope.tabs = res[0].acts;
            })
        }

        ObjectTranslator.Subscribe($scope, initLang);

    }])

})();

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

(function () {
    'use strict';

    var congressApp = angular.module('faqCtrl', [])

    .controller('surveycontroller', ['$scope', '$routeParams', '$translate', '$rootScope', 'ObjectTranslator', '$http', function ($scope, $routeParams, $translate, $rootScope, ObjectTranslator, $http) {

        function initLang() {
            var fields = ['q', 'a'];
            $scope.article = ObjectTranslator.GetNested('survey', fields).then(function (res) {
                $scope.article = res[0].acts;
            })
            
            if (!$scope.article || $scope.article.title == 'title')
                $location.url('/notfound');
        }

        ObjectTranslator.Subscribe($scope, initLang);

        $scope.subscribed;
        $scope.formsent;
        $scope.frmuser = {q1:[],q2:[],q3:'2', email: ''};

        $scope.sendForm = function () {
            var userSubscribed = $scope.subscribed ? 'yes' : 'no';
            var vm = {
                id: 4,
                q1: $scope.frmuser.q1.join(","),
                q2: $scope.frmuser.q2.join(","),
                q3: $scope.frmuser.q3,
                email: $scope.frmuser.email,
                subs: userSubscribed
            };
            $http.post('/api/mc.php', angular.toJson(vm)).then(function (response) {
                console.log(response);
            }, function error(err) {
                console.log('form did not post successful! ' + JSON.stringify(err));
            });
            $scope.formsent = true;
        }

        $scope.togglePrefs = function (pref, fld) { // toggle selection for a given fruit by name
            var idx = fld.indexOf(pref);
            if (idx > -1)// is currently selected
                fld.splice(idx, 1);
            else// is newly selected 
                fld.push(pref);
        }
    }])

})();

(function () {
    'use strict';

    var congressApp = angular.module('prodCtrl', [])

    .controller('productcontroller', ['$scope', 'ObjectTranslator', '$translate', function ($scope, ObjectTranslator, $translate) {

        function initLang() {
        }
        ObjectTranslator.Subscribe($scope, initLang);

    }])

})();

(function () {
    'use strict';

    var congressApp = angular.module('nfCtrl', [])

    .controller('notfoundcontroller', ['$scope', 'ObjectTranslator', '$translate', function ($scope, ObjectTranslator, $translate) {

        function initLang() {
        }

        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();

(function () {

    'use strict';
    var congressApp = angular.module('homeCtrl', [])

.controller('homecontroller', ['$scope', '$routeParams', 'ObjectTranslator', '$translate', function ($scope, $routeParams, ObjectTranslator, $translate) {
        $scope.initLang = function() {
            var fields = ['icon', 'title', 'desc', 'link'];
            $scope.tabs = ObjectTranslator.GetNested('goodies', fields).then(function (res) {
                $scope.tabs = res[0].acts;
            });
        }

        ObjectTranslator.Subscribe($scope, $scope.initLang);
}])

.directive('bsigmap', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var address = elem.data("address");
            var latlng = elem.data("latlng");
            var zoom = elem.data("zoom");
            var mapstyle = elem.data("mapstyle");
            var title = elem.data("title");
            var descr = elem.data("popupstring-id");
            var marker = elem.data("marker");
            var map = gmapUtil.setgmap(elem, address, latlng, zoom, mapstyle, title, descr, marker);
            elem.data("gmap", map);
        }
    };
});

})();



(function () {
    'use strict';

    var congressApp = angular.module('facilityCtrl', [])

    .controller('facilitycontroller', ['$scope', '$routeParams', 'ObjectTranslator', '$translate', '$location', function ($scope, $routeParams, ObjectTranslator, $translate,  $location) {
        function initLang() {
            var fields = ['bigpic', 'bigpicalt', 'title', 'subtitle', 'par', 'parb', 'adtitle', 'adline', 'city', 'cttitle', 'phline', 'phone', 'emlline', 'email', 'fb', 'tw'];
            $scope.article = ObjectTranslator.GetById('facility', fields, $routeParams.contentid);
            console.log($scope.article)
            if (!$scope.article || $scope.article.title == 'title')
                $location.url('/notfound');
        }

        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();

(function () {
    'use strict';

    var congressApp = angular.module('ctCtrl', [])

    .controller('contentcontroller', ['$scope', 'ObjectTranslator', '$translate',  '$routeParams', function ($scope, ObjectTranslator, $translate,  $routeParams) {

        function initLang() {
            var contentpageId = $routeParams.contentid;
            $scope.pagetitle = $translate.instant(contentpageId + '.pagetitle');
            $scope.pagect = ObjectTranslator.GetNested(contentpageId, ['section', 'title', 'p1', 'p2','img']).then(function (res) {
                $scope.pagect = res[0].acts;
            })
        }

        ObjectTranslator.Subscribe($scope, initLang);

        $scope.isArr = function (obj) {
            return angular.isArray(obj); // werkt niet in {{ }} notatie
        };

    }])

})();

(function () {
    'use strict';

    var congressApp = angular.module('conCtrl', [])

    .controller('contactcontroller', ['$scope', 'ObjectTranslator', '$translate', function ($scope, ObjectTranslator, $translate) {

        function initLang() {
        }

        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();

(function () {
    'use strict';

    var app = angular.module('articleCtrl', [])

    .controller('articlecontroller', ['$scope', 'ObjectTranslator', '$routeParams', '$location', function ($scope, ObjectTranslator, $routeParams, $location) {
        $scope.article;
        $scope.links;

        $scope.initLanguage = function () {
            var fields = ['id', 'title', 'headline', 'smry', 'smryb', 'par', 'parquote', 'parquoter', 'parthumb', 'parb', 'parbthumb','nat'];
            $scope.article = ObjectTranslator.GetById('articles', fields, $routeParams.contentid);

            //if (!$scope.article || $scope.article.title == 'title')
                //$location.url('/notfound');

            $scope.links = ObjectTranslator.GetNested('articles.links', ['link', 'url']).then(function (res) {
                $scope.links = res[0].acts;
            })
        }

        ObjectTranslator.Subscribe($scope, $scope.initLanguage);
    }])

})();



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

(function () {
    'use strict';

    var congressApp = angular.module('actCtrl', [])

    .controller('activitycontroller', ['$scope', '$routeParams', 'ObjectTranslator','$translate', '$location', function ($scope, $routeParams, ObjectTranslator,$translate, $location) {

        function initLang() {
            var fields = ['title', 'bigpic', 'bigpicalt', 'par', 'parquote', 'parquoter', 'parthumb', 'parb', 'parb2', 'parbthumb'];
            $scope.article = ObjectTranslator.GetById('activity', fields, $routeParams.contentid);
            if (!$scope.article || $scope.article.title == 'title') {
                $location.url('/notfound');
            }
        }
    
        ObjectTranslator.Subscribe($scope, initLang);
    }])

})();