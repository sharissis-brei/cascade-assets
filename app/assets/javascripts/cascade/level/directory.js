$(function () {

    //NOTE: this script is used only for the main listing page /our-faculty/index.aspx NOT for the school/dept specific listing pages. They use faculty.js.
    var devUrl = "//chapmanfaculty.dev.breilabs.com",
        prodUrl = "//" + window.location.hostname,
        page = 0,
        resultsPerPage = 20,
        totalPages = 0,
        scope = "_faculty/all",
        schoolFilter = "",
        departmentFilter = "",
        keywords = "",
        facultyFeedUrl = function () {
            return prodUrl + "/" +
                   scope + "/" +
                   (keywords ? keywords + "/" : "") +
                   page + "/" +
                   resultsPerPage + "?" +
                   (schoolFilter ? ("school=" + schoolFilter + "&") : '') +
                   (departmentFilter ? ("dept=" + departmentFilter + "&") : '') +
                   "callback=?";
        },
        applyUserInput = function () {

            // A little bit of session storage to rememeber form state
            if (window.sessionStorage) {
                var directorySearchBox = document.getElementById("directorySearchBox"),
                    collegeFilterSelect = document.getElementById("collegeFilter"),
                    departmentFilterSelect = document.getElementById("departmentFilter");

                // Search Box
                if (sessionStorage.keywords) {
                    directorySearchBox.value = sessionStorage.keywords;
                }
                directorySearchBox.onkeyup = function (e) {
                    sessionStorage.keywords = this.value;
                }

                // All faculty checkbox session storage handled in onclick function

                // College Filter

                if (sessionStorage.collegeFilter && !$("#allFaculty:checked").length) {
                    collegeFilterSelect.value = sessionStorage.collegeFilter;
                }
                $(collegeFilterSelect).bind("change", function () {
                    sessionStorage.collegeFilter = collegeFilterSelect.value;
                });

                // Department Filter
                if (sessionStorage.departmentFilter && !$("#allFaculty:checked").length) {
                    departmentFilterSelect.value = sessionStorage.departmentFilter;
                }
                $(departmentFilterSelect).bind("change", function () {
                    sessionStorage.departmentFilter = departmentFilterSelect.value;
                });
            }

            var allFaculty = $("#allFaculty:checked").length,
                searchString = $("#directorySearchBox").val();

            schoolFilter = $("#collegeFilter option:selected").val();
            departmentFilter = $("#departmentFilter option:selected").val();

            if ($("#allFaculty:checked").length) {
                schoolFilter = '';
                departmentFilter = '';
            }

            if (!(searchString)) {
                allFaculty = true;
            }

            if (allFaculty) {
                scope = "_faculty/all";
                keywords = '';
            }
            else {
                scope = "_search";
                keywords = $.trim(searchString);
            }
        },
        populateResults = function () {
            $.getJSON(facultyFeedUrl(), function (data) {

                // remove old results
                $(".searchResults .result").remove();

                globalData = data;
                for (var i = 0; i < data.length; i++) {
                    var v_photo;
                	if (!data[i].ThumbnailPhoto) {
						v_photo = '/_files/level/img/unisex-silhouette.jpg';
					}
					else if (data[i].ThumbnailPhoto == '/') {
						v_photo = '/_files/level/img/unisex-silhouette.jpg';
					}
					else if (data[i].ThumbnailPhoto == '') {
						v_photo = '/_files/level/img/unisex-silhouette.jpg';
					}
					else {
						v_photo = data[i].ThumbnailPhoto;
					}
                    
                    //put each title on own line
    				var splitTitles = data[i].AdditionalTitles;
					if (splitTitles != '' && splitTitles != null) {
						splitTitles = splitTitles.replace(/;/gi, "
<br/>");					
					}
                    
                    var result = {
                        link: data[i].CascadePath ? '/our-faculty/' + data[i].CascadePath : '',
                        image: v_photo,
                        name: $.trim(data[i].FacFullName),
                        title: data[i].Rank,
                        //additionalTitles: data[i].AdditionalTitles,
                        additionalTitles: splitTitles,
                        affiliation: (function () {
                            var affiliation = [];
							var cntr = 0;
							var dept = '';
							var school = '';
							var prev_school = '';
							var prev_dept = '';
							var final_school_dept = '';
                            for (var j = 0; j < (data[i].Depts.length); j++) {
                                //affiliation.push(data[i].Depts[j].SchoolName);
								cntr = cntr + 1;
								school = data[i].Depts[j].SchoolName ? data[i].Depts[j].SchoolName : '';
								//dept = '';
                                if (data[i].Depts[j].DisplayDeptName != '' && data[i].Depts[j].DisplayDeptName != 'Conservatory of Music') {
                                    dept = data[i].Depts[j].FacGroupName ? data[i].Depts[j].DisplayDeptName + ', ' + data[i].Depts[j].FacGroupName: data[i].Depts[j].DisplayDeptName;
									//dept = 'dept1';
                                }
								else {
                                     dept = data[i].Depts[j].FacGroupName ? data[i].Depts[j].FacGroupName : '';
									 //dept = 'dept2';
                                }							                    
                                //
								if (cntr == 1) {
									prev_school = data[i].Depts[j].SchoolName ? data[i].Depts[j].SchoolName : '';
									prev_dept = dept;	 
								}
								else if (school == prev_school){
									if (prev_dept != '' && dept != '') {
										prev_dept = prev_dept + ", " + dept;
									}
									else if (prev_dept != '') {
										prev_dept = prev_dept;
									}
									else   {
										prev_dept = dept;
									}
								
								}
								else {
									if (prev_dept == '') {
										if (data[i].DeanFlag == 'Y') {
											final_school_dept = prev_school + ", 
<em>Dean</em>";
										}
										else {
											final_school_dept = prev_school;	
										}
									}
									else {
										if (prev_school != '') {
                                            if (data[i].DeanFlag == 'Y') 
                                            {
                                                final_school_dept = prev_school + "; " + prev_dept + ", 
<em>Dean</em>";
                                            }
                                            else 
                                            {
                                               final_school_dept = prev_school + "; " + prev_dept; 
                                            }
												
										}
										else {
                                            if (data[i].DeanFlag == 'Y') 
                                            {
                                                final_school_dept = prev_dept + ", 
<em>Dean</em>"
                                            }
                                            else 
                                            {
                                              final_school_dept = prev_dept;  
                                            }
											
										}
									}
									
									affiliation.push(final_school_dept);
								prev_school = data[i].Depts[j].SchoolName ? data[i].Depts[j].SchoolName : '';
								prev_dept = dept;	
								}
								
                            }
							//one final output after last loop to get last "previous" variable:
							if (prev_dept == '') {
								if (data[i].DeanFlag == 'Y') {
									final_school_dept = prev_school + ", 
<em>Dean</em>";
								}
								else {
									final_school_dept = prev_school;	
								}
							}
							else {
								if (prev_school != '') {
                                    if (data[i].DeanFlag == 'Y') {
									    final_school_dept = prev_school + "; " + prev_dept + ", 
<em>Dean</em>";	
                                    }
                                    else
                                    {
                                        final_school_dept = prev_school + "; " + prev_dept;
                                    }
								}
								else {
                                    if (data[i].DeanFlag == 'Y') {
									    final_school_dept = prev_dept + ", 
<em>Dean</em>";    
                                    }
                                    else {
                                        final_school_dept = prev_dept;
                                    }
								}
							}							
							affiliation.push(final_school_dept);
							
                            return affiliation.join("
<br>");
                        })(),
                        phone: data[i].OfficePhone,
                        email: data[i].ChapEmail
                    }

                    $(".searchResults .pagingInfo").before(formatResult(result));
                }
                var rangeLower = data[data.length - 1] ? ((data[data.length - 1].CurrentPage * resultsPerPage) + 1) : 0,
                    rangeUpper = data[data.length - 1] ? ((data[data.length - 1].CurrentPage + 1) * data[data.length - 1].ResultsPerPage) : 0,
                    totalResults = data[data.length - 1] ? (data[data.length - 1].TotalResults) : 0;

                if (rangeUpper > totalResults) {
                    rangeUpper = totalResults;
                }

                $(".rangeLower").html(rangeLower);
                $(".rangeUpper").html(rangeUpper);
                $(".totalResults").html(totalResults);
                totalPages = data[data.length - 1] ? (data[data.length - 1].TotalPages) : 0;

                
            });
        };

    applyUserInput();
    populateResults();

    // Bind some functions to run automatically
    $('#directorySearchBox').on('keyup', debounce(fetchNewResults, 400));
    $('#collegeFilter').on('change', fetchNewResults);
    $('#departmentFilter').on('change', fetchNewResults);
    $('#allFaculty').on('change', fetchNewResults);
    $('.directorySearchButton').on('click', scrollToResultTop);


    function fetchNewResults() {
        applyUserInput();
        page = 0;
        populateResults();
    }

    $(".directorySearchButton").click(fetchNewResults);

    $('#directorySearchBox').keypress(function (event) {

        if (event.which == 13) {
            jQuery(this).blur();
            jQuery('.directorySearchButton').focus().click();
        }
    });

    $("#allFaculty").click(function () {
        if ($("#allFaculty:checked").length) {
            //$("select").val($('options:first').val());
            $("#directorySearchBox, #collegeFilter, #departmentFilter").attr("disabled", "disabled");
        }
        else{            
            $("#directorySearchBox, #collegeFilter, #departmentFilter").removeAttr("disabled");
        }

        if (window.sessionStorage) {
            sessionStorage.allFaculty = $("#allFaculty:checked").length;
        }
    });


    $(".first").click(function () {
        if (page != 0) scrollToResultTop(populateResults, true);
        page = 0;
    });

    $(".previous").click(function () {
        if (page != 0) scrollToResultTop(populateResults, true);
        (page === 0) ? page = 0 : page -= 1;
    });

    $(".next").click(function () {
        if (page != totalPages) scrollToResultTop(populateResults, true);
        (page === totalPages) ? page = totalPages : page += 1;
    });

    $(".last").click(function () {
        if (page != totalPages) scrollToResultTop(populateResults, true);
        page = totalPages;
    });

    function scrollToResultTop(callback, extra_fx) {

        if (extra_fx) {
            $('.result').fadeOut(600, function() {
                $(this).show();
            });
        }

        $('html, body').stop().animate({
            'scrollTop': $('#searchResults').offset().top - 150
        }, 600, 'swing', callback);
    }

    function formatResult(result) {

        var formattedResult =
            '
    <div class="result" itemscope itemtype="http://schema.org/Person">' +
                (result.link ? '
        <a class="link" href="' + result.link + '" itemprop="url">VIEW PROFILE</a>' : '') +
                (result.image ? '
        <div class="profilePicture">
            <img class="image" width="80px" src="' + result.image + '" itemprop="image">
            </div>' : '') +
                (result.name ? '
            <div class="name" itemprop="name">' + result.name + '</div>' : '') +
                (result.title ? '
            <div class="title" itemprop="jobTitle">' + result.title + '</div>' : '') +
                (result.additionalTitles ? '
            <div class="additionalTitles" itemprop="jobTitle">' + result.additionalTitles + '</div>' : '') +
                (result.affiliation ? '
            <div class="affiliation" itemprop="affiliation" style="margin-top:5px;">' + result.affiliation + '</div>' : '') +
        //(result.phone ? '
            <div class="phone" itemprop="telephone">' + result.phone + '</div>' : '') +
                (result.email ? '
            <a class="email" href="mailto:' + result.email + '" itemprop="email">' + result.email + '</a>' : '') +
            '
        </div>';

        return formattedResult;
    }

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

});