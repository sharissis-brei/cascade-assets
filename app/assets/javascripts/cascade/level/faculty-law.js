$(function () {
    // NOTE: this script is for the LAW SCHOOL faculty listing page only, 
    // not /our-faculty/index.aspx or other school/dept listings
    // this is from level/js/faculty-law.js in Cascade
    if ( document.getElementById("LAWFacultyDirectorySearch") != null ) {
    var devUrl = "//chapmanfaculty.dev.breilabs.com",
        prodUrl = "//" + window.location.hostname,
        page = 0,
        resultsPerPage = 50,
        totalPages = 0,
        scope = (function () {
            if (window.sessionStorage) {
                switch (sessionStorage.scope) {
                    case "_faculty/full":
                        $("#fullTime").attr("checked", "checked");
                        break;
                    case "_faculty/all":
                        $("#showAll").attr("checked", "checked");
                        break;
                    case "_faculty/tenure":
                        $("#tenure").attr("checked", "checked");
                        break;
                    default:
                        break;
                }
            }
            var inputVal = $(".filter input:checked").val();
            switch (inputVal) {
                case "Tenure":
                    return "_faculty/tenure";
                case "Full Time":
                    return "full";
                case "All":
                    return "all";
                default:
                    return "_faculty/full";
            }
        })(),
        schoolFilter = (function () {
            var extensionStart = window.location.pathname.lastIndexOf("."),
                relativePath = window.location.pathname.substr(0, extensionStart).toLowerCase();

            switch (relativePath) {                
                case "/law/law-faculty/index".toLowerCase():
                    return "SOL";                
                default:
                    return "";
            }
        })(),
        //this faculty-law.js was copied from faculty.js. In that version departmentFilter and groupFilter were set thru Case logic.
        //rather than changing too much in this version of js, just set these two to blank and left rest of function as is.
        //not ideal. quick fix. should be done better later
        departmentFilter = "",
        groupFilter = "",
        keywords = "",
        facultyFeedUrl = function () {
            return prodUrl + "/" +
                   scope + "/" +
                   (keywords ? keywords + "/" : "") +
                   page + "/" +
                   resultsPerPage + "?" +
                   (schoolFilter ? ("school=" + schoolFilter + "&") : '') +
                   (departmentFilter ? ("dept=" + departmentFilter + "&") : '') +
                   (groupFilter ? ("facgroup=" + groupFilter + "&") : '') +
                   "callback=?";
        },
        populateResults = function () {
            //setting the sessionStorage.scope breaks app on some iPad minis. Remove for now
            //if (window.sessionStorage) {
            //    sessionStorage.scope = scope;
            //}

            $(".facultyList .facultyMember").addClass("old");
            $.getJSON(facultyFeedUrl(), function (data) {
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
                        splitTitles = splitTitles.replace(/;/gi, "<br/>"); 					
                    }                    
                    var result = {
                        link: data[i].CascadePath ? '/our-faculty/' + data[i].CascadePath : '',
                        image: v_photo,
                        firstName: $.trim(data[i].FacFirstName),
                        lastName: $.trim(data[i].FacLastName),
                        name: $.trim(data[i].FacFullName),
                        title: data[i].Rank,
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
                                cntr = cntr + 1;
                                school = data[i].Depts[j].SchoolName ? data[i].Depts[j].SchoolName : '';
                                if (data[i].Depts[j].DisplayDeptName != '' && data[i].Depts[j].DisplayDeptName != 'Conservatory of Music') {
                                    dept = data[i].Depts[j].FacGroupName ? data[i].Depts[j].DisplayDeptName + ', ' + data[i].Depts[j].FacGroupName: data[i].Depts[j].DisplayDeptName;
                                }
                                else {
                                     dept = data[i].Depts[j].FacGroupName ? data[i].Depts[j].FacGroupName : '';
                                }
                                //
                                if (cntr == 1) {
                                    prev_school = data[i].Depts[j].SchoolName ? data[i].Depts[j].SchoolName : '';
                                    prev_dept = dept;	 
                                }
                                else if (school == prev_school){
                                    if (prev_dept != '' && dept != '') {
                                        prev_dept = prev_dept + ', ' + dept;
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
                                        final_school_dept = prev_school;
                                    }
                                    else {
                                        if (prev_school != '') {
                                            final_school_dept = prev_school + "; " + prev_dept;
                                        }
                                        else {
                                            final_school_dept = prev_dept;
                                        }
                                    }
                                affiliation.push(final_school_dept);
                                prev_school = data[i].Depts[j].SchoolName ? data[i].Depts[j].SchoolName : '';
                                prev_dept = dept;	
                                }
                            }
                            //one final output after last loop to get last "previous" variable:
                            if (prev_dept == '') {
                                final_school_dept = prev_school;
                            }
                            else {
                                if (prev_school != '') {
                                    final_school_dept = prev_school + '; ' + prev_dept;
                                }
                                else {
                                    final_school_dept = prev_dept;
                                }
                            }
                            affiliation.push(final_school_dept);
                            return affiliation.join('<div class="spacer"></div>');
                        })(),
                        phone: data[i].OfficePhone,
                        email: data[i].ChapEmail,
                        specialty: (function () {
                                var spcl;
                                if (data[i].SpecialtyGrouping != 'none' && data[i].SpecialtyGrouping != '') {
                                    spcl = data[i].SpecialtyGrouping;
                                }
                                else {
                                    spcl = '';
                                }
                            return spcl;
                        })(),
                        id: data[i].DatatelId
                    }
                    $(".pagingInfo").before(formatResult(result));
                }
                if(data.length){
                    var rangeLower = (data[data.length - 1].CurrentPage * resultsPerPage) + 1,
                        rangeUpper = (data[data.length - 1].CurrentPage + 1) * data[data.length - 1].ResultsPerPage,
                        totalResults = data[data.length - 1].TotalResults;
                    
                    if (rangeUpper > totalResults) {
                        rangeUpper = totalResults;
                    }
                    $(".rangeLower").html(rangeLower);
                    $(".rangeUpper").html(rangeUpper);
                    $(".totalResults").html(totalResults);
                    totalPages = data[data.length - 1].TotalPages;
                    $(".pagingNavigation").show();
                }
                else{
                    $(".rangeLower").html(0);
                    $(".rangeUpper").html(0);
                    $(".totalResults").html(0);
                    totalPages = 0;
                    $(".pagingNavigation").hide();
                }
                $(".facultyList .facultyMember.old").remove();
            });
        };
    //
    populateResults();
    $(".directorySearchButton").click(function (event) {
        keywords = $.trim($("#directorySearchBox").val());
        if(keywords){
            scope = scope.replace('_faculty/', '_facultysearch/');            
        }
        else{
            scope = scope.replace('_facultysearch/', '_faculty/');
        }
        page = 0;
        populateResults();
    });
    //
    $('#directorySearchBox').keypress(function (event) {

        if (event.which == 13) {
            jQuery(this).blur();
            jQuery('.directorySearchButton').focus().click();
        }
    });
    //
    $(".first").click(function () {
        page = 0;
        populateResults();
    });
    $(".previous").click(function () {
        (page === 0) ? page = 0 : page -= 1;
        populateResults();
    });
    $(".next").click(function () {
        (page === totalPages) ? page = totalPages : page += 1;
        populateResults();
    });
    $(".last").click(function () {
        page = totalPages;
        populateResults();
    }); 
    //   
    $("#showAll").bind("change", function () {
        scope = "_faculty/all";
    });
    
    $("#fulltime").bind("change", function () {
        scope = "_facultysearch/full";
    });
    $("#tenure").bind("change", function () {
        scope = "_facultysearch/tenure";
    });
    //
    function formatResult(result) {
        var imgAlt = result.name ? 'Photo of ' + result.name : 'Faculty Member Photo',
            formattedResult =
            '<div class="facultyMember" itemscope itemtype="http://schema.org/Person">' +
                (result.image ? '<div class="profilePicture"><img width="80px" src="' + result.image + '" itemprop="image" alt="' + imgAlt + '"></div>' : '') +
                (result.name ? '<h2 class="name" itemprop="name">' + (result.link ? ('<a href="' + result.link) + '">' + result.name + '</a>' : result.name) + '</h2>' : '') +
                (result.title ? '<div class="title" itemprop="jobTitle">' + result.title + '</div>' : '') +
                (result.additionalTitles ? '<div class="additionalTitles" itemprop="jobTitle">' + result.additionalTitles + '</div>' : '') +
                (result.specialty ? '<div class="specialty" itemprop="specialty">' + result.specialty + '</div>' : '') +
                (result.affiliation ? '<div class="affiliation" itemprop="affiliation">' + result.affiliation + '</div>' : '') +                
                (result.email ? '<div class="email" itemprop="email"><a href="mailto:' + result.email + '">' + result.email + '</a></div>' : '') +
            '</div>';
        return formattedResult;
    }
} // end of IF around test for deptFacultyDirectorySearch on page so only runs on school/dept faculty listing page(s)
});