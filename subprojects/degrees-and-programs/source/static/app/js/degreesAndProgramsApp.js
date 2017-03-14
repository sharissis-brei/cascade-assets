/*global window:false */
/*global $:false */
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

		dap = {

			//----- Discover Section -----//
			discover: {
				fieldNamePrefix: 'dap-discover-',
				transitionTime: 500,
				activeMotivation: '',
				$motivationsItems: $('#js-dap-discover-motivations .motivation'),
				activeInterest: '',
				$interests: $('#js-dap-discover-interests'),
				$interestsItems: $('#js-dap-discover-interests .interest'),
				$filterTypes: $('#js-dap-discover-filter-types')
			},

			//----- Undergraduate Section -----//
			undergraduate: {
				fieldNamePrefix: 'dap-undergraduate-',
				transitionTime: 1500,
				$programTypes: $('#js-dap-undergraduate-program-types'),
				$interestsItems: $('#js-dap-undergraduate-interests input'),
				$resetInterests: $('#js-reset-undergraduate-interests')
			},

			//----- Graduate Section -----//
			graduate: {
				fieldNamePrefix: 'dap-graduate-',
				transitionTime: 1000,
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

			$('form').on('change', function (event) {
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

			}).on('submit', function (event) {
				event.preventDefault();
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
							isBridge = false;

						// Fallback in case no degree type is specified
						if (result.degreeTypes !== undefined) {

							// Check if this result is a bridge program
							for (var j = 0; j < result.degreeTypes.length; j++) {
								var degreeType = result.degreeTypes[j].type;

								if (degreeType === '4+1 and bridge') {
									isBridge = true;
									break;
								}

							}

						}

						// If it's a bridge program, it's both undergraduate and graduate
						if (isBridge) {
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
					imageSrc = image.data('src') || '';

				// Load the images dynamically
				image.css('background-image', 'url(' + imageSrc + ')');

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
			_this.resetDiscoverInterest();

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
				$('.dap-section.active .dap-body').slideUp(500);
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
				
				}, openTransitionTime);

			}

		},

		switchDiscoverMotivation: function (el) {
			var activeClass = 'active';

			if (!(el.hasClass(activeClass))) {
				var motivation = el.data('motivation'),
					motivationInterests = $('#js-dap-discover-interests .interest[data-category="' + motivation + '"]');

				// Change the active motivation
				dap.discover.activeMotivation = motivation;

				// Reset motivations, then activate the current one
				dap.discover.$motivationsItems.removeClass(activeClass);
				el.addClass(activeClass);

				// Reset interests, then show/fade in interests of the chosen motivation
				dap.discover.$interestsItems.removeClass('faded-in');
				setTimeout(function () {
					dap.discover.$interestsItems.removeClass('visible');
					motivationInterests.addClass('visible');
					setTimeout(function () { motivationInterests.addClass('faded-in'); }, 300);
				}, 300);

				// Open the interests section
				dap.discover.$interests.addClass('open');

			}

		},

		resetDiscoverMotivation: function () {
			var activeClass = 'active';

			dap.discover.activeMotivation = '';
			dap.discover.$motivationsItems.removeClass(activeClass);
			dap.discover.$interestsItems.removeClass('faded-in visible');
			dap.discover.$interests.removeClass('open');

		},

		switchDiscoverInterest: function (el) {
			var activeClass = 'active';
			
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
				setTimeout(function () {
					dap.discover.$filterTypes.addClass('show-overflow');
					$('#js-dap-results-discover').slideDown(500);
				}, 300);

			}

		},

		resetDiscoverInterest: function () {
			var activeClass = 'active';

			dap.discover.activeInterest = '';
			dap.discover.$interests.removeClass('interest-active');
			dap.discover.$interestsItems.removeClass(activeClass);
			dap.discover.$filterTypes.removeClass('open show-overflow');
			$('#js-dap-results-discover').slideUp(500);

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

		getActiveFilters: function (el) {
			var form = el.closest('form'),
				formData = form.serializeArray(),
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

					if (formattedName.includes('program')) { // Push to array if a program
						degreeTypesArray.push(value);
					} else if (formattedName.includes('interest')) { // Push to array if an interest
						interestsArray.push(value);
					} else if (formattedName.includes('school')) {

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
				motivationWithoutInterest = (activeFilters.motivation !== undefined && activeFilters.interests === undefined),
				result,
				title,
				interests,
				motivations,
				degreeTypes,
				schools,
				resultsCountText;

			if (activeSection === 'discover' || activeSection === 'undergraduate') {

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

					// Filter the result unless there's a motivation without interests chosen
					// Interests must be chosen if a motivation is chosen
					if (!motivationWithoutInterest) {
						_this.filterResult(result, title, interests, motivations, degreeTypes, schools);
					}

				}

			} else if (activeSection === 'graduate') {

				for (var j = 0; j < graduateResults.length; j++) {
					result = graduateResults[j];
					title = result.title;
					degreeTypes = result.degreeTypes;
					schools = result.schools;

					// Filter the result unless there's a motivation without interests chosen
					// Interests must be chosen if a motivation is chosen
					if (!motivationWithoutInterest) {
						_this.filterResult(result, title, interests, motivations, degreeTypes, schools);
					}

				}

			}

			// Set the results count text
			if (activeSection === 'discover' || activeSection === 'undergraduate') {
				resultsCountText = 'You are seeing ' + resultsSetCount + ' out of ' + undergraduateResults.length + ' Undergraduate Degrees and Programs';
			} else if (activeSection === 'graduate') {
				resultsCountText = 'You are seeing ' + resultsSetCount + ' out of ' + graduateResults.length + ' Graduate Degrees and Programs';
			}

			$resultsCount.removeClass('faded-in');

			setTimeout(function () {
				$resultsCount.text(resultsCountText).addClass('faded-in');
			}, 375);

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

				if (formattedTitle.includes(formattedKeyword)) {
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
						degreeTypesMatch = true;
					} else if (degreeTypes !== undefined) {

						for (var k = 0; k < degreeTypes.length; k++) {
							var degreeType = degreeTypes[k].type;

							if (activeFilters.degreeTypes.indexOf(degreeType) > -1) {
								degreeTypesMatch = true;
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
				campus,
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
				campus = result.campus.title || '';
				campusHTML = '<span class="campus">' + campus + '</span>';
			}

			// Only show this field if it's defined
			if (degreeTypes.length > 0) {

				degreeTypesHTML = '<ul class="degree-types clearfix">';

				for (var i = 0; i < degreeTypes.length; i++) {
					degreeTypesHTML = degreeTypesHTML + '<li>' + degreeTypes[i].title + '</li>';
				}

				degreeTypesHTML = degreeTypesHTML + '</ul>';

			}

			resultHTML = '<article class="result columns small-12 clearfix">' +
		                    '<div class="image" aria-role="image" data-src="' + imgSrc + '" aria-label="' + imgAlt + '">' +
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
			        	
			        	if (urlTypeQuery === 'undergraduate' || urlTypeQuery === 'graduate') {
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
				var fieldID = $(this).attr('id'),
					datalistHTML = '',
					datalistID = fieldID + '-datalist';

				if (fieldID.includes('-discover') || fieldID.includes('-undergraduate')) {
					datalistHTML = '<datalist id="' + datalistID + '">' + undergraduateAutocompleteOptions + '</datalist>';
				} else if (fieldID.includes('-graduate')) {
					datalistHTML = '<datalist id="' + datalistID + '">' + graduateAutocompleteOptions + '</datalist>';
				}

				// Add the datalist to the page
				$(this).attr('list', datalistID);
				$(this).after(datalistHTML);

			});

		},

		titleAlphaSort: function(a, b) {

			if (a.title < b.title) {
				return -1;
			}

			if (a.title > b.title) {
				return 1;
			}

			return 0;

		}

	};

})(window.jQuery, window.Modernizr, window, window.document);

$(function () {

	'use strict';

	chapman.degreesAndProgramsApp.init();

});