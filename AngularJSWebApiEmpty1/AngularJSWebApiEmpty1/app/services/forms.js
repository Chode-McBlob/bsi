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