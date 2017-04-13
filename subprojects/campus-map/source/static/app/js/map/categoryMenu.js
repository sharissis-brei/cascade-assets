/* global window */
/* global chapman:false */

/**
 * CategoryMenu
 */

chapman.virtualtour.CategoryMenu = (function ($, window) {
	'use strict';

	var _initialized = false;

	var _init = function() {

		// Deal with the query string
		var queryStringSelections = chapman.virtualtour.MissionControl.getQueryStringSelections();

		if (!_initialized) {

			$('#virtualTour-categories').accordion({
				header: '.virtualTour-categoryButton',
				collapsible: true,
				active: false,
				heightStyle: 'content',
				icons: false,
				beforeActivate: function (e, ui) {
					var checkbox;
					if ($(e.originalEvent.target).hasClass('changeCheckbox') || $(e.originalEvent.target).hasClass('virtualTour-categoryCheckboxLabel')) {
						checkbox = $(e.currentTarget).find('input');
						checkbox.prop('checked', !checkbox.prop('checked'));
						_checkboxChanged(checkbox);
						chapman.virtualtour.VirtualTourPanel.removeOrAddMarkers('map', e.originalEvent);
						return false;
					}
				}
			});

			$('.virtualTour-subCategoryLink', '#virtualTour-categories').click(function (e) {
				_subCategoryClicked(e);
			});

			$('.virtualTour-categoryCheckbox').change(function (e) {
				// chapman.virtualtour.VirtualTourPanel.removeOrAddMarkers('map', e);
				_checkboxChanged(e);
				// Count and find the number of checked, checkboxes; enable the "Go To Map" call-to-action
				_checkboxCount('.virtualTour-categoryCheckbox', function (count) {
					if (count > 0) {
						$('#virtualTour-goToMapCTA').addClass('is-active');
					} else {
						$('#virtualTour-goToMapCTA').removeClass('is-active');
					}
				});
			});

			if (queryStringSelections.length > 0) {
				for (var i in queryStringSelections) {
					if (queryStringSelections.hasOwnProperty(i)) {
						$('#' + queryStringSelections[i], '#virtualTour-categoryMenu').trigger('click');
					}
				}
			}

			_initialized = true;

		}
	};


	var _createMarkerObject = function(curTarget) {
		var data = curTarget.data(),
			group = curTarget.attr('name'),
			id = curTarget.attr('value'),
			primaryId = curTarget.data().primaryId,
			marker,
			img = curTarget.parent().parent().find('.infowindowImg').data();

		if (primaryId !== undefined) {
			id = primaryId;
		}

		var isKML = curTarget.data().kmlUrl !== undefined;

		if(!isKML) {

			marker = {
				id: id,
				type: 'marker',
				value: curTarget.attr('value'),
				title: data.name || curTarget.parent().find('label').find('span').text(),
				group: group,
				latitude: data.latitude,
				longitude: data.longitude,
				streetview: data.streetview,
				index: data.index,
				address: data.address,
				secondaryAddress: data.secondaryAddress,
				city: data.city,
				state: data.state,
				zip: data.zip,
				img: img && img.src && img.src.trim(),
				alt: img && img.alt && img.alt.trim(),
				phone: data.phone,
				website: data.site,
				hours: data.officeHours
			};

			if (!marker.title && marker.id) {
				marker.title = data.name;
			}

			if (/listen.+to.+audio/g.test(marker.title)) {
				marker.title = data.name;
			}

			return marker;

		} else {
			var kmlLineId = data.kmlLineId,
				kmlUrl = curTarget.data().kmlUrl;

			marker = {
				id: id,
				type: 'kml',
				value: curTarget.attr('value'),
				title: curTarget.next().next().text(),
				group: group,
				lineId: kmlLineId,
				url: kmlUrl
			};

			return marker;

		}

	};

	/**
	 * Called when a sub-category link is clicked via the search
	 */
	var _subCategoryClicked = function (e) {

		e.preventDefault();

		var curTarget = $(e.currentTarget),
			id = curTarget.data().checkboxId,
			checked = $('#' + id).is(':checked');

		if (!checked) {
			$('#' + id).trigger('click'); // Place marker on map
		}

		// jMenu plugin
		if ($('#js-jmenu--slide-left').hasClass('is-active')) {
			$('#js-jmenu--slide-left').removeClass('is-active');
		}

	};

	/**
	 * Count the number of checked, checkboxes
	 */
	var _checkboxCount = function (elem, callback) {

		var checkboxes = $(elem + ':checked'),
			count = checkboxes.length;

		if (!$(elem).is(':checkbox')) {
			throw Error('The selector "' + elem + '" does not return a correct set of matched elements for type "checkbox".');
		}

		if (typeof callback !== 'undefined') {
			if (typeof callback === 'function') {
				callback(count);
			} else {
				throw Error(typeof callback + ' is not a function.');
			}
		}

		return count;

	};

	var _checkboxChanged = function(e) {
		var curTarget = e instanceof $ ? e : $(e.currentTarget),
			name = curTarget.attr('name'),
			value = curTarget.attr('value'),
			markerObjects = [],
			checkboxGroup,
			parentChecked;

		// if this is a sub category checkbox, determine if the box is checked or not and add or remove a marker based on the status
		var boxChecked = curTarget.prop('checked');
		var checkboxes = $('input[value=' + value + ']'); // when an item is in multiple categories
		var markerObject;

		if (boxChecked === undefined) {
			boxChecked = curTarget.parent().find('input').prop('checked');
		}

		// If clicking on the virtual tour tab
		if (curTarget.find('.tour').length) {

			$('.virtualTour-category input').each(function(i, val) {
				name = $(val).attr('name');
				value = $(val).attr('value');

				checkboxGroup = $(':checkbox[name=' + name + ']');
				checkboxGroup.each(function(index, value) {
					var checkbox = $(value);

					if (checkbox.prop('checked')) {
						// loop through all of the checkboxes and create marker objects to send off to the map
						if(checkbox.data().longitude && checkbox.data().latitude || checkbox.data().kmlUrl) {
							var markerObject = _createMarkerObject($(checkbox));
							markerObjects.push(markerObject);
						}
					}

				});

				parentChecked = curTarget.is(':checked');

				if (parentChecked) {

					checkboxGroup.each(function (index, val) {
						$(val).prop('checked', true);
					});

					chapman.virtualtour.Map.addMarkers(markerObjects);

				} else {

					checkboxGroup.each(function (index, val) {
						$(val).prop('checked', false);
					});

					chapman.virtualtour.Map.removeMarkers(markerObjects);

				}

				// figure out if any of the boxes checked have duplicates in other groups
				_determineDuplicateAttractionState(checkboxGroup, parentChecked);

			});

		// if this is the parent category checkbox
		} else if (curTarget.hasClass('parent')) {

			checkboxGroup = $(':checkbox[name=' + name + ']').each(function (index, value) {

				var checkbox = $(value);

				// loop through all of the checkboxes and create marker objects to send off to the map
				if (checkbox.data().longitude && checkbox.data().latitude || checkbox.data().kmlUrl) {
					var markerObject = _createMarkerObject($(checkbox));
					markerObjects.push(markerObject);
				}

			});

			parentChecked = curTarget.prop('checked');

			if (parentChecked === undefined) {
				parentChecked = curTarget.parent().find('input').prop('checked');
			}

			if (parentChecked) {

				checkboxGroup.each(function (index, val) {
					$(val).prop('checked', true);
				});

				chapman.virtualtour.Map.addMarkers(markerObjects);

			} else {

				checkboxGroup.each(function (index, val) {
					$(val).prop('checked', false);
				});

				chapman.virtualtour.Map.removeMarkers(markerObjects);

			}

			// figure out if any of the boxes checked have duplicates in other groups
			_determineDuplicateAttractionState(checkboxGroup, parentChecked);

		} else {

			markerObject = _createMarkerObject(curTarget);

			if (boxChecked) {
				checkboxes.attr('checked', true);
				chapman.virtualtour.Map.addMarker(markerObject);
				e.stopPropagation();
			} else {
				checkboxes.attr('checked', false);
				chapman.virtualtour.Map.removeMarker(markerObject);
				e.stopPropagation();
			}

		}

	};


	/**
	 * Accepts a checkbox group and determines if there are any other checkboxes that need checked or not in other groups
	 */
	var _determineDuplicateAttractionState = function(group, state) {

		group.each(function(index, ele) {

			if (index !== 0) {
				var value = $(ele).attr('value'),
					checkboxes = $('input[value=' + value + ']');

				if (checkboxes.length > 1) {
					checkboxes.attr('checked', state);
				}

			}

		});

	};

	var _initWithSubCategory = function(id) {
		var cb = $('#' + id, '#virtualTour-categoryMenu'),
			a = $('.virtualTour-subCategoryLink', cb.parent());

		a.trigger('click');

	};

	var _getTitleById = function(id) {
		var title = $('#' + id).next().next().text();
		return title;
	};

	// expose public functions
	return {
		init: _init,
		initWithSubCategory: _initWithSubCategory,
		subCategoryClicked: _subCategoryClicked,
		getTitleById: _getTitleById,
		createMarkerObject: _createMarkerObject,
		checkboxChanged: _checkboxChanged
	};

})(window.jQuery, window);
