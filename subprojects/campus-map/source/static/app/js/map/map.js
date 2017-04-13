/* global window */
/* global chapman:false */
/* global InfoBox:false */
/* global google:false */

/**
 * Map
 */

chapman.virtualtour.Map = (function ($, document, window) {
	
	'use strict';

	var isDev = !/chapman\.edu/.test(window.location);

	var _markers = [];
	var _delayedMarkers = [];
	var _delayedMarker;
	var _mapInitialized = false;

	var _addingMarkers = false; // true when a loop is running to add markers
	var MissionControl = chapman.virtualtour.MissionControl;

	var _mouseOverWindow = new InfoBox({
		alignBottom: true,
		pixelOffset: new google.maps.Size(28, -10),
		maxWidth: 350,
		closeBoxURL: ''
	});

    var mapColumn = $('#virtualTour-mapColumn');

	var _mapOptions = {
		center: new google.maps.LatLng(mapColumn.data().startingPointLatitude, mapColumn.data().startingPointLongitude),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true,
		zoom: 17,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DEFAULT,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		styles: [
			{
				'featureType': 'poi',
				'stylers': [
					{ 'visibility': 'simplified' }
				]
			},
			{
				'featureType': 'administrative',
				'stylers': [
					{ 'visibility': 'off' }
				]
			},
			{
				'featureType': 'transit',
				'stylers': [
					{ 'visibility': 'off' }
				]
			},
			{
				'featureType': 'landscape',
				'elementType': 'labels',
				'stylers': [
					{ 'visibility': 'off' }
				]
			}
		],
		overviewMapControl: true,
		panControl: false,
		scaleControl: true
	};

  var _map;

  var openMarkerName = '';
  var knownMarkers = [];

	/**
	 * private functions
	 */
	var _init = function() {

		if (!_mapInitialized) {

			chapman.virtualtour.Map.chapmanMap = _map = new google.maps.Map(document.getElementById('virtualTour-mapCanvas'), _mapOptions);

			// Wait for map to be completely loaded
			google.maps.event.addListener(_map, 'idle', function() {
				if (!_mapInitialized) {
					_mapInitialized = true;

					google.maps.event.clearListeners(_map, 'idle');

					if (_delayedMarkers.length > 0) {
						_addMarkers(_delayedMarkers);
					}

					if (_delayedMarker !== undefined) {
						_markerClicked(_delayedMarker);
					}

					MissionControl.mapReady();

				}
			});

			// On resize, recenter the map
			google.maps.event.addDomListener(window, 'resize', function () {

				var center = _map.getCenter();

				google.maps.event.trigger(_map, 'resize');

				_map.setCenter(center);

			});

		}

	};

	/**
	 * Using the checkbox group name return the image name for the marker icon.
	 */
	var _getIcon = function(group, index) {

		var iconImgName;

		switch (group) {
			case 'library2' :
				iconImgName = isDev ? 'icon_library.png' : '[system-asset]/_files/virtualTour/img/icon_library.png[/system-asset]';
				break;
			case 'dumbbell' :
				iconImgName = isDev ? 'icon_dumbbell.png'  : '[system-asset]/_files/virtualTour/img/icon_dumbbell.png[/system-asset]';
				break;
			case 'users' :
				iconImgName = isDev ? 'icon_users.png'  : '[system-asset]/_files/virtualTour/img/icon_users.png[/system-asset]';
				break;
			case 'food3' :
				iconImgName = isDev ? 'icon_food.png'  : '[system-asset]/_files/virtualTour/img/icon_food.png[/system-asset]';
				break;
			case 'mic3' :
				iconImgName = isDev ? 'icon_mic.png'  : '[system-asset]/_files/virtualTour/img/icon_mic.png[/system-asset]';
				break;
			case 'lab' :
				iconImgName = isDev ? 'icon_lab.png'  : '[system-asset]/_files/virtualTour/img/icon_lab.png[/system-asset]';
				break;
			case 'lab3' :
				iconImgName = isDev ? 'icon_lab.png'  : '[system-asset]/_files/virtualTour/img/icon_lab.png[/system-asset]';
				break;
			case 'car' :
				iconImgName = isDev ? 'icon_car.png'  : '[system-asset]/_files/virtualTour/img/icon_car.png[/system-asset]';
				break;
			case 'step' :
				iconImgName = isDev ? 'icon_steps.png'  : '[system-asset]/_files/virtualTour/img/icon_steps.png[/system-asset]';
				break;
			case 'camera' :
				iconImgName = isDev ? 'icon_camera.png'  : '[system-asset]/_files/virtualTour/img/icon_camera.png[/system-asset]';
				break;
			case 'tree' :
				iconImgName = isDev ? 'icon_tree.png'  : '[system-asset]/_files/virtualTour/img/icon_tree.png[/system-asset]';
				break;
			case 'bed' :
				iconImgName = isDev ? 'icon_bed.png'  : '[system-asset]/_files/virtualTour/img/icon_bed.png[/system-asset]';
				break;
			case 'graduation' :
				iconImgName = isDev ? 'icon_graduation.png'  : '[system-asset]/_files/virtualTour/img/icon_graduation.png[/system-asset]';
				break;
			case 'star3' :
				iconImgName = isDev ? 'icon_star.png'  : '[system-asset]/_files/virtualTour/img/icon_star.png[/system-asset]';
				break;
			case 'bus' :
				iconImgName = isDev ? 'icon_bus.png'  : '[system-asset]/_files/virtualTour/img/icon_bus.png[/system-asset]';
				break;
			case 'accessibility2' :
				iconImgName = isDev ? 'icon_accessibility.png'  : '[system-asset]/_files/virtualTour/img/icon_accessibility.png[/system-asset]';
				break;
			case 'aid' :
				iconImgName = isDev ? 'icon_aid.png'  : '[system-asset]/_files/virtualTour/img/icon_aid.png[/system-asset]';
				break;
			case 'coin' :
				iconImgName = isDev ? 'icon_coin.png'  : '[system-asset]/_files/virtualTour/img/icon_coin.png[/system-asset]';
				break;
			case 'toilets_unisex' :
				iconImgName = isDev ? 'icon_bathroom.png'  : '[system-asset]/_files/virtualTour/img/icon_bathroom.png[/system-asset]';
				break;
			default :

			if (index > 0) {
				iconImgName = isDev ? 'icon_' + String(index) + '.png'  : '/_files/virtualTour/img/icon_' + String(index) + '.png';
			} else {
				iconImgName = isDev ? 'icon_default.png'  : '/_files/virtualTour/img/icon_default.png';
			}
		}

		if (isDev) {
			return chapman.virtualtour.imgFilePath + iconImgName;
		} else {
			return iconImgName;
		}
	};

	/**
	 * Finds a marker object in the markers array and returns it
	 */
	var _getMarkerIndex = function(id) {
		var markerIndex = -1;

		for (var i in _markers) {
			if (_markers[i].hasOwnProperty('id') && _markers[i].id === id) {
				return i;
			}
		}

		return markerIndex;
	};

	/**
	 * Finds a marker object in the markers array by id
	 */
	var _getMarkerById = function(id) {
		return _markers[_getMarkerIndex(id)];
	};


	var _getLayerIndexByLineId = function(id) {
		var layerIndex = -1;
		for (var i in _markers) {
			if (_markers.hasOwnProperty(i)) {
				var marker = _markers[i];
				var type = marker.type;
				if(type === 'kml') {
					if (marker.obj.lineId === id) {
						return i;
					}
				}
			}
		}
		return layerIndex;
	};


	/**
	 * Respond to a marker being clicked. State changes are handled with $.History.go() in addMarker()
	 */
	var _markerClicked = function(marker, e) {
		if (marker !== undefined && marker.type !== 'kml') {
			_map.panTo(marker.getPosition());
		} else {
			_delayedMarker = marker;
		}
	};

	/**
	 * public functions
	 *
	 */


	/**
	 * Creates a marker, stores it in an array and adds it to the map.
	 */
	var _addMarker = function(markerObject, isVirtualTour) {

		var type = markerObject.type;
		var markerExists = _getMarkerIndex(markerObject.id);

		switch(type) {

			case 'kml' :

				var kmlUrl = markerObject.url;
				var kmlOptions = {
					suppressInfoWindows: true,
					preserveViewport: false
				};
				var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);

				_markers.push(
					{
						type: type,
						obj: markerObject,
						layer: kmlLayer,
						id: markerObject.id
					});

				kmlLayer.setMap(_map);

				google.maps.event.addListener(kmlLayer, 'click', function(event) {
					var lineName = event.featureData.name;
					var layer = _markers[_getLayerIndexByLineId(lineName)];
					$.History.go(layer.obj.id);
				});

				MissionControl.updateQueryString(_markers);

				break;

			default :

				if (markerExists === -1 && _mapInitialized) {

					var marker;
					var point = markerObject.index && markerObject.index > 9 ? new google.maps.Point(10, 37) : new google.maps.Point(4, 37);

					if (isVirtualTour) {

						marker = new google.maps.Marker({
							type: type,
							icon: _getIcon(markerObject.group, markerObject.index),
							shadow: chapman.virtualtour.imgFilePath + 'icon_shadow.png',
							labelAnchor: point,
							labelClass: 'label',
							labelStyle: {
								opacity: '1',
								'text-align': 'center',
								'font-weight': 'bold',
								'font-size': '15px'
							},
							name: markerObject.title,
							position: new google.maps.LatLng(markerObject.latitude, markerObject.longitude),
						});

						marker.id = markerObject.id;

					} else if (!MissionControl.isPrint()) {

						marker = new google.maps.Marker({
							type: type,
							group: markerObject.group,
							icon: _getIcon(markerObject.group),
							shadow: chapman.virtualtour.imgFilePath + 'icon_shadow.png',
							id: markerObject.id,
							name: markerObject.title,
							position: new google.maps.LatLng(markerObject.latitude, markerObject.longitude),
							visible: true
						});

					} else {

						marker = new google.maps.Marker({
							type: type,
							icon: _getIcon(markerObject.group),
							shadow: chapman.virtualtour.imgFilePath + 'icon_shadow.png',
							labelContent: markerObject.title,
							labelAnchor: new google.maps.Point(60, -5),
							labelClass: 'label',
							labelStyle: {
								opacity: 1
							},
							name: markerObject.title,
							position: new google.maps.LatLng(markerObject.latitude, markerObject.longitude),
						});

					}

					if (!marker.position.lat() || !marker.position.lng()) {
						console.log('FAILED TO ADD MARKERS', marker);
						return false;
					}

					// keep track of what markers are on the map
					_markers.push(marker);

					// add the marker to the map
					marker.setMap(_map);

					// add listeners
					google.maps.event.addListener(marker, 'mouseover', function (e) {

						var thisMarkerName = marker.name;

						if (thisMarkerName === openMarkerName) {
                			return false;
	            		} else {

							// Disable mouseover funcitionality on mobile/smaller screens - sstacho
							if (MissionControl.isDesktop()) {

								chapman.virtualtour.Map.mouseOverWindow = new InfoBox ({
									alignBottom: false,
									pixelOffset: new google.maps.Size(18, -48),
									maxWidth: 1350,
									closeBoxURL: ''
								});

								chapman.virtualtour.Map.mouseOverWindow.setContent('<div class="content">' + thisMarkerName + '</div>');
								chapman.virtualtour.Map.mouseOverWindow.open(_map, marker);

							}

						}

					});

					google.maps.event.addListener(marker, 'mouseout', function() {
						chapman.virtualtour.Map.mouseOverWindow.close();
					});

					google.maps.event.addListener(marker, 'click', function (e) {

						// Reset map nav
						if ($('#virtualTour-mapBtn').hasClass('primary') || $('#virtualTour-tourBtn').hasClass('primary')) {
							$('#virtualTour-mapBtn, #virtualTour-tourBtn').removeClass('primary');
						}

						// jMenu plugin
						if ($('#js-jmenu--slide-left').hasClass('is-active')) {
							$('#js-jmenu--slide-left').removeClass('is-active');
						}

						$.History.go(marker.id);

					});

					// update the deep linking
					MissionControl.updateQueryString(_markers);

					// Reset for every pin. It was repositioning over antartica even though all points were correct.
					var chapmanCoordinates = new google.maps.LatLng(33.793003, -117.852606),
						pinCoordinates = new google.maps.LatLng(markerObject.latitude, markerObject.longitude),
						markerCount = _markers.length;

					if (markerCount === 1) {
						// Center on the pin if there's only one
						chapman.virtualtour.Map.chapmanMap.setCenter(pinCoordinates);
					} else {
						// If there's more than one pin, center on Chapman
						chapman.virtualtour.Map.chapmanMap.setCenter(chapmanCoordinates);
					}

					return marker;

				} else {
					_delayedMarkers.push(markerObject);
				}

				break;

		}
	};

	/**
	 * Removes a marker from the map and also the markers array.
	 */

	var _removeMarker = function(markerObject) {
		var index = _getMarkerIndex(markerObject.id);
		var marker = _markers[index];

		if (marker) {
			
			if (marker.type !== 'kml') {
				marker.setMap(null);
			} else {
				marker.layer.setMap(null);
			}

			google.maps.event.clearListeners(marker);

			_markers.splice(index, 1);

			marker = null;
		
		}

		// update the deep linking
		MissionControl.updateQueryString(_markers);
	};

	/**
	 * Adds more than one marker to the map
	 */
	var _addMarkers = function(markerObjects, isVirtualTour) {
		var totalMarkers = markerObjects.length;
		var bounds;

		if (!_map) {
			return false;
		}

		bounds = _map.getBounds();
		_addingMarkers = true;

		$.each(markerObjects, function(index, value) {
			var marker = _addMarker(value, isVirtualTour);
			var ll;
			var contains;
			var currentZoom;
			var type;

			if (!marker) {
				return;
			}

			// Zoom to fit markers.
			ll = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
			contains = _map.getBounds().contains(ll);

			if (!contains) {
				currentZoom = _map.getZoom();
				_map.setZoom(currentZoom -1);
			}

			type = value.type;

			// the map will center itself when a path is loaded
			if (type !== 'kml') {
				bounds.extend(new google.maps.LatLng(value.latitude, value.longitude));
			}

			if (index >= totalMarkers - 1) {
				_addingMarkers = false;
			}
		});

	};

	/**
	 * Removes more than one marker from the map
	 */
	var _removeMarkers = function(markerObjects) {
		for (var i in markerObjects) {
			if (markerObjects.hasOwnProperty(i)) {
				_removeMarker(markerObjects[i]);
			}
		}
	};

	/**
	 * When a sub category clicked from the category menu set the active state in the map
	 */
	var _updateMapById = function(id) {
		var marker = _getMarkerById(id);
		_markerClicked(marker);
		return marker;
	};


	var _clickMarkerById = function(id) {
		$.History.go(id);
	};

	/**
	 * returns the marker query string for the location bar
	 */
	var _getSelections = function() {
		return _markers;
	};


	// expose public functions

	return {
		init: _init,
		addMarker: _addMarker,
		addMarkers: _addMarkers,
		removeMarker: _removeMarker,
		removeMarkers: _removeMarkers,
		updateMapById: _updateMapById,
		getSelections: _getSelections,
		clickMarkerById: _clickMarkerById,
		chapmanMap: _map,
		mouseOverWindow: _mouseOverWindow,
		knownMarkers: knownMarkers
	};

})(window.jQuery, window.document, window);
