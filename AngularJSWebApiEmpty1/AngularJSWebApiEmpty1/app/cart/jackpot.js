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