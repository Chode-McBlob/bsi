(function () {
    'use strict';
    var app = angular.module('formz', [])

    .directive('validSubmit', ['$parse', function ($parse) {
        return {
            // we need a form controller to be on the same element as this directive
            // in other words: this directive can only be used on a <form>
            require: 'form',
            // one time action per form
            link: function (scope, element, iAttrs, form) {
                form.$submitted = false;
                // get a hold of the function that handles submission when form is valid
                var fn = $parse(iAttrs.validSubmit);

                // register DOM event handler and wire into Angular's lifecycle with scope.$apply
                element.on('submit', function (event) {

                    scope.$apply(function () {
                        // on submit event, set submitted to true (like the previous trick)
                        form.$submitted = true;
                        // if form is valid, execute the submission handler function and reset form submission state
                        if (form.$valid) {
                            fn(scope, { $event: event });
                            form.$submitted = false;
                        }
                    });
                });
            }
        };
    }])

    .directive('showValidate', [function () { // geen validatie op hidden elementen via ngShow
        return {
            require: '^form',
            restrict: 'A',
            link: function (scope, element, attrs, form) {
                var control;

                scope.$watch(attrs.ngShow, function (value) {
                    if (!control) {
                        control = form[attrs.name];
                    }
                    if (value === true) {
                        form.$addControl(control);
                        //Add a forEach to manually update form validity.Thanks to @Michael's answer
                        angular.forEach(control.$error, function (validity, validationToken) {
                            form.$setValidity(validationToken, !validity, control);
                        });
                    } else {
                        form.$removeControl(control);
                    }
                });
            }
        };
    }])

    // ng-focus attribuut
    // validaties uitvoeren onblur
    .directive('ngFocus', [function () { // validaties pas doen bij onblur
        var FOCUS_CLASS = "ng-focused";
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$focused = false;
                element.bind('focus', function (evt) {
                    element.addClass(FOCUS_CLASS);
                    scope.$apply(function () { ctrl.$focused = true; });
                }).bind('blur', function (evt) {
                    element.removeClass(FOCUS_CLASS);
                    scope.$apply(function () { ctrl.$focused = false; });
                });
            }
        }
    }])

     .directive('charlimit', [function () {
         return {
             restrict: "A",
             require: 'ngModel',
             link: function (scope, element, attrs, ngModel) {
                 attrs.$set("ngTrim", "false");
                 var limitLength = parseInt(attrs.charlimit, 10);// console.log(attrs);
                 scope.$watch(attrs.ngModel, function (newValue) {
                     if (ngModel.$viewValue.length > limitLength) {
                         ngModel.$setViewValue(ngModel.$viewValue.substring(0, limitLength));
                         ngModel.$render();
                     }
                 });
             }
         }
     }])

})();
(function () {
    'use strict';
    var congressApp = angular.module('lStorage', [])

.factory('$localstorage', ['$window', function ($window) { // Localstorage wrapper
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '[]');
        },
        clearItem: function (key) {
            $window.localStorage.removeItem(key);
        },
        clearAll: function () {
            $window.localStorage.clear();
        }
    }
}])

  .factory('$sessionstorage', ['$window', function ($window) { // sessionstorage wrapper
      return {
          set: function (key, value) {
              $window.sessionStorage[key] = value;
          },
          get: function (key, defaultValue) {
              return $window.sessionStorage[key] || defaultValue;
          },
          setObject: function (key, value) {
              $window.sessionStorage[key] = JSON.stringify(value);
          },
          getObject: function (key) {
              return JSON.parse($window.sessionStorage[key] || '[]');
          },
          clearItem: function (key) {
              $window.sessionStorage.removeItem(key);
          },
          clearAll: function () {
              $window.sessionStorage.clear();
          }
      }
  }])

})();
(function () {
    'use strict';
    var congressApp = angular.module('trObj', [])

.factory('ObjectTranslator', ['$translate','$rootScope', function ($translate, $rootScope) { // Languate translator thingy

    function getRecord(basePath, fields) {
        var eventkeys = [];
        for (var f in fields)
            eventkeys.push(basePath + fields[f]);

        // ophalen record voor 1 tab zonder promise met array als input
        var rec = $translate.instant(eventkeys);

        // cleanup veldnamen => dit is beter dan replace, replace had bugs!!!
        for (var e in eventkeys) {
            var fq_fld = eventkeys[e];
            if (rec.hasOwnProperty(fq_fld)) {
                var lastdot = fq_fld.lastIndexOf('.') + 1;
                var fieldlen = fq_fld.length - lastdot;
                var key = fq_fld.substr(lastdot, fieldlen);
                rec[key] = rec[fq_fld];
                delete rec[fq_fld];

                // veld value eventueel als array retourneren
                if (rec[key].substring(0, 5) === 'LISTT') {// content die als string array moet worden geretourneerd
                    rec[key] = rec[key].replace('LISTT', '').split(';');
                }
            }
        }

        return rec;
    }

    return {

        // subscriber voor taalwijzig-event in controllers
        Subscribe: function (scope, callback) {
            callback(); // de callback is een init functie, eerst uitvoeren dan subscriben op languagechange event
            var handler = $rootScope.$on('$translateChangeSuccess', callback);
            scope.$on('$destroy', handler);
        },

        Get: function (node, fields) {

            var mappath = node + '.mapping'
            return $translate(mappath).then(function (mapping) {
                return mapping;
            }, function error(err) { console.log('mapping not loaded: ' + err) })

           .then(function (mapping) {
               var tabs = [];
               if (mapping) {
                   mapping = mapping.split(';');// mapping = veldnaam array
                   angular.forEach(mapping, function (map) {
                       // maak string paths naar individuele texten in json file
                       var basePath = node + '.' + map + ".";
                       var eventkeys = [];
                       for (var f in fields)
                           eventkeys.push(basePath + fields[f]);
                       // ophalen record voor 1 tab zonder promise met array als input
                       var tabData = ($translate.instant(eventkeys));
                       // cleanup object field names (string replaceall)
                       var tab = JSON.stringify(tabData);
                       tab = tab.replace(new RegExp(basePath, 'g'), '');
                       tab = JSON.parse(tab);
                       tabs.push(tab);
                   });
               }
               return tabs;
           });
        },

        GetById: function (node, fields, fieldid) { // denk erom. dit is geen promise!!
            var basePath = node + "."+ fieldid + ".";
            // ophalen record voor 1 tab zonder promise met array als input
            return getRecord(basePath, fields);
        },

        GetNested: function (node, fields) {
            var mappath = node + '.mapping'
            return $translate(mappath).then(function (mapping) {
                return mapping;
            }, function error(err) { console.log('mapping not loaded: ' + err) })

           .then(function (mapping) {
               var tabs = [];
               if (mapping) {
                   mapping = mapping.split(';');
                   angular.forEach(mapping, function (map) {
                       var mapkey = map.split(',') // tab naam, aantal events
                       var actsTemp = [];
                       var numNodes = parseInt(mapkey[1]) + 1;
                       // maak string paths naar individuele texten in json file
                       for (var i = 1; i < numNodes; i++) { // node names beginnen op 1
                           var basePath = node + '.tabs.' + mapkey[0] + '.events.' + i + '.';
                           // ophalen record voor 1 tab zonder promise
                           var rec = getRecord(basePath, fields);
                           actsTemp.push(rec);
                       }
                       var tab = { tabname: mapkey[0], acts: actsTemp };
                       tabs.push(tab);
                   });
               }
               return tabs;
           });
        },

        GetNestedById: function (node, fields,id) {
            var mappath = node + '.mapping'
            return $translate(mappath).then(function (mapping) {
                return mapping;
            }, function error(err) { console.log('mapping not loaded: ' + err) })

           .then(function (mapping) {
               var tabs = [];
               if (mapping) {
                   mapping = mapping.split(';');
                   angular.forEach(mapping, function (map) {
                       var mapkey = map.split(',') // tab naam, aantal events
                       var idsTemp = [];
                       var actsTemp = [];
                       var baseNodes = [];
                       var numNodes = parseInt(mapkey[1]) + 1;
                       // haal ids op
                       for (var i = 1; i < numNodes; i++) { // node names beginnen op 1
                           var basePath = node + '.tabs.' + mapkey[0] + '.events.' + i + '.';
                           baseNodes.push(basePath + "id");
                           // ophalen record voor 1 tab zonder promise
                           idsTemp.push($translate.instant(baseNodes));
                       }

                       for (var i = 0; i < idsTemp.length; i++) { 
                           if (actsTemp[i] == id) {
                               var basePath = node + '.tabs.' + mapkey[0] + '.events.' + i + '.';
                               var rec = getRecord(basePath, fields);
                               actsTemp.push(rec);
                           }
                       }

                       var tab = { tabname: mapkey[0], acts: actsTemp };
                       tabs.push(tab);
                   });
               }
               return tabs;
           });
        }

        
    }
}])

})();
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
(function () {

    'use strict';
    var mslider = angular.module('quickContact', ['vcRecaptcha'])
.directive('quickcontact', ['rcKey','vcRecaptchaService',function (rcKey, recaptcha) {
    return {
        templateUrl: '/app/directives/quickcontact/quickcontact.html',
        scope: {},
        controller: function ($scope, $http) {
            $scope.charlimit = 40;
            $scope.formsent;
            $scope.eml;
            $scope.msg = '';
            $scope.recaptchakey = rcKey;
            $scope.captcharesponse;

            $scope.setCaptchaResponse = function (response) {
                $scope.captcharesponse = response;
            }

            $scope.setWidgetId = function (widgetId) {
                $scope.captchawidgetid = widgetId;
            }

            $scope.sendForm = function () {
                var vm = { id: 1, captcha: $scope.captcharesponse, email: $scope.eml, msg: $scope.msg};
                $http.post('/api/mc.php', angular.toJson(vm)).then(function (response) {
                     console.log(response);
                }, function error() {
                    //In case of a failed validation you need to reload the captcha
                    // because each response can be checked just once
                    recaptcha.reload($scope.captchawidgetid);
                });
                $scope.formsent = true;
            }
        }
    }
}])

})();
(function () {

    'use strict';
angular.module('rptC', [])
 .directive(
    // http://www.bennadel.com/blog/2592-hooking-into-the-complete-event-of-an-ngrepeat-loop-in-angularjs.htm
    // I invoke the given expression when associated ngRepeat loop
    // has finished its first round of rendering.
    "repeatComplete",['$rootScope',    function ($rootScope) {
        // Because we can have multiple ng-repeat directives in
        // the same container, we need a way to differentiate
        // the different sets of elements. We'll add a unique ID
        // to each set.
        var uuid = 0;
        // I compile the DOM node before it is linked by the
        // ng-repeat directive.
        function compile(tElement, tAttributes) {
            // Get the unique ID that we'll be using for this
            // particular instance of the directive.
            var id = ++uuid;
            // Add the unique ID so we know how to query for
            // DOM elements during the digests.
            tElement.attr("repeat-complete-id", id);
            // Since this directive doesn't have a linking phase,
            // remove it from the DOM node.
            tElement.removeAttr("repeat-complete");
            // Keep track of the expression we're going to
            // invoke once the ng-repeat has finished
            // rendering.
            var completeExpression = tAttributes.repeatComplete;
            // Get the element that contains the list. We'll
            // use this element as the launch point for our
            // DOM search query.
            var parent = tElement.parent();
            // Get the scope associated with the parent - we
            // want to get as close to the ngRepeat so that our
            // watcher will automatically unbind as soon as the
            // parent scope is destroyed.
            var parentScope = (parent.scope() || $rootScope);
            // Since we are outside of the ng-repeat directive,
            // we'll have to check the state of the DOM during
            // each $digest phase; BUT, we only need to do this
            // once, so save a referene to the un-watcher.
            var unbindWatcher = parentScope.$watch(
                function () {
                    console.info("Digest running.");
                    // Now that we're in a digest, check to see
                    // if there are any ngRepeat items being
                    // rendered. Since we want to know when the
                    // list has completed, we only need the last
                    // one we can find.
                    var lastItem = parent.children("*[ repeat-complete-id = '" + id + "' ]:last");
                    // If no items have been rendered yet, stop.
                    if (!lastItem.length) {
                        return;
                    }
                    // Get the local ng-repeat scope for the item.
                    var itemScope = lastItem.scope();
                    // If the item is the "last" item as defined
                    // by the ng-repeat directive, then we know
                    // that the ng-repeat directive has finished
                    // rendering its list (for the first time).
                    if (itemScope.$last) {
                        // Stop watching for changes - we only
                        // care about the first complete rendering.
                        unbindWatcher();
                        // Invoke the callback.
                        itemScope.$eval(completeExpression);
                    }
                }
            );
        }
        // Return the directive configuration. It's important
        // that this compiles before the ngRepeat directive
        // compiles the DOM node.
        return ({
            compile: compile,
            priority: 1001,
            restrict: "A"
        });
    }]
);

})();
(function () {

    'use strict';
angular.module('eNews', [])
.directive('newsoverview', ['ObjectTranslator', function (ObjectTranslator) {
    return {
        restrict :'E',
        templateUrl: '/app/directives/newsoverview/news.html',
        scope: {},
        controller: ['$scope', function ($scope) {
            $scope.tabs;
            $scope.djs;

            function initLang() {
                $scope.tabs = ObjectTranslator.Get('home.newsoverview', ['id', 'title', 'thumb', 'summary', 'articledate', 'authorthumb', 'nat','readmore']).then(function (res) {
                    $scope.tabs = res;
                });
                $scope.djs = ObjectTranslator.Get('home.djs', ['id', 'title', 'thumb', 'summary', 'articledate', 'authorthumb', 'nat', 'readmore']).then(function (res) {
                    $scope.djs = res;
                });
            }
            ObjectTranslator.Subscribe($scope, initLang);
        }]
    }
}])

})();



(function () {

    'use strict';
    var mslider = angular.module('mSlider', [])
.directive('masterSlider', [function () {
    return {
        templateUrl: '/app/directives/masterslider/masterslider.html',
        link: function () {
            
            var slider = new MasterSlider();
            slider.setup('masterslider', {
                width: 1024,
                height: 768,
                space: 5,
                view: 'parallaxMask',
                autofill: true,
                speed: 30,
                loop: true
            });
            slider.control('arrows', { insertTo: '#masterslider' });
            slider.control('bullets');
            var wrapper = $('#slider1-wrapper');
            wrapper.height(window.innerHeight - 118);
            $(window).resize(function (event) {
                wrapper.height(window.innerHeight - 118);
            });
            MSScrollParallax.setup(slider, 50, 80, true);
        }
    }
}])

})();
(function () {

    'use strict';
angular.module('eFac', [])
.directive('facilities', ['ObjectTranslator', function (ObjectTranslator) {
    return {
        restrict: 'E',
        scope: {}, // isolate scope
        templateUrl: '/app/directives/facilities/facilities.html',
        controller: ['$scope', function ($scope) {
            function initLang(){
                $scope.tabs = ObjectTranslator.Get('home.offer', ['id', 'title', 'thumb', 'summary']).then(function (res) {
                    $scope.tabs = res;
                })
            }

            ObjectTranslator.Subscribe($scope, initLang);
        }]
    }
}])

})();
(function () {

    'use strict';
angular.module('eSched', [])
.directive('eventschedule', ['ObjectTranslator', function (ObjectTranslator) {
    return {
        restrict :'E',
        templateUrl: '/app/directives/eventschedule/schedule.html',
        scope: {},
        controller: ['$scope', function ($scope) {

            function initLang() {
                $scope.tabs = ObjectTranslator.GetNested('schedule', ['ctid', 'cttitle', 'ctthumb', 'ctsummary', 'ctartist', 'ctcompany', 'cttime', 'ctlocation','show']).then(function (res) {
                    $scope.tabs = res;
                 })
            }
            ObjectTranslator.Subscribe($scope, initLang);

        }]
    }
}])

})();

(function () {
    'use strict';

    var app = angular.module('custAtt', [])

    .directive('custattr', [function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var attr = elem.data("bg-img");
                if (attr) elem.css('background-image', 'url(' + attr + ')');

                attr = elem.data("bg-color");
                if (attr) elem.css("cssText", "background: " + attr + " !important;");

                var attr = elem.data("text-color");
                if (attr) elem.css('color', attr);

                var attrs = ["font-size", "height", "border", "margin-top", "margin-right", "margin-bottom", "margin-left"]

                for (var attName in attrs) {
                    attr = elem.data(attName);
                    if (attr) elem.css(attName, attr);
                }
                //var attr;
                //var custAtts = [
                //    ["background-image","bg-img",'url(' + attr + ')'], 
                //    ["cssText","bg-color","background: " + attr + " !important;"], 
                //    ["text-color","color",""], 
                //    ["height", "height", ""],
                //    ["border", "border", ""],
                //    ["margin-top", "margin-top", ""],
                //    ["margin-right", "margin-right", ""],
                //    ["margin-bottom","margin-bottom",""],
                //    ["margin-left", "margin-left",""]
                //];

                //for (var attName in custAtts) {
                //     attr = elem.data(attName[0]);
                //     if (attName[2] && attName[2] !== "")
                //         attr = attName[2];

                //    if (attr) 
                //     elem.css(attName[1], attr);
                //}
            }
        };
    }])

    .directive('bsiaccordion', [function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                elem.on("show.bs.collapse", function (e) {
                    elem.closest(".panel-group").find("[href='#" + elem.attr("id") + "']").addClass("active");
                });
                elem.on("hide.bs.collapse", function (e) {
                    elem.closest(".panel-group").find("[href='#" + elem.attr("id") + "']").removeClass("active");
                });
            }
        }
    }])

})();