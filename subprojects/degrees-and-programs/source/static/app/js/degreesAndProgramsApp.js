/*global window:false */
/*global $:false */
/*global location:false */
/*jslint plusplus: true */

var chapman = chapman || {};

(function ($, Modernizr, window, document) {

	'use strict';

	var activeSection = '', // Active section (discover, undergraduate, or graduate)
		activeFilters = [],
		allResults = [],
		undergraduateResults = [],
		graduateResults = [],
		undergraduateProgramNames = [],
		graduateProgramNames = [],
		resultsSetItems = [],
		resultsSetItemsLoaded = 0,
		lazyLoadingPaused = true,
		lazyLoadingIntervalTime = 200,
		resultsSetCount = 0,
		isTransitioning = false, // Flag for transitioning between sections
		isUserScroll = true, // Flag for scrolling caused by user vs. animation
		transitioningClass = 'is-transitioning',
		urlTypeQuery = '',
		$dapFeature = $('#js-dap-feature'),
		$resultsCount = $('.results-count'),
		activeClass = 'active',
		standardTransitionTime = 1000,
		isFormChangeEvent = false,
		hashChangesActive = false,
		isMobile = Modernizr.mq('(max-width: 1023px)'),
		scrollPosition = $(window).scrollTop(),
		headerOffset = parseInt($('html').css('padding-top').replace('px', '')),

		dap = {

			//----- Discover Section -----//
			discover: {
				fieldNamePrefix: 'dap-discover-',
				activeMotivation: '',
				$motivationsItems: $('#js-dap-discover-motivations .motivation'),
				activeInterest: '',
				$interests: $('#js-dap-discover-interests'),
				$interestsItems: $('#js-dap-discover-interests .interest'),
				$keywordForm: $('#js-dap-discover-keyword-form'),
				$results: $('#js-dap-results-discover')
			},

			//----- Undergraduate Section -----//
			undergraduate: {
				fieldNamePrefix: 'dap-undergraduate-',
				$programTypes: $('#js-dap-undergraduate-program-types'),
				$interests: $('#js-dap-undergraduate-interests'),
				$interestsItems: $('#js-dap-undergraduate-interests input'),
				$resetInterests: $('#js-reset-undergraduate-interests'),
				$filterTypes: $('#js-dap-undergraduate-filter-types'),
				$results: $('#js-dap-results-undergraduate')
			},

			//----- Graduate Section -----//
			graduate: {
				fieldNamePrefix: 'dap-graduate-',
				$programTypes: $('#js-dap-graduate-program-types'),
				$filterTypes: $('#js-dap-graduate-filter-types'),
				$results: $('#js-dap-results-graduate')
			}

		};


	chapman.degreesAndProgramsApp = {

		init: function () {
			this.getProgramsData();
			this.bindUIEvents();
			this.getUrlTypeQuery();
			this.initLazyLoadingInterval();
		},

		bindUIEvents: function () {
			var _this = this;

			//-------- Global Events --------//

			$(window).on('scroll resize', function () {

				if (isUserScroll) {
					lazyLoadingPaused = false;
				}

				isMobile = Modernizr.mq('(max-width: 1023px)'); // Reset this if screen size changes
				scrollPosition = $(window).scrollTop();

			});

			// Click on any section's accordion trigger
			$('.dap-section-accordion-trigger').on('click', function () {
				if (!isTransitioning) {
					_this.toggleSection($(this));
				}
			});

			// Form change in any section
			$('#js-dap-feature form').on('change', function (event) {

				isFormChangeEvent = true;

				if (!hashChangesActive) {
					var form = $(this),
						target = $(event.target),
						hash = form.serialize();

					if (target.attr('id').indexOf('keyword') !== -1) {
						var keywordVal = target.val();

						// If using the keyword search in the Discover section...
						if (activeSection === 'discover') {
							var trigger = $('#js-dap-section-undergraduate .dap-body');

							// Jump to Undergraduate section to search by keyword
							$('#dap-undergraduate-keyword').val(keywordVal);
							_this.toggleSection($('#js-dap-section-undergraduate'), trigger);
							_this.applyHashFilters(); // This is a special case where the hash filters must be applied even though there was a form event

						} else {

							// Otherwise reset the rest of the form
							_this.resetForm(form);
							target.val(keywordVal);

							window.location.hash = hash; // Update the hash so history is enabled
							_this.resetFiltering(form);

						}

					} else {
						form.find('input[id*="keyword"]').val('');
						window.location.hash = hash; // Update the hash so history is enabled
						_this.resetFiltering(form);
					}

					setTimeout(function () {
						_this.scrollToResults();
					}, 100);

				}

			}).on('submit', function (event) {
				event.preventDefault();
			});

			// On forward/back
			$(window).on('hashchange', function(event) {

				// Only do hash filtering if the event wasn't from the DOM
				if (!isFormChangeEvent && !hashChangesActive) {
					_this.applyHashFilters();
				}

				isFormChangeEvent = false; // Reset flag

			});

			//-------- Discover Events --------//

			// Click on Motivations in Discover section
			dap.discover.$motivationsItems.on('click', function (event) {
				if ($(event.target).is('input')) {
					_this.switchDiscoverMotivation($(this));
				}
			});

			// Click on Interests in Discover section
			dap.discover.$interestsItems.on('click', function (event) {
				if ($(event.target).is('input')) {
					_this.switchDiscoverInterest($(this));
				}
			});

			//-------- Undergraduate Events --------//

			// Click on Reset button in Undergraduate section
			dap.undergraduate.$resetInterests.on('click', function () {
				dap.undergraduate.$interestsItems.prop('checked', false);
				_this.resetFiltering($(this).closest('form'));
			});

			// Click on Program Types buttons in Undergraduate section
			dap.undergraduate.$programTypes.on('change', '.program-type input', function () {
				_this.syncUndergraduateProgramTypes($(this));
			});

			// Click on Interests in Undergraduate section
			// dap.undergraduate.$interestsItems.on('change', function () {
			//
			// });

			$('form').on('change', function (event) {
				var form = $(this),
					target = $(event.target);

				if (target.attr('id').indexOf('keyword') !== -1) {
					var keywordVal = target.val();

					// If using the keyword search in the Discover section...
					if (activeSection === 'discover') {
						var trigger = $('#js-dap-section-undergraduate .dap-section-accordion-trigger');

						// Jump to Undergraduate section to search by keyword
						_this.toggleSection($('#js-dap-section-undergraduate'), trigger);
						$('#dap-undergraduate-keyword').val(keywordVal);

					} else {

						// Otherwise reset the rest of the form
						_this.resetForm(form);
						target.val(keywordVal);

					}

				}

			});

			// $('#dap-undergraduate-school, #dap-undergraduate-keyword').on('change', function () {
			//
			// });

			//-------- Graduate Events --------//

			// Click on Program Types buttons in Graduate section
			dap.graduate.$programTypes.on('change', '.program-type input', function () {
				_this.syncGraduateProgramTypes($(this));
			});

			// $('#dap-graduate-school, #dap-graduate-keyword').on('change', function () {
			//
			// });

		},

		resetFiltering: function (form) {

			if (form !== undefined && form.length > 0) {
				var _this = this;

				activeFilters = []; // Clear filters
				_this.clearResultsHTML(); // Clear results markup
				dap.discover.$keywordForm.hide();
				resultsSetItems = [];
				resultsSetItemsLoaded = 0;
				resultsSetCount = 0; // Reset result counter
				_this.getActiveFilters(form);
				_this.getResultsSet();

			}

		},

		resetForm: function (form) {

			if (form !== undefined && form.length > 0) {
				var formSelects = form.find('select');

				form[0].reset();

				// Reset custom selects
				if (formSelects && formSelects.length) {
					for (var i = 0; i < formSelects.length; i++) {
						var select = $(formSelects[i]);
						chapman.customSelect.resetSelect(select);
					}
				}

			}

		},

		resetAllForms: function () {
			var _this = this;

			for (var type in dap) { // Get all dap objects
				if (dap.hasOwnProperty(type)) {
					_this.resetForm($('#js-' + dap[type].fieldNamePrefix + 'form'));
				}

			}

		},

		getProgramsData: function () {
			var _this = this,
				jsonUrl = $dapFeature.data('json-url');

			$.ajax({
				type: 'GET',
				url: jsonUrl,
				dataType: 'text',
				success: function (json) {
					var data = $.parseJSON(json);
					allResults = data.results;

					for (var i = 0; i < allResults.length; i++) {
						var result = allResults[i],
							type = result.type || '',
							isUndergradAndGrad = false;

						// Fallback in case no degree type is specified
						if (result.degreeTypes !== undefined) {

							// Check if this result is an accelerated or bridge program
							for (var j = 0; j < result.degreeTypes.type.length; j++) {
								var degreeType = result.degreeTypes.type[j];

								if (degreeType) {
									var degreeTypeFormatted = degreeType.toLowerCase();

									// Any of the following count as bridge/accelerated
									if (degreeTypeFormatted === 'bridge' ||
										degreeTypeFormatted === 'integrated/4+1' ||
										degreeTypeFormatted === 'accelerated 3+2') {
										isUndergradAndGrad = true;
										break;
									}

								}

							}

						}

						// If it's a bridge or accelerated program, it's both undergraduate and graduate
						if (isUndergradAndGrad) {
							undergraduateResults.push(result);
							graduateResults.push(result);
							undergraduateProgramNames.push(result.title);
							graduateProgramNames.push(result.title);
						} else {

							if (/^undergraduate/.test(type)) {
								undergraduateResults.push(result);
								undergraduateProgramNames.push(result.title);
							}

							if (/^graduate/.test(type)) {
								graduateResults.push(result);
								graduateProgramNames.push(result.title);
							}

						}

					}

					// Alphabetically sort everything
					undergraduateProgramNames.sort();
					graduateProgramNames.sort();
					undergraduateResults.sort(_this.titleAlphaSort);
					graduateResults.sort(_this.titleAlphaSort);

					_this.initAutocompletes();
					_this.applyHashFilters();

				},
				error: function (e) {
					console.error('Error loading programs feed.');
				}
			});

		},

		initLazyLoadingInterval: function () {
			var _this = this;

			setInterval(function() {

				if (!lazyLoadingPaused && activeSection !== undefined && activeSection !== '') {
					_this.lazyLoadResults();
				}

			}, lazyLoadingIntervalTime);

		},

		lazyLoadResults: function () {
			var _this = this;
			var $resultsContainer = $('#js-dap-results-' + activeSection);
			var bottomOfResultsContainer;
			var windowHeight = $(window).height();
			var bottomOfWindow = scrollPosition + windowHeight;
			var scrollThreshold = bottomOfWindow + (windowHeight * 0.33);
			var result = $(resultsSetItems[resultsSetItemsLoaded]);

			if (resultsSetItemsLoaded < resultsSetItems.length && result.length) { // If there are results left to load

				$('#js-dap-results-' + activeSection + ' .results-row').append(result); // Append the result
				var $result = $(result); // Store previously appended result as variable
				bottomOfResultsContainer = $resultsContainer.offset().top + $resultsContainer.outerHeight(true); // Recalculate container's height with new result

				if (scrollThreshold >= bottomOfResultsContainer && $resultsContainer.is(':visible')) { // If the user is past the scroll threshold
					_this.fadeInResult($result); // Fade the result in
					resultsSetItemsLoaded++; // Move to the next result
				} else {
					$result.remove(); // Otherwise remove it and wait until there's more room
					lazyLoadingPaused = true;
				}

			} else {
				lazyLoadingPaused = true;

				if (activeSection === 'discover') {

					// Open the keyword form
					dap.discover.$keywordForm.slideDown(standardTransitionTime, function() {
						$(this).css('overflow', 'visible');
					});

				}

			}

		},

		fadeInResult: function (result) {
			var image = result.find('.image'),
				imageSrc = image.data('src') || '',
				desc = result.find('.result-content .desc'),
				activeContentInner = result.find('.active-content-inner');

			// Truncate description
			if (desc.length) {
				desc.dotdotdot({
					watch: true
				});
			}

			// Truncate content container
			if (activeContentInner.length) {
				activeContentInner.dotdotdot({
					watch: true,
					after: 'a'
				});
			}

			// Load the images dynamically
			if (image.length) {
				image.css('background-image', 'url(' + imageSrc + ')');
			}

			setTimeout(function() {
				result.addClass('faded-in');
			}, 100);

		},

		toggleSection: function (el, scrollEl) {
			var _this = this,
				section = el.closest('.dap-section'),
				sectionBody = section.find('.dap-body'),
				sectionID = section.data('id'),
				form;

			isTransitioning = true;
			$dapFeature.addClass(transitioningClass);

			// Reset the previously opened section
			if (activeSection !== undefined && activeSection !== '' && $('#js-dap-' + activeSection + '-form').length > 0) {
				form = $('#js-dap-' + activeSection + '-form');
				// _this.resetFiltering(form);
				_this.resetForm(form);
			}

			_this.resetDiscoverMotivation();
			_this.closeDiscoverMotivationPanel();
			_this.resetDiscoverInterest();
			_this.closeDiscoverInterestPanel();

			if (section.hasClass('active')) { // If the section is open, close it
				var activeResults = $('#js-dap-results-' + activeSection + ' .results-row .result');

				section.removeClass('active');
				activeResults.removeClass('faded-in');
				setTimeout(function () {
					activeResults.removeClass('visible');

					// Close the section
					sectionBody.slideUp(standardTransitionTime, function() {
						isTransitioning = false;
						$dapFeature.removeClass(transitioningClass);
					});

					activeSection = ''; // Clear the active section

				}, 500);

			} else { // Otherwise close the old section and open the new one

				activeSection = sectionID; // Change the active section
				form = $('#js-dap-' + activeSection + '-form');

				if (!hashChangesActive) {
					// _this.resetFiltering(form); // Check for filters preset (potentially from query string)

					// Update the hash so history is enabled
					var oldHash = window.location.hash.replace('#', '');
					var newHash = form.serialize();
					window.location.hash = newHash; // Triggers hash change most of the time

					if (oldHash === newHash) {
						_this.applyHashFilters(); // Applies filters if the page is reloaded with the same hash
					}

				}

				var newSectionTransitionDelay = standardTransitionTime;

				if ($('.dap-section.active').length) {

					// Close old section
					$('.dap-section.active .dap-body').slideUp(standardTransitionTime);
					$('.dap-section.active').removeClass('active');
					$resultsCount.removeClass('faded-in');

				} else {
					newSectionTransitionDelay = 0; // No delay required if there's no old section to close
				}

				setTimeout(function () { // Wait until old section is closed (if there is one)

					// Open new section
					section.addClass('active');
					sectionBody.slideDown(standardTransitionTime, function() {
						$(this).css('overflow', 'visible');

						// Wait to do the following until new section is opened
						var scrollToSectionTime = 1000,
							scrollPoint;

						headerOffset = parseInt($('html').css('padding-top').replace('px', ''));

						// Scroll to new section
						if (scrollEl) {
							scrollPoint = scrollEl.offset().top - headerOffset;
						} else if (scrollEl === undefined) {
							scrollPoint = section.offset().top - headerOffset;
						}

						if (scrollPoint) {

							isUserScroll = false;

							$('html, body').animate({
								scrollTop: scrollPoint
							}, scrollToSectionTime, 'swing', function () {

								isTransitioning = false;

								setTimeout(function () {
									isUserScroll = true;
								}, 100);

								$dapFeature.removeClass(transitioningClass);

							});

						} else {
							isTransitioning = false;
							$dapFeature.removeClass(transitioningClass);
						}

					});

				}, newSectionTransitionDelay);

			}

		},

		switchDiscoverMotivation: function (el) {

			if (!(el.hasClass(activeClass))) {
				var motivation = el.data('motivation'),
					$motivationInterests = $('#js-dap-discover-interests .interest[data-category="' + motivation + '"]');

				dap.discover.$interests.find('input').prop('checked', false); // Reset interests
				dap.discover.activeMotivation = motivation; // Change the active motivation
				el.find('input').prop('checked', true); // Make sure the motivation's input is checked if it's not already

				// Reset motivations, then activate the current one
				dap.discover.$motivationsItems.removeClass(activeClass);
				el.addClass(activeClass);

				// Reset interests, then show/fade in interests of the chosen motivation
				dap.discover.$interestsItems.removeClass('faded-in');
				dap.discover.$interests.removeClass('interest-active');

				dap.discover.$interestsItems.removeClass('visible'); // Hide all interests by default
				$motivationInterests.addClass('visible'); // Only show interests of this motivation

				dap.discover.$interests.slideDown(standardTransitionTime, function() { // Then slide down the interests section
					$(this).css('overflow', 'visible');

					$motivationInterests.addClass('faded-in');

					// Open the results section
					dap.discover.$results.slideDown(standardTransitionTime, function() {
						$(this).css('overflow', 'visible');

						setTimeout(function () {
							lazyLoadingPaused = false;
						}, standardTransitionTime/2);

					});

				});

			}

		},

		resetDiscoverMotivation: function () {
			dap.discover.activeMotivation = '';
			dap.discover.$motivationsItems.removeClass(activeClass);
		},

		closeDiscoverMotivationPanel: function () {
			dap.discover.$interests.slideUp(standardTransitionTime);
			dap.discover.$keywordForm.hide();

			setTimeout(function () {
				dap.discover.$interestsItems.removeClass('faded-in visible');
			}, standardTransitionTime);

		},

		switchDiscoverInterest: function (el) {

			if (!(el.hasClass(activeClass))) {
				var interest = el.data('interest');

				// Change the active interest
				dap.discover.activeInterest = interest;
				dap.discover.$interests.addClass('interest-active');

				// Remove active state from any other interests, then make the new one active
				dap.discover.$interestsItems.removeClass(activeClass);
				el.addClass(activeClass);
				el.find('input').prop('checked', true); // Make sure the interest's input is checked if it's not already

				lazyLoadingPaused = false;

			}

		},

		resetDiscoverInterest: function () {
			dap.discover.activeInterest = '';
			dap.discover.$interestsItems.removeClass(activeClass);
		},

		closeDiscoverInterestPanel: function () {
			dap.discover.$interests.removeClass('interest-active');
			dap.discover.$results.slideUp(standardTransitionTime);
		},

		/*
			In the Undergraduate section, All Programs cannot be selected when other program types are selected.
			Inversely, when other program types are selected, All Programs cannot be selected.
			This function selects/deselects inputs accordingly.
		*/
		syncUndergraduateProgramTypes: function (el) {
			var allProgramsID = 'dap-undergraduate-program-all',
				inputID = el.attr('id');

			if (inputID === allProgramsID) {
				dap.undergraduate.$programTypes.find('input').not(el).prop('checked', false);
			} else {
				$('#' + allProgramsID).prop('checked', false);
			}

		},

		/*
			In the Graduate section, All Programs cannot be selected when other program types are selected.
			Inversely, when other program types are selected, All Programs cannot be selected.
			This function selects/deselects inputs accordingly.
		*/
		syncGraduateProgramTypes: function (el) {
			var allProgramsID = 'dap-graduate-program-all',
				inputID = el.attr('id');

			if (inputID === allProgramsID) {
				dap.graduate.$programTypes.find('input').not(el).prop('checked', false);
			} else {
				$('#' + allProgramsID).prop('checked', false);
			}

		},

		getActiveFilters: function (form) {
			var formData = form.serializeArray(),
				degreeTypesArray = [], // Used for storing degree types
				interestsArray = [];

			for (var i = 0; i < formData.length; i++) {
				var filter = formData[i],
					name = filter.name,
					formattedName,
					value = filter.value;

				formattedName = name.replace(dap[activeSection].fieldNamePrefix, ''); // Remove form name prefixes

				// If there is a value
				if (value.length > 0) {

					if (formattedName.indexOf('program') !== -1) { // Push to array if a program
						var valuesArray = value.split(',');

						// Loop through all values associated with the filter
						for (var j = 0; j < valuesArray.length; j++) {
							var programType = valuesArray[j];

							// Add each to the degree types array
							if (degreeTypesArray.indexOf(programType) === -1) {
								degreeTypesArray.push(programType);
							}

						}

					} else if (formattedName.indexOf('interest') !== -1) { // Push to array if an interest
						interestsArray.push(value);
					} else if (formattedName.indexOf('school') !== -1) {

						// Make sure the school value is a valid school name
						if (value && value.length && value !== 'all' && value !== 'none') {
							activeFilters[formattedName] = value;
						}

					} else {
						activeFilters[formattedName] = value;
					}

				}

			}

			if (degreeTypesArray.length) {
				activeFilters.degreeTypes = degreeTypesArray;
			}

			if (interestsArray.length) {
				activeFilters.interests = interestsArray;
			}

		},

		getResultsSet: function() {
			var _this = this,
				result,
				title,
				interests,
				motivations,
				degreeTypes,
				schools,
				resultsCountText;

			if (activeSection === 'discover' ||
				activeSection === 'undergraduate') {

				for (var i = 0; i < undergraduateResults.length; i++) {
					result = undergraduateResults[i];
					title = result.title;
					interests = result.interests;
					schools = result.schools;

					if (activeSection === 'discover') {
						motivations = result.motivations;
					} else if (activeSection === 'undergraduate') {
						degreeTypes = result.degreeTypes;
					}

					_this.filterResult(result, title, interests, motivations, degreeTypes, schools);

				}

				resultsCountText = 'You are seeing ' + resultsSetCount + ' out of ' + undergraduateResults.length + ' Undergraduate Degrees and Programs'; // Set the results count text

			} else if (activeSection === 'graduate') {

				for (var j = 0; j < graduateResults.length; j++) {
					result = graduateResults[j];
					title = result.title;
					degreeTypes = result.degreeTypes;
					schools = result.schools;

					_this.filterResult(result, title, interests, motivations, degreeTypes, schools);

				}

				resultsCountText = 'You are seeing ' + resultsSetCount + ' out of ' + graduateResults.length + ' Graduate Degrees and Programs'; // Set the results count text

			}

			$resultsCount.removeClass('faded-in');

			setTimeout(function () {
				$resultsCount.text(resultsCountText).addClass('faded-in');
			}, 375);

			// Discover section has unique lazyloading because of animations
			if (activeSection !== 'discover') {

				setTimeout(function () {
					lazyLoadingPaused = false;
				}, standardTransitionTime * 2);

			}

		},

		// Compares properties of a single result to the active filters set
		filterResult: function(result, title, interests, motivations, degreeTypes, schools) {
			var _this = this;

			// Keyword search is separate
			if (title !== undefined && activeFilters.keyword !== undefined && activeFilters.keyword !== '') {
				var formattedTitle = title.toLowerCase(),
					formattedKeyword = activeFilters.keyword.toLowerCase();

				if (formattedTitle.indexOf(formattedKeyword) !== -1) {
					_this.addResultHTML(result); // Keyword match - add result
					return;
				}

			} else {
				var interestMatch = false,
					motivationMatch = false,
					degreeTypesMatch = false,
					schoolsMatch = false;

				// Interests
				if (activeFilters.interests !== undefined) {

					if (interests !== undefined) {

						for (var i = 0; i < interests.length; i++) {
							var interest = interests[i];

							if (activeFilters.interests.indexOf(interest) > -1) {
								interestMatch = true;
								break; // If it's a match already, no need to continue
							}

						}

					}

				} else {
					interestMatch = true;
				}

				// Motivations
				if (activeFilters.motivation !== undefined) {

					if (motivations !== undefined && motivations.indexOf(activeFilters.motivation) > -1) {
						motivationMatch = true;
					}

				} else {
					motivationMatch = true;
				}

				// Degree Types
				if (activeFilters.degreeTypes !== undefined) {

					if (activeFilters.degreeTypes.indexOf('all') > -1) {
						degreeTypesMatch = true; // If all, it's a match by default
					} else if (degreeTypes !== undefined) {

						// Loop through the result's degree types
						for (var k = 0; k < degreeTypes.type.length; k++) {
							var degreeType = degreeTypes.type[k];

							// If any of the result's degree types match a filter, it's a match
							if (activeFilters.degreeTypes.indexOf(degreeType) > -1) {
								degreeTypesMatch = true;
								break; // If it's a match already, no need to continue
							}

						}

					}

				} else {
					degreeTypesMatch = true;
				}

				// Schools
				if (activeFilters.school !== undefined) {

					if (schools !== undefined) {

						for (var j = 0; j < schools.length; j++) {
							var school = schools[j];

							if (activeFilters.school.indexOf(school) > -1) {
								schoolsMatch = true;
								break; // If it's a match already, no need to continue
							}

						}

					}

				} else {
					schoolsMatch = true;
				}

				// If it's a match, add the result HTML to the results set
				if (interestMatch && motivationMatch && degreeTypesMatch && schoolsMatch) {
					_this.addResultHTML(result);
				}

			}

		},

		addResultHTML: function(result) {
			var title = result.title.trim() || '',
				imgSrc,
				imgAlt,
				desc = result.desc || '',
				href = result.href || '#',
				degreeTypes = result.degreeTypes || '',
				degreeTypesHTML = '',
				campusHTML = '',
				resultHTML;

			if (result.img) {
				imgSrc = result.img.src || '';
				imgAlt = result.img.alt || '';
			} else {
				imgSrc = '';
				imgAlt = '';
			}

			// Only show this field if it's defined
			if (result.campus) {

				campusHTML += '<ul class="campuses">';

				for (var i = 0; i < result.campus.length; i++) {
					campusHTML += '<li>' + result.campus[i] + '</li>';
				}

				campusHTML += '</ul>';

			}

			// Only show this field if it's defined
			if (degreeTypes.title) {

				degreeTypesHTML = '<ul class="degree-types clearfix">';

				for (var j = 0; j < degreeTypes.title.length; j++) {
					degreeTypesHTML = degreeTypesHTML + '<li>' + degreeTypes.title[j] + '</li>';
				}

				degreeTypesHTML = degreeTypesHTML + '</ul>';

			}

			resultHTML = '<article class="result visible columns small-12 clearfix">' +
		                    '<div class="image" role="img" data-src="' + imgSrc + '" aria-label="' + imgAlt + '">' +
		                        '<div class="active-content">' +
		                            '<div class="active-content-inner">' +
		                                '<p class="desc">' + desc + '</p>' +
		                                '<a href="' + href + '" title="View landing page for ' + title + ' program">Learn More <svg class="icon icon-double-chevron"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-double-chevron"></use></svg></a>' +
		                            '</div>' +
		                        '</div>' +
		                        '<a href="#" class="active-content-toggle"><svg class="icon icon-close" title="Toggle result content"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use></svg></a>' +
		                    '</div>' +
		                    '<div class="result-content">' +
		                        '<h3 class="title"><a href="' + href + '" title="View landing page for ' + title + ' program">' + title + '</a></h3>' +
		                        campusHTML +
		                        degreeTypesHTML +
		                        '<p class="desc">' + desc + '</p>' +
		                        '<a href="' + href + '" title="View landing page for ' + title + ' program" class="button">Learn More <svg class="icon icon-double-chevron"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-double-chevron"></use></svg></span></a>' +
		                    '</div>';

		    resultHTML = resultHTML + '</article>';

		    resultsSetItems.push(resultHTML);
		    resultsSetCount++;

		},

		clearResultsHTML: function () {
			$('.dap-results .results-row').empty();
		},

		getUrlTypeQuery: function () {
		    var _this = this,
		    	hash;

		    if (window.location.href.indexOf('?') > -1) {
		    	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

			    for (var i = 0; i < hashes.length; i++) {
			        hash = hashes[i].split('=');

			        if (hash[0] === 'type') { // BREI's Version
			        	urlTypeQuery = hash[1].toLowerCase();

			        	if (urlTypeQuery === 'undergraduate' ||
			        		urlTypeQuery === 'graduate') {
			        		_this.toggleSection($('#js-dap-section-' + urlTypeQuery));
			        	} else if (urlTypeQuery === 'discover') {
			        		_this.toggleSection($('#js-dap-section-' + urlTypeQuery), false);
			        	}

			        	return;

			        } else if (hash[0] === 'startingtab') { // Chapman's Version
			        	urlTypeQuery = hash[1].toString();

			        	switch (urlTypeQuery) {
						    case '1': // Majors
						        _this.toggleSection($('#js-dap-section-undergraduate'));
						        $('#dap-undergraduate-program-major').prop('checked', true);
						        break;
						    case '2': // Minors
						        _this.toggleSection($('#js-dap-section-undergraduate'));
						        $('#dap-undergraduate-program-minor').prop('checked', true);
						        break;
						    case '3': // 4+1
						        _this.toggleSection($('#js-dap-section-undergraduate'));
						        $('#dap-undergraduate-program-bridge').prop('checked', true);
						        break;
						    case '4': // Graduate
							    _this.toggleSection($('#js-dap-section-graduate'));
						        break;
						}

			        	return;

			        }

			    }

		    }

		},

		initAutocompletes: function () {
			var keywordFields = $dapFeature.find('input[id*="keyword"]'),
				undergraduateAutocompleteOptions = '',
				graduateAutocompleteOptions = '';

			for (var i = 0; i < undergraduateProgramNames.length; i++) {
				undergraduateAutocompleteOptions += '<option value="' + undergraduateProgramNames[i] + '">';
			}

			for (var j = 0; j < graduateProgramNames.length; j++) {
				graduateAutocompleteOptions += '<option value="' + graduateProgramNames[j] + '">';
			}

			keywordFields.each(function () {
				var fieldID = $(this).attr('id');

				if (fieldID.indexOf('-discover') !== -1 || fieldID.indexOf('-undergraduate') !== -1) {

					$(this).autoComplete({
						minChars: 1,
					    source: function(term, suggest) {
					        suggest(undergraduateProgramNames);
					    }
					});

				} else if (fieldID.indexOf('-graduate') !== -1) {

					$(this).autoComplete({
						minChars: 1,
					    source: function(term, suggest) {
					        suggest(graduateProgramNames);
					    }
					});

				}

			});

		},

		titleAlphaSort: function (a, b) {

			if (a.title.trim() < b.title.trim()) {
				return -1;
			}

			if (a.title.trim() > b.title.trim()) {
				return 1;
			}

			return 0;

		},

		applyHashFilters: function () {

			hashChangesActive = true;

			var _this = this;
			var hashItems = window.location.hash.replace('#', '').split('&');
			var formType = _this.getHashValue('type') || activeSection;
			var form = $('#js-dap-' + formType + '-form');
			var noFilters = false;

			_this.resetAllForms();
			_this.resetDiscoverMotivation();
			_this.resetDiscoverInterest();

			for (var i = 0; i < hashItems.length; i++) {
				var filter = decodeURIComponent(hashItems[i].replace(/\+/g, '%20')); // Remove any plus signs and code as spaces, then decode the filter
				var filterName = filter.substring(0, filter.indexOf('='));
				var filterValue = filter.substring(filter.indexOf('=') + 1);
				var filterEl = $('[name="' + filterName + '"][value="' + filterValue + '"]'); // Get the element using the name and value. Standard filter element except for special cases below.

				if (filterName === 'type') {

					// Switch section on back/forward if necessary
					if (filterValue !== activeSection) {
						_this.toggleSection($('#js-dap-section-' + filterValue));
					} else {
						continue;
					}

				} else if (filter.indexOf('keyword') !== -1) {

					$('[name="' + filterName + '"]').val(filterValue); // Set text input value

				} else if (filter.indexOf('school') !== -1) {

					$('[name="' + filterName + '"]').val(filterValue).change(); // Set select value and trigger change

				} else if (filter.indexOf('motivation') !== -1) {
					var $motivationEl = $('#js-dap-discover-motivations .motivation[data-motivation="' + filterValue + '"]');

					_this.switchDiscoverMotivation($motivationEl);

				} else if (filter.indexOf('interest') !== -1) {

					if (formType === 'discover') {
						var $interestEl = $('#js-dap-discover-interests .interest[data-interest="' + filterValue + '"]');

						_this.switchDiscoverInterest($interestEl);

					} else {
						filterEl.prop('checked', true); // Check the checkbox
					}

				} else {

					if (hashItems.length === 1 && !filterName.length && !filterValue.length) { // No hash and no filters set!

						if ($('#js-dap-section-' + activeSection).hasClass('active')) {
							noFilters = true;
							_this.toggleSection($('#js-dap-section-' + activeSection)); // Close the section if it's open (which it should be)
						}

					} else {
						filterEl.prop('checked', true); // Check the checkbox
					}

				}

			}

			hashChangesActive = false;

			if (!noFilters && formType && formType !== undefined && formType.length) {
				_this.resetFiltering(form);
			}

		},

		getHashValue: function (key) {
			var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
			return matches ? matches[1] : null;
		},

		// Used to scroll to different points
		scrollToTarget: function (target) {
			headerOffset = parseInt($('html').css('padding-top').replace('px', ''));

			setTimeout(function() {

				isUserScroll = false;

				$('html, body').animate({
					scrollTop: $(target).offset().top - (headerOffset + 20)
				}, standardTransitionTime, 'swing', function () {

					setTimeout(function () {
						isUserScroll = true;
					}, 100);

				});

			}, 250);

		},

		scrollToResults: function () {
			var $resultsContainer = $('#js-dap-results-' + activeSection);
			var resultsContainerHeight = $resultsContainer.outerHeight(true);
			var windowHeight = $(window).height();
			var bottomOfWindow = $(window).scrollTop() + windowHeight;
			var topOfResultsContainer = $resultsContainer.offset().top;
			var scrollPoint = topOfResultsContainer - (windowHeight - resultsContainerHeight);

			// If the top of the results container isn't completely in view, scroll to it
			if ((bottomOfWindow - resultsContainerHeight) <= topOfResultsContainer) {

				$('html, body').animate({
					scrollTop: scrollPoint
				}, standardTransitionTime, 'swing', function () {

					setTimeout(function () {
						isUserScroll = true;
					}, 100);

				});

			}

		}

	};

})(window.jQuery, window.Modernizr, window, window.document);

$(function () {

	'use strict';

	chapman.degreesAndProgramsApp.init();

});
