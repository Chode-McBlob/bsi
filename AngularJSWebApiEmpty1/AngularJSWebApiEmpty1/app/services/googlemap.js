var app = angular.module('googlemaps', [])

.directive('googlemap', ['gmapKey', '$window', '$q', function (APIKEY, $window) {

    var counter = 0;

    return {
        restrict: 'A',
        scope: {
            gmapzoom: '=gmapZoom',
            gmapdata: '=', // een gismodel object
            onSelect: '=onSelect',
        },

        link: function (scope, element, attrs) {

            if ($window.google && $window.google.maps) {
                initMap();
            } else {
                injectGoogle();
            }

            function injectGoogle() {
                var cbId = 'hs_gmap_' + ++counter;
                var apiUrl = 'https://maps.googleapis.com/maps/api/js?key=' + APIKEY + '&callback=' + cbId;
                //console.log(apiUrl);
                $window[cbId] = initMap;
                var wf = document.createElement('script');
                wf.src = apiUrl;
                wf.type = 'text/javascript';
                wf.async = 'true';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wf, s);

                wf = document.createElement('script');
                wf.src = 'https://www.google.com/recaptcha/api.js?onload=vcRecaptchaApiLoaded&render=explicit&hl=nl';
                wf.type = 'text/javascript';
                wf.async = 'true';
                wf.defer = 'true';
                s = document.getElementsByTagName('script')[1];
                s.parentNode.insertBefore(wf, s);
            }

            function initMap() { // moet in scope omdat gmaps async in scope geladen 
                scope.$watch('gmapdata', function (location) {

                    var map = new GMaps({
                        el: '#map-canvas',
                        lat: 52.3702,
                        lng: 4.8952,
                        zoom: scope.gmapzoom,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: false
                    });

                    var markers = [];

                    GMaps.geocode({
                        address: location.plaats,
                        callback: function (results, status) {
                            if (status == 'OK') {
                                var latlng = results[0].geometry.location;
                                map.setCenter(latlng.lat(), latlng.lng());
                                //map.addMarker({
                                //    lat: latlng.lat(),
                                //    lng: latlng.lng()
                                //});
                            }
                        }
                    }, true);

                    setMarker(map, center, 'test', 'infowindow tekst')

                    google.maps.event.addListenerOnce(map, "bounds_changed", function () {
                        console.log('mapZoom: ' + map.getZoom());
                        if (map.getZoom() > 16) map.setZoom(16);
                    });

                });
            }

            // place a marker
            function setMarker(map, position, markertitle, popupcontent) {
                var marker = map.addMarker({
                    position: position,
                    //title: markertitle,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                });

                google.maps.event.addListenerOnce(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) { infoWindow.close(); }
                    // create new window
                    var infoWindowOptions = { content: popupcontent };
                    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }

            function setFeatureInfoWindow(map, title, name, description, poly, bounds) {
                google.maps.event.addListener(poly, "click", function (event) {
                    var infoWindow = new google.maps.InfoWindow();
                    var content = "<div id='infoBox'><strong>" + title + "</strong><br />";
                    content += name + "<br/>" + description + "</div>";
                    infoWindow.setContent(content);
                    infoWindow.setPosition(bounds.getCenter());//infowindow.setPosition(event.latLng);
                    infoWindow.open(map);
                });
            }
        }
    }
}]);
