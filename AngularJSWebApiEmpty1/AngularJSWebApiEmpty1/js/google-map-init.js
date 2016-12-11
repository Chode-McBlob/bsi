(function (window, document) {

    'use strict';

    // attach utils as a property of window
    var gmapUtil = window.gmapUtil || (window.gmapUtil = {});

    //BSI gmap broswer api code
    var apiKey = 'AIzaSyB1jp-eEwKT9cbQKUFnhHstn56hc3pVTz0';

    var THEMEMASCOT_googlemap_init_obj = {};
    var THEMEMASCOT_GEOCODE_ERROR = "Error";
    // Google map Styles
    var THEMEMASCOT_googlemap_styles = {
        'default': [],
        'style1': [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{ "color": "#dddddd" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry.fill", "stylers": [{ "color": "#dddddd" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#72A230" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#979797" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "weight": "0.01" }] }],

        'style2': [{ "featureType": "landscape", "stylers": [{ "hue": "#007FFF" }, { "saturation": 100 }, { "lightness": 156 }, { "gamma": 1 }] }, { "featureType": "road.highway", "stylers": [{ "hue": "#FF7000" }, { "saturation": -83.6 }, { "lightness": 48.80000000000001 }, { "gamma": 1 }] }, { "featureType": "road.arterial", "stylers": [{ "hue": "#FF7000" }, { "saturation": -81.08108108108107 }, { "lightness": -6.8392156862745 }, { "gamma": 1 }] }, { "featureType": "road.local", "stylers": [{ "hue": "#FF9A00" }, { "saturation": 7.692307692307736 }, { "lightness": 21.411764705882348 }, { "gamma": 1 }] }, { "featureType": "water", "stylers": [{ "hue": "#0093FF" }, { "saturation": 16.39999999999999 }, { "lightness": -6.400000000000006 }, { "gamma": 1 }] }, { "featureType": "poi", "stylers": [{ "hue": "#00FF60" }, { "saturation": 17 }, { "lightness": 44.599999999999994 }, { "gamma": 1 }] }],

        'style3': [{ stylers: [{ hue: "#00ffe6" }, { saturation: -20 }] }, { featureType: "road", elementType: "geometry", stylers: [{ lightness: 100 }, { visibility: "simplified" }] }, { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] }],

        'style4': [{ "stylers": [{ "saturation": -100 }] }],

        'style5': [{ "featureType": "landscape", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 20.4705882352941 }, { "gamma": 1 }] }, { "featureType": "road.highway", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 25.59999999999998 }, { "gamma": 1 }] }, { "featureType": "road.arterial", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": -22 }, { "gamma": 1 }] }, { "featureType": "road.local", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 21.411764705882348 }, { "gamma": 1 }] }, { "featureType": "water", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 21.411764705882348 }, { "gamma": 1 }] }, { "featureType": "poi", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 4.941176470588232 }, { "gamma": 1 }] }],

        'style6': [{ "featureType": "landscape", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 20.4705882352941 }, { "gamma": 1 }] }, { "featureType": "road.highway", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 25.59999999999998 }, { "gamma": 1 }] }, { "featureType": "road.arterial", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": -22 }, { "gamma": 1 }] }, { "featureType": "road.local", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 21.411764705882348 }, { "gamma": 1 }] }, { "featureType": "water", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 21.411764705882348 }, { "gamma": 1 }] }, { "featureType": "poi", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 4.941176470588232 }, { "gamma": 1 }] }],

        'style7': [{ "featureType": "landscape", "stylers": [{ "invert_lightness": true }, { "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }],

        'style8': [{ "featureType": "landscape", "stylers": [{ "hue": "#FFA800" }, { "saturation": 17.799999999999997 }, { "lightness": 152.20000000000002 }, { "gamma": 1 }] }, { "featureType": "road.highway", "stylers": [{ "hue": "#007FFF" }, { "saturation": -77.41935483870967 }, { "lightness": 47.19999999999999 }, { "gamma": 1 }] }, { "featureType": "road.arterial", "stylers": [{ "hue": "#FBFF00" }, { "saturation": -78 }, { "lightness": 39.19999999999999 }, { "gamma": 1 }] }, { "featureType": "road.local", "stylers": [{ "hue": "#00FFFD" }, { "saturation": 0 }, { "lightness": 0 }, { "gamma": 1 }] }, { "featureType": "water", "stylers": [{ "hue": "#007FFF" }, { "saturation": -77.41935483870967 }, { "lightness": -14.599999999999994 }, { "gamma": 1 }] }, { "featureType": "poi", "stylers": [{ "hue": "#007FFF" }, { "saturation": -77.41935483870967 }, { "lightness": 42.79999999999998 }, { "gamma": 1 }] }],

        'style9': [{ "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#A3C6FE" }] }, { "featureType": "transit", "stylers": [{ "color": "#b3C6FE" }, { "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#EBCE7B" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "weight": 1.8 }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "color": "#d7d7d7" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ebebeb" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#a7a7a7" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#E9E5DC" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#696969" }] }, { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#737373" }] }, { "featureType": "poi", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#d6d6d6" }] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "color": "#dadada" }] }],

        'dark': [{ "featureType": "landscape", "stylers": [{ "invert_lightness": true }, { "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }],
        'greyscale1': [{ "stylers": [{ "saturation": -100 }] }],
        'greyscale2': [{ "featureType": "landscape", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 20.4705882352941 }, { "gamma": 1 }] }, { "featureType": "road.highway", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 25.59999999999998 }, { "gamma": 1 }] }, { "featureType": "road.arterial", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": -22 }, { "gamma": 1 }] }, { "featureType": "road.local", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 21.411764705882348 }, { "gamma": 1 }] }, { "featureType": "water", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 21.411764705882348 }, { "gamma": 1 }] }, { "featureType": "poi", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 4.941176470588232 }, { "gamma": 1 }] }]
    };

    function googlemap_init(dom_obj, coords) {
            var latlng;
            if (coords.latlng !== '') {
                var latlngStr = coords.latlng.split(',');
                var lat = latlngStr[0];//parseFloat(latlngStr[0]);
                var lng = latlngStr[1];//parseFloat(latlngStr[1]);
                latlng = new google.maps.LatLng(lat, lng);
            } else {
                latlng = new google.maps.LatLng(0, 0);
            }
            var id = dom_obj.attr('id');//dom_obj.id;

            //console.log(dom_obj.attr('id'));

            THEMEMASCOT_googlemap_init_obj[id] = {};
            THEMEMASCOT_googlemap_init_obj[id].dom = dom_obj;
            THEMEMASCOT_googlemap_init_obj[id].point = coords.point;
            THEMEMASCOT_googlemap_init_obj[id].description = coords.description;
            THEMEMASCOT_googlemap_init_obj[id].title = coords.title;
            THEMEMASCOT_googlemap_init_obj[id].opt = {
                zoom: coords.zoom,
                center: latlng,
                scrollwheel: false,
                scaleControl: false,
                disableDefaultUI: false,
                panControl: true,
                zoomControl: true, //zoom
                mapTypeControl: false,
                streetViewControl: false,
                overviewMapControl: false,
                styles: THEMEMASCOT_googlemap_styles[coords.style ? coords.style : 'default'],
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            
            var custom_map = new google.maps.Geocoder();
            custom_map.geocode(coords.latlng !== '' ? { 'latLng': latlng } : { "address": coords.address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    THEMEMASCOT_googlemap_init_obj[id].address = results[0].geometry.location;
                    googlemap_create(id);
                } else {
                    alert(THEMEMASCOT_GEOCODE_ERROR + ' ' + status);
                }
            });

            jQuery(window).resize(function () {
                if (THEMEMASCOT_googlemap_init_obj[id].map) {
                    THEMEMASCOT_googlemap_init_obj[id].map.setCenter(THEMEMASCOT_googlemap_init_obj[id].address);
                }
            });
            return THEMEMASCOT_googlemap_init_obj[id];
    }

    function googlemap_create(id) {

        if (!THEMEMASCOT_googlemap_init_obj[id].address) {
            return false;
        }

        window.gmap = new google.maps.Map(THEMEMASCOT_googlemap_init_obj[id].dom[0], THEMEMASCOT_googlemap_init_obj[id].opt);
        window.gmap.setCenter(THEMEMASCOT_googlemap_init_obj[id].address);

        //THEMEMASCOT_googlemap_init_obj[id].map.setCenter(THEMEMASCOT_googlemap_init_obj[id].address);
        var markerInit = {
            map: window.gmap,//THEMEMASCOT_googlemap_init_obj[id].map,
            position: THEMEMASCOT_googlemap_init_obj[id].address   //THEMEMASCOT_googlemap_init_obj[id].map.getCenter()
        };
        if (THEMEMASCOT_googlemap_init_obj[id].point) {
            markerInit.icon = THEMEMASCOT_googlemap_init_obj[id].point;
        }
        if (THEMEMASCOT_googlemap_init_obj[id].title) {
            markerInit.title = THEMEMASCOT_googlemap_init_obj[id].title;
        }
        var marker = new google.maps.Marker(markerInit);
        var infowindow = new google.maps.InfoWindow({
            content: THEMEMASCOT_googlemap_init_obj[id].description
        });
        google.maps.event.addListener(marker, "click", function () {
            infowindow.open(window.gmap, marker);
        });

        THEMEMASCOT_googlemap_init_obj[id].map = window.gmap;
    }


    function googlemap_refresh() {
        for (id in THEMEMASCOT_googlemap_init_obj) {
            googlemap_create(id);
        }
    }


    function setgmap(domElement, address, latlng, zoom, mapstyle, title, descr, marker) {
        return googlemap_init(domElement, {
            address: address,
            latlng: latlng,
            zoom: zoom,
            style: mapstyle,
            title: title,
            description: descr,
            point: marker
        });
    }

    function addControl(mapElement, controlElement, callback) {

        // PT: get cached reference naar google map        
        var mapCanvas = document.getElementById(mapElement);

        setTimeout(function () {
            console.log('check...')
            if (window.gmap) {
                console.log(window.gmap);
            }
        }, 200);

        //console.log(window.gmap);
        var controlEl = document.getElementById(controlElement);
        // Setup the click event listeners: simply set the map to Chicago.
        controlEl.addEventListener('click', callback);
        controlEl.index = 1;
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlEl);
    }

    // END API

    // publish external API by extending myLibrary
    function publishExternalAPI(gmapUtil) {
        angular.extend(gmapUtil, {
            'setgmap': setgmap,
            'addControl':addControl,
        });
    }

    publishExternalAPI(gmapUtil);

})(window, document);