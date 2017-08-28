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
		resultsSetHTML = '',
		resultsSetCount = 0,
		isTransitioning = false,
		urlTypeQuery = '',
		$chapmanHeader = $('.bigMasthead header:first-of-type'),
		$dapFeature = $('#js-dap-feature'),
		$resultsCount = $('.results-count'),
		activeClass = 'active',
		standardTransitionTime = 500,
		isFormChangeEvent = false,
		hashChangesActive = false,

		dap = {

			//----- Discover Section -----//
			discover: {
				fieldNamePrefix: 'dap-discover-',
				transitionTime: 1000,
				activeMotivation: '',
				$motivationsItems: $('#js-dap-discover-motivations .motivation'),
				activeInterest: '',
				$interests: $('#js-dap-discover-interests'),
				$interestsItems: $('#js-dap-discover-interests .interest'),
				$filterTypes: $('#js-dap-discover-filter-types'),
				$results: $('#js-dap-results-discover')
			},

			//----- Undergraduate Section -----//
			undergraduate: {
				fieldNamePrefix: 'dap-undergraduate-',
				transitionTime: 2000,
				$programTypes: $('#js-dap-undergraduate-program-types'),
				$interestsItems: $('#js-dap-undergraduate-interests .interest'),
				$resetInterests: $('#js-reset-undergraduate-interests')
			},

			//----- Graduate Section -----//
			graduate: {
				fieldNamePrefix: 'dap-graduate-',
				transitionTime: 1500,
				$programTypes: $('#js-dap-graduate-program-types'),
			}

		};


	chapman.degreesAndProgramsApp = {

		init: function () {
			this.getProgramsData();
			this.bindUIEvents();
			this.getUrlTypeQuery();
		},

		bindUIEvents: function () {
			var _this = this;

			$(window).on('scroll resize', function () {
				_this.lazyloadResults();
			});

			$('.dap-section-accordion-trigger').on('click', function () {
				if (!isTransitioning) {
					_this.toggleSection($(this));
				}
			});

			dap.discover.$motivationsItems.on('click', function (event) {

				dap.discover.$interests.find('input').prop('checked', false); // Reset interests

				if ($(event.target).is('input')) {
					_this.switchDiscoverMotivation($(this));
				}

			});

			dap.discover.$interestsItems.on('click', function (event) {

				if ($(event.target).is('input')) {
					_this.switchDiscoverInterest($(this));
				}

				dap.discover.$filterTypes.slideDown(standardTransitionTime); // Open Discover filters section

			});

			dap.undergraduate.$resetInterests.on('click', function () {
				dap.undergraduate.$interestsItems.prop('checked', false);
				_this.resetFiltering($(this).closest('form'));
			});

			dap.undergraduate.$programTypes.on('change', '.program-type input', function () {
				_this.syncUndergraduateProgramTypes($(this));
			});

			dap.graduate.$programTypes.on('change', '.program-type input', function () {
				_this.syncGraduateProgramTypes($(this));
			});

			$('#js-dap-feature form').on('change', function (event) {

				isFormChangeEvent = true;

				if (!hashChangesActive) {

					var form = $(this),
						target = $(event.target);

					if (target.attr('id').includes('keyword')) {
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

					} else {
						form.find('input[id*="keyword"]').val('');
					}

					_this.resetFiltering(form);

					// Update the hash so history is enabled
					var hash = form.serialize();
					window.location.hash = hash;

				}

			}).on('submit', function (event) {
				event.preventDefault();
			});

			$(window).on('hashchange', function(event) {

				// Only do hash filtering if the event wasn't from the DOM
				if (!isFormChangeEvent && !hashChangesActive) {
					_this.applyHashFilters();
				}
				
				isFormChangeEvent = false; // Reset flag

			});

		},

		resetFiltering: function (form) {

			if (form !== undefined && form.length > 0) {
				var _this = this;

				activeFilters = []; // Clear filters
				_this.clearResultsHTML(); // Clear results markup
				resultsSetHTML = ''; // Reset markup variable
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
				for (var i = 0; i < formSelects.length; i++) {
					var select = $(formSelects[i]);
					chapman.customSelect.resetSelect(select);
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

				},
				error: function (e) {
					console.error('Error loading programs feed.');
				}
			});

		},

		lazyloadResults: function () {
			var _this = this,
				results = $('#js-dap-section-' + activeSection + ' .dap-results .result').not('.visible'),
				time = 200,
				interval = 200,
				scrollPosition = $(window).scrollTop(),
				scrollThreshold = $(window).height() * 0.9;

			results.each(function () {
				var result = $(this);

				setTimeout(function () {
					var resultPosition = result.offset().top;
					
					// Load the result if it's within the scroll threshold
					if ((scrollPosition + scrollThreshold) >= resultPosition) {
						_this.fadeInResult(result);
					}

				}, time);

      			time += interval;

			});

		},

		fadeInResult: function (result) {

			if (!(result.hasClass('visible'))) {
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

				// Show the result
				result.addClass('visible');

			}

		},

		toggleSection: function (el, scrollEl) {
			var _this = this,
				section = el.closest('.dap-section'),
				sectionBody = section.find('.dap-body'),
				sectionID = section.data('id'),
				openTransitionTime = 1000,
				closeTransitiontime = 500,
				form;

			isTransitioning = true;

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

				// Close the section
				closeTransitiontime = dap[activeSection].transitionTime;
				sectionBody.slideUp(closeTransitiontime);
				section.removeClass('active');

				// Clear the active section
				activeSection = '';

				setTimeout(function () { // Wait until section is closed
					isTransitioning = false;
				}, closeTransitiontime);

			} else { // Otherwise close the old section and open the new one

				// Change the active section
				activeSection = sectionID;
				openTransitionTime = dap[activeSection].transitionTime; // Open the section using its set transition time
				form = $('#js-dap-' + activeSection + '-form');

				// Close old section
				$('.dap-section.active .dap-body').slideUp(standardTransitionTime);
				$('.dap-section.active').removeClass('active');
				$resultsCount.removeClass('faded-in');

				// Open new section
				section.addClass('active');
				sectionBody.slideDown(openTransitionTime);

				setTimeout(function () { // Wait until section is opened
					var ommiNavHeight = $('#cu_nav').outerHeight(true),
						scrollToSectionTime = 1000,
						scrollPoint,
						chapmanHeaderHeight = $chapmanHeader.outerHeight(true);

					// Scroll to new section
					if (scrollEl) {
						scrollPoint = scrollEl.offset().top;

						if (!($('body').hasClass('scrolled'))) {
							scrollPoint = scrollPoint + chapmanHeaderHeight;
						}

					} else if (scrollEl === undefined) {
						scrollPoint = section.offset().top;

						if (!($('body').hasClass('scrolled'))) {
							scrollPoint = scrollPoint + chapmanHeaderHeight;
						}

					}

					if (scrollPoint) {

						$('html, body').animate({
							scrollTop: scrollPoint - ommiNavHeight
						}, scrollToSectionTime, 'swing', function () {
							isTransitioning = false;
						});

					} else {
						isTransitioning = false;
					}
					
					_this.resetFiltering(form); // Check for filters preset (potentially from query string)
				
				}, (openTransitionTime + 100));

			}

		},

		switchDiscoverMotivation: function (el) {

			if (!(el.hasClass(activeClass))) {
				var motivation = el.data('motivation'),
					$motivationInterests = $('#js-dap-discover-interests .interest[data-category="' + motivation + '"]');

				// Change the active motivation
				dap.discover.activeMotivation = motivation;

				// Reset motivations, then activate the current one
				dap.discover.$motivationsItems.removeClass(activeClass);
				el.addClass(activeClass);

				// Reset interests, then show/fade in interests of the chosen motivation
				dap.discover.$interestsItems.removeClass('faded-in');
				dap.discover.$interests.removeClass('interest-active');

				setTimeout(function () {
					dap.discover.$interestsItems.removeClass('visible'); // Hide all interests by default
					$motivationInterests.addClass('visible'); // Only show interests of this motivation
					dap.discover.$interests.slideDown(standardTransitionTime); // Then slide down the interests section

					setTimeout(function () {
						$motivationInterests.addClass('faded-in');
						dap.discover.$results.slideDown(standardTransitionTime);
					}, standardTransitionTime);

				}, standardTransitionTime);

				// Open the interests section
				dap.discover.$interests.addClass('open');

			}

		},

		resetDiscoverMotivation: function () {
			dap.discover.activeMotivation = '';
			dap.discover.$motivationsItems.removeClass(activeClass);
		},

		closeDiscoverMotivationPanel: function () {
			dap.discover.$interests.removeClass('open').slideUp(standardTransitionTime);
			dap.discover.$filterTypes.slideUp(standardTransitionTime);

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

				// Open the form and results sections
				dap.discover.$filterTypes.addClass('open');

			}

		},

		resetDiscoverInterest: function () {
			dap.discover.activeInterest = '';
			dap.discover.$interestsItems.removeClass(activeClass);
		},

		closeDiscoverInterestPanel: function () {
			dap.discover.$interests.removeClass('interest-active');
			dap.discover.$results.slideUp(dap.discover.transitionTime);
			dap.discover.$filterTypes.removeClass('open');
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
						if (value !== 'all' && value !== 'none') {
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

			} else if (activeSection === 'graduate') {

				for (var j = 0; j < graduateResults.length; j++) {
					result = graduateResults[j];
					title = result.title;
					degreeTypes = result.degreeTypes;
					schools = result.schools;

					_this.filterResult(result, title, interests, motivations, degreeTypes, schools);

				}

			}

			// Set the results count text
			if (activeSection === 'discover' || 
				activeSection === 'undergraduate') {
				resultsCountText = 'You are seeing ' + resultsSetCount + ' out of ' + undergraduateResults.length + ' Undergraduate Degrees and Programs';
			} else if (activeSection === 'graduate') {
				resultsCountText = 'You are seeing ' + resultsSetCount + ' out of ' + graduateResults.length + ' Graduate Degrees and Programs';
			}

			$resultsCount.removeClass('faded-in');

			setTimeout(function () {
				$resultsCount.text(resultsCountText).addClass('faded-in');
			}, standardTransitionTime);

			// Append results set HTML and lazyload results in view
			$('#js-dap-results-' + activeSection + ' .results-row').append(resultsSetHTML);
			_this.lazyloadResults();

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
			var title = result.title || '',
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

			resultHTML = '<article class="result columns small-12 clearfix">' +
		                    '<div class="image" role="img" data-src="' + imgSrc + '" aria-label="' + imgAlt + '">' +
		                        '<div class="active-content">' +
		                            '<div class="active-content-inner">' +
		                                '<p class="desc">' + desc + '</p>' +
		                                '<a href="' + href + '" title="View landing page for ' + title + ' program">Learn More <svg class="icon icon-double-chevron"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-double-chevron"></use></svg></a>' +
		                            '</div>' +
		                            '<span class="close"><svg class="icon icon-close"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use></svg></span>' +
		                        '</div>' +
		                        '<div class="active-content-toggle"><span>i</span></div>' +
		                    '</div>' +
		                    '<div class="result-content">' +
		                        '<h3 class="title"><a href="' + href + '" title="View landing page for ' + title + ' program">' + title + '</a></h3>' +
		                        campusHTML +
		                        degreeTypesHTML +
		                        '<p class="desc">' + desc + '</p>' +
		                        '<a href="' + href + '" title="View landing page for ' + title + ' program" class="button">Learn More <svg class="icon icon-double-chevron"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-double-chevron"></use></svg></span></a>' +
		                    '</div>';
		    
		    resultHTML = resultHTML + '</article>';

		    resultsSetHTML = resultsSetHTML + resultHTML;
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

			if (a.title < b.title) {
				return -1;
			}

			if (a.title > b.title) {
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

			_this.resetForm(form);
			_this.resetDiscoverMotivation();
			_this.resetDiscoverInterest();

			for (var k = 0; k < hashItems.length; k++) {
				var filter = decodeURIComponent(hashItems[k]);
				var filterName = filter.substring(0, filter.indexOf('='));
				var filterValue = filter.substring(filter.indexOf('=') + 1);

				if (filterName === 'type') {
					continue;
				} else if (filter.includes('keyword')) {

					$('#' + filterName).val(filterValue); // Set text input value

				} else if (filter.includes('school')) {

					$('#' + filterName).val(filterValue).change(); // Set select value and trigger change
					
				} else if (filter.includes('motivation')) {
					var $motivationInput = $('#' + filterName + '-' + filterValue);
					var motivation = $motivationInput.val();
					var $motivationInterests = $('#js-dap-discover-interests .interest[data-category="' + motivation + '"]');

					// Check the motivation input, make it active
					$motivationInput.prop('checked', true);
					$motivationInput.closest('.motivation').addClass('active');

					// Reset the interests, then show this motivation's interests
					dap.discover.$interestsItems.removeClass('faded-in visible');
					$motivationInterests.addClass('faded-in visible');

				} else if (filter.includes('interest')) {

					if (formType === 'discover') {
						var $interestInput = $('#' + filterName + '-' + filterValue);

						// Check the interest input, make it active
						$interestInput.prop('checked', true);
						$interestInput.closest('.interest').addClass('active');

					} else {
						$('#' + filterName).prop('checked', true); // Check the checkbox
					}

				} else {
					$('#' + filterName).prop('checked', true); // Check the checkbox
				}

			}

			hashChangesActive = false;

			if (formType && formType !== undefined && formType.length) {
				_this.resetFiltering(form);
			}

		},

		getHashValue: function (key) {
			var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
			return matches ? matches[1] : null;
		}

	};

})(window.jQuery, window.Modernizr, window, window.document);

$(function () {

	'use strict';

	chapman.degreesAndProgramsApp.init();

});
