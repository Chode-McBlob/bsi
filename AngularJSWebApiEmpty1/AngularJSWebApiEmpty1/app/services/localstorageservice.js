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