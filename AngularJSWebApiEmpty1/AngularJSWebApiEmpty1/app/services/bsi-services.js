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