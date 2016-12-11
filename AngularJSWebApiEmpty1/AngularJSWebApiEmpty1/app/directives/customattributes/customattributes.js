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



