        // Refer to: https://learn.microsoft.com/en-us/bingmaps/v8-web-control/modules/directions-module/?toc=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fbingmaps%2Fv8-web-control%2Ftoc.json&bc=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2FBingMaps%2Fbreadcrumb%2Ftoc.json
        var mapID = '#myMap';
        var directionsItineraryID = '#directionsItinerary';

        var map;
        var directionsManager;
        var stops = [
            {
                'address': 'Point B',
                'coords': {
                    'lat': 14.427127419990574,
                    'long': 121.02418698375386
                }
            },
            {
                'address': 'Point C',
                'coords': {
                    'lat': 14.416623446941873,
                    'long': 121.04630328827089
                }
            }
        ];

        function createWaypoint (address, lat, long) {
            return new Microsoft.Maps.Directions.Waypoint({ address: address, location: new Microsoft.Maps.Location(lat, long) });
        }

        function setCurrentLocation (map, lat, long) {
                var center = map.getCenter();

                var pin = new Microsoft.Maps.Pushpin(center, {
                    color: 'orange'
                });

                stops.unshift({
                    address: 'Point A',
                    coords: {
                        lat: lat,
                        long: long
                    }
                })

                map.entities.push(pin);
        }

        function GetMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    var map = new Microsoft.Maps.Map(mapID, {
                        mapTypeId: Microsoft.Maps.MapTypeId.canvasLight,
                        center: new Microsoft.Maps.Location(lat, long),
                        zoom: 13,
                        navigationBarMode: Microsoft.Maps.NavigationBarMode.compact,
                        supportedMapTypes: [Microsoft.Maps.MapTypeId.canvasLight]
                    });

                    // Set current location according to GPS
                    setCurrentLocation(map, lat, long);

                    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

                        // Create waypoints to display routes for driver
                        stops.forEach(function (route) {
                            directionsManager.addWaypoint(createWaypoint(route.address, route.coords.lat, route.coords.long));
                        });

                        directionsManager.setRequestOptions({
                            // refer to: https://learn.microsoft.com/en-us/bingmaps/v8-web-control/modules/directions-module/distanceunit-enumeration
                            distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
                            // refer to: https://learn.microsoft.com/en-us/bingmaps/v8-web-control/modules/directions-module/routeavoidance-enumeration
                            routeAvoidance: [ Microsoft.Maps.Directions.RouteAvoidance.minimizeToll	]
                        });

                        directionsManager.setRenderOptions({
                            // specify container to display itinerary routes
                            itineraryContainer: directionsItineraryID
                        });

                        //Calculate directions.
                        directionsManager.calculateDirections();
                    });
                }, function (error) {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            alert('User denied the request for Geolocation.');
                        break;
                        case error.POSITION_UNAVAILABLE:
                            alert('Location information is unavailable.');
                        break;
                        case error.TIMEOUT:
                            alert('The request to get user location timed out.');
                        break;
                        case error.UNKNOWN_ERROR:
                            alert('An unknown error occurred.');
                        break;
                    }
                });
            }
        }