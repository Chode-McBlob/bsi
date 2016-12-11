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