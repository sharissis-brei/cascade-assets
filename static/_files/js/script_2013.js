$(function () {

    /* IE 7 dialog */
    var IE7Dialog = '<div style="position: relative; margin-top: -15px; top: 0; height: 45px; background: #f2e842;" id="ie7_dialog"><p style="color: #5d591c; line-height: 45px; text-align: center; font-weight: bold;">It would appear you are running an outdated version of Internet Explorer. Please <a style="color: #5d591c; text-decoration: underline;" href="/upgrade-browser.aspx">download a modern browser</a> to ensure a pleasant browsing experience.</p></div>';
    $('body.ie7').prepend(IE7Dialog);
    /* end IE 7 dialog */
    /* Rotator
    ------------------------------------------------------------------------------------------------*/
    
    /* Get Query string for starting stage if exists, otherwise randomize starting stage
       pull in URL query string if available
    ------------------------------------------------------------------------------------------------*/
    var urlParams = {};
    (function () {
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.search.substring(1);

        while (e = r.exec(q))
        urlParams[d(e[1])] = d(e[2]);
    })();
    
    //alert(urlParams["stage"]);
    var stage = urlParams["stage"];
    var queryAutoplay = urlParams["autoplay"];
    var autoplay = true;
    
    //console.log(stage);
    var queryStartingPane = 0;
    var startingPane = 0;
    
    if (stage != undefined) { 
        queryStartingPane = stage;
        switch(queryStartingPane) {
            case "0": 
            case "imagine":
                startingPane = 0;
                break;
            //case "1":
            //case "explore":
           //     startingPane = 1;
           //     break;  
            case "1":
            case "create":
                startingPane = 1;
                break;
            //case "3":
            //case "global":
            //    startingPane = 3;
           //     break;  
            case "3": 
            case "leaders":
                startingPane = 3;
                break;
            default:
                startingPane = 0;
        }
    } else { 
        startingPane = (Math.floor(Math.random()*3)) 
    }
    if ( queryAutoplay == 'false') {
        autoplay = false;
        }
    
    if ($(".rotatorContainer").parent(".homepage").length > 0) 
    {
        $('.flexslider').flexslider({
            animation: "slide",
            touchSwipe: true,
            controlNav: false,
            pauseOnHover: true,
            pauseOnAction: true,
            pausePlay: true,
            randomize: false,
            slideshowSpeed: 10000,
            slideToStart: startingPane,
            slideshow: autoplay,
            start: function (slider) {
                g_mySlider = slider;
                var currentSlide = slider.slides[slider.currentSlide];

                if ($('html').hasClass("opacity")) {
                    $('.slide').not(currentSlide).fadeTo(0, 0.1,
                        function ()
                        {
                        }
                    );
                }
                else {
                    if ($(".ie7").length) {
                        $('.rotatorContainer').css('overflow', 'hidden');
                        $('.slide').not(currentSlide).css('margin-top', '-9999999px');
                    }
                    else {
                        $('.slide').not(currentSlide).css('visibility', 'hidden');
                    }
                }
            },
            before: function (slider) {
                var nextSlide = slider.slides[slider.animatingTo],
                    $nextSlide = $(nextSlide),
                    difference = (parseInt(slider.currentSlide) - parseInt(slider.animatingTo)),
                    offset = '100px',
                    currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide);

                if (difference === 1 || difference === -2) {
                    offset = '-100px';
                }

                $nextSlide.children(".bg1, .bg2, .bg3").stop().animate({ marginLeft: offset }, 300, function () {
                    $nextSlide.children(".bg3").animate({ marginLeft: '0' }, 500, function () { });
                    $nextSlide.children(".bg2").animate({ marginLeft: '0' }, 900, function () { });
                    $nextSlide.children(".bg1").animate({ marginLeft: '0' }, 700, function () { });
                });

                if ($('html').hasClass("opacity")) {
                    $('.slide').not(nextSlide).stop().fadeTo(500, .1, function () { });
                    $nextSlide.stop().fadeTo(500, 1, function () { });
                }

            },
            after: function (slider) {
                var currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide);

                $currentSlide.css({'opacity': 1})
                if (!$('html').hasClass("opacity")) {
                    if ($('.ie7').length) {
                        $('.slide').not(currentSlide).css('margin-top', '-99999999px');
                        $currentSlide.css('margin-top', '0px');
                    }
                    else {
                        $('.slide').not(currentSlide).css('visibility', 'hidden');
                        $currentSlide.css('visibility', 'visible');
                    }
                }
            }
        });
    }

    // Remove :focus outline from rotator nav arrows
    $(".flex-direction-nav li a").each(function () {
        $(this).attr("hideFocus", "true").css("outline", "none");
    });

    // Pause the slider once the user interacts with the slider
    $(".flex-direction-nav li a").live("click", function (event) {
        g_mySlider.pause();
        g_mySlider.resume = function () { };
    });

    // Keep the slide arrows on the edge of the browser window
    /*
    $(".flex-direction-nav li .flex-next").offset({ left: $("#container").outerWidth() - 43 });
    $(".flex-direction-nav li .flex-prev").offset({ left: $("#container").offset().left });

    $(window).bind("resize", function () {

        $(".flex-direction-nav li a.flex-next").offset({ left: $("#container").outerWidth() - 43 });
        $(".flex-direction-nav li a.flex-prev").offset({ left: $("#container").offset().left });

    });
    */

    // Flex navigation hover 
    $('.flex-direction-nav li a').hover(
        function () {
            $(this).animate({ opacity: 1 }, 200);
        }, function () {
            $(this).animate({ opacity: .3 }, 100);
        }
    );
    
    // Begin Analytics Event Tracking
    var analytics_stage_interaction_counter = 0;
    $("#main").find(".flex-direction-nav a").click(function(e) {
        analytics_stage_interaction_counter++;
        var keyword = 'unknown';
        if ($(this).attr('class') == 'flex-prev') keyword = 'Left Arrow';
        if ($(this).attr('class') == 'flex-next') keyword = 'Right Arrow';

        _gaq.push(['_trackEvent', 'Home Page Stage Interaction', 'Navigation Click', keyword, analytics_stage_interaction_counter]);
    });
    // End Analytics Event Tracking


    /* Search
    ------------------------------------------------------------------------------------------------*/

    $(".searchButton").click(function () {
        var searchTerm = $(this).siblings(".searchBox").val();
        search(searchTerm);
    });

    $(".searchBox").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            var searchTerm = $(this).val();
            search(searchTerm);
        }
    });

    function search(searchTerm) {
        window.location = "/search_results.asp?cx=003348829706320756496%3Adbv13petw_8&cof=FORID%3A9&ie=UTF-8&q=" + searchTerm + "&sa=Search&siteurl=chapman.edu%252F";
    }


    /* Small view hide/show top menus
    ------------------------------------------------------------------------------------------------*/

    $(".collapsedInfoForHeading").click(function () {
        $(this).add(".infoFor").toggleClass("active");
        $(this).siblings("h5, div").removeClass("active");
        $(".resources-subNav-login, .resources-subNav-search").removeClass("active");
    });

    $(".collapsedResourcesHeading").click(function () {
        $(this).add(".resources-subNav-login").toggleClass("active");
        $(this).siblings("h5, div").removeClass("active");
        $(".infoFor, .resources-subNav-search").removeClass("active");
    });

    $(".collapsedSearchHeading").click(function () {
        $(this).add(".resources-subNav-search").toggleClass("active");
        $(this).siblings("h5, div").removeClass("active");
        $(".infoFor, .resources-subNav-login").removeClass("active");
        // autofocus search box
        $("#smallSearchBox").css({
            fontSize: '16px'
        }).focus();
    });

    /* Video overlay
    ------------------------------------------------------------------------------------------------*/

    $(".videoLink").live("click", function (event) {
        event.preventDefault();
        var src = $(this).attr("data-video");
        $("#videoContainer .video").attr('src', src);


        $(".overlay").show(0).animate({ top: 0 }, 1e3, function () { g_mySlider.manualPause = true; g_mySlider.pause(); });
    });
    
    // Link to flash download if not detected
    if (!swfobject.hasFlashPlayerVersion("9.0.115")) {
        $(".overlay").prepend('<p style="position:absolute;top:15px;text-align:center;width:100%;">This video requires at least version 9.0.115 of <a href="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" target="_blank">Adobe Flash Player</a></p>');
    }

    $(".closeButton").live("click", function () {
        $(".overlay").animate({ top: "700px" }, 1e3, function () { }).hide(0);
        var videoClone = $('#videoContainer').html();
        $('#videoContainer div').remove();
        $("#videoContainer").html(videoClone);
        g_mySlider.resume();
    });

    /* Populate events from JSON feed 
    ------------------------------------------------------------------------------------------------*/

   /* $.getJSON("//web.chapman.edu/eventscalendar/jsonp.ashx?method=?", function (data) {
        var i,
            eventsData = data,
            events = [
                        {
                            $month: $(".events .story2 .date .month"),
                            $day: $(".events .story2 .date .day"),
                            $year: $(".events .story2 .date .year"),
                            $heading: $(".events .story2 h4 .description"),
                            $link: $(".events .story2 h4>a")
                        },
                        {
                            $month: $(".events .story3 .date .month"),
                            $day: $(".events .story3 .date .day"),
                            $year: $(".events .story3 .date .year"),
                            $heading: $(".events .story3 h4 .description"),
                            $link: $(".events .story3 h4>a")
                        },
                        {
                            $month: $(".events .story4 .date .month"),
                            $day: $(".events .story4 .date .day"),
                            $year: $(".events .story4 .date .year"),
                            $heading: $(".events .story4 h4 .description"),
                            $link: $(".events .story4 h4>a")
                        }
                    ];

        for (i = 0; i < events.length; i++) {
            try {
                events[i].$month.html(toShortMonthName(eventsData.item[i].pubDate.split('/')[0]));
                events[i].$day.html(pad2(parseInt(eventsData.item[i].pubDate.split('/')[1], 10)));
                events[i].$year.html(eventsData.item[i].pubDate.split('/')[2].split(' ')[0]);
                events[i].$heading.html(eventsData.item[i].title);
                events[i].$link.attr('href', eventsData.item[i].link);
            }
            catch (err) {
                // something is wrong with the data source
                break;
            }
        }
    });
   */
   
    var eventsFeedUrl = "//www.chapman.edu/getFeed.ashx?name=majorEvents",
    eventsYqlUrl = function () { return ("//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss(3)%20where%20url%3D'" + eventsFeedUrl + "'&format=json&diagnostics=true&callback=?") },
    eventsFeedOptions = $(".eventsFeed").text();
    $(".allEvents").attr("href", "/events/calendar.aspx");
    
    
    $.getJSON(eventsYqlUrl(), function (data) {

        var i,
            eventsData = data.query.results,
            events = [
                        {
                            $month: $(".events .story2 .date .month"),
                            $day: $(".events .story2 .date .day"),
                            $year: $(".events .story2 .date .year"),
                            $heading: $(".events .story2 h4 .description"),
                            $link: $(".events .story2 h4>a")
                        },
                        {
                            $month: $(".events .story3 .date .month"),
                            $day: $(".events .story3 .date .day"),
                            $year: $(".events .story3 .date .year"),
                            $heading: $(".events .story3 h4 .description"),
                            $link: $(".events .story3 h4>a")
                        },
                        {
                            $month: $(".events .story4 .date .month"),
                            $day: $(".events .story4 .date .day"),
                            $year: $(".events .story4 .date .year"),
                            $heading: $(".events .story4 h4 .description"),
                            $link: $(".events .story4 h4>a")
                        }
                    ];


        for (i = 0; i < events.length; i++) {
            try {
                //pubdate sometimes contained original but not current event date; use category field instead (has yyyy/mm/dd format)
                //events[i].$month.html(toShortMonthName(eventsData.item[i].pubDate.split('/')[0]));
                //events[i].$day.html(pad2(parseInt(eventsData.item[i].pubDate.split('/')[1], 10)));
                //events[i].$year.html(eventsData.item[i].pubDate.split('/')[2].split(' ')[0]);   
                events[i].$month.html(toShortMonthName_fromstring(eventsData.item[i].category.split('/')[1]));  
                events[i].$day.html(pad2(parseInt(eventsData.item[i].category.split('/')[2], 10)));
                events[i].$year.html(eventsData.item[i].category.split('/')[0]);
                events[i].$heading.html(eventsData.item[i].title);
                events[i].$link.attr('href', eventsData.item[i].link);
            }
            catch (err) {
                // something is wrong with the data source
                break;
            }
        }
    });
   
     /* Populate news from Wordpress RSS feed (converted to JSON with YQL)
    ------------------------------------------------------------------------------------------------*/
    var newsFeedUrl ='//www.chapman.edu/getFeed.ashx?name=happenings',
        yqlNewsUrl = "//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss(3)%20where%20url%20%3D%20'" + newsFeedUrl + "'&format=json&diagnostics=true&callback=?";

    $.getJSON(yqlNewsUrl, function(data){
       
        var i;
        var newsData = data.query.results;

        for (i = 0; newsData&&i<3; i++) {
            var month = newsData.item[i].pubDate.split(' ')[2].toUpperCase();
            var day = pad2(parseInt((newsData.item[i].pubDate.split(' ')[1]),10));
            var year = newsData.item[i].pubDate.split(' ')[3];
            var link = newsData.item[i].link;
            var heading = newsData.item[i].title;
            var subheading = newsData.item[i].description;
            var story = '<div class="story' + (i+2) + ' rss-story" itemscope itemtype="http://schema.org/Article"><h4><a href="' + link +'" target="_blank"><div class="date" itemprop="datePublished"><div class="day">' + day + '</div><div class="month">' + month + '</div><div class="year">' + year + '</div></div><span class="description">' + heading + '</span></a></h4>' + subheading + '</div>';
            $('.news span.insert').append(story);
        }
        
    });

    /* Populate weather from jsonp feed
    ------------------------------------------------------------------------------------------------*/

    $.getJSON("//forecast.chapman.edu/chapman/banner-json.php?callback=?", function (data) {


        var iconPath = data.weather.icon_path,
            tempF = data.weather.temp_f,
            tempC = data.weather.temp_c,
            url = "//www.chapman.edu",
            $weather = $(".weather");

        $weather.find("img").attr("src", url + iconPath);
        $weather.find(".temp .f").html(tempF + "&deg; F");
        $weather.find(".temp .c").html(tempC + "&deg; C");
    });

    /* Set copyright date to current year
    ------------------------------------------------------------------------------------------------*/

    (function () {
        var today = new Date();
        $(".copyrightYear").html(today.getFullYear());
    })();

    //$.getScript("/_files/level/js/welcome.js");    
    
    /* New Nav */
    $('.mainNavExpand').bind('click', function() {
        $('.mainNav').toggleClass('open');
        if ($('.mainNav').hasClass('open')) {
            $('.mainNavExpand .arrow').html('&#8963;');
        } else {
            $('.mainNavExpand .arrow').html('&#8964;');
        }
    });
});

/* Convert month format from numbers to abbreviation
------------------------------------------------------------------------------------------------*/
function toShortMonthName(month) {
    switch (parseInt(month)) {
        case 1:
            return 'JAN';
        case 2:
            return 'FEB';
        case 3:
            return 'MAR';
        case 4:
            return 'APR';
        case 5:
            return 'MAY';
        case 6:
            return 'JUN';
        case 7:
            return 'JULY';
        case 8:
            return 'AUG';
        case 9:
            return 'SEPT';
        case 10:
            return 'OCT';
        case 11:
            return 'NOV';
        case 12:
            return 'DEC';
        default:
            return '';
    }
}
/* Convert month format from 2-digit (leading zero) string to abbreviation
------------------------------------------------------------------------------------------------*/
function toShortMonthName_fromstring(month) {
    switch (month) {
        case '01':
            return 'JAN';
        case '02':
            return 'FEB';
        case '03':
            return 'MAR';
        case '04':
            return 'APR';
        case '05':
            return 'MAY';
        case '06':
            return 'JUN';
        case '07':
            return 'JULY';
        case '08':
            return 'AUG';
        case '09':
            return 'SEPT';
        case '10':
            return 'OCT';
        case '11':
            return 'NOV';
        case '12':
            return 'DEC';       
        default:
            return '';
    }
}
/* Pad day with leading zero
------------------------------------------------------------------------------------------------*/

function pad2(number) {

    return (number < 10 ? '0' : '') + number;

}

/* Google form IIFE */

(function($) {

            var $formClone = $('#cse-search-form form').clone(),
                $searchButtonClone = $('#cse-search-form form input.gsc-search-button').clone(true),
                $formCloneSmall = $('#cse-search-form-small form').clone(),
                $searchButtonCloneSmall = $('#cse-search-form-small form input.gsc-search-button').clone(true);

            $('#cse-search-form form').remove();
            $formClone.appendTo('#cse-search-form');  
            $('#cse-search-form form input.gsc-search-button').replaceWith($searchButtonClone);

            $('#cse-search-form-small form').remove();
            $formCloneSmall.appendTo('#cse-search-form-small');  
            $('#cse-search-form-small form input.gsc-search-button').replaceWith($searchButtonCloneSmall);

            $('#cse-search-form form input, #cse-search-form-small form input').removeAttr('disabled');

            $('#cse-search-form form input, #cse-search-form-small form input').live('keydown', function(e){
             
                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                    e.preventDefault();
                }
                $(this).css({background:'none'});

            }); 

            $('#cse-search-form-small form input').live('focus', function(){
                $('.rotatorContainer').css("visibility", "hidden");
            });

            $('#cse-search-form-small form input').live('blur', function(){
                $('.rotatorContainer').css("visibility", "visible");
            });

            $('#cse-search-form form input, #cse-search-form-small form input').live('keydown', function(e){
                
                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                    BREI.Personalization.pushToRecentSearches($(this).val());
                    googleSearch($(this).val());
                }

            });

            $('#cse-search-form form input.gsc-search-button').click(function(){
                googleSearch($('#cse-search-form form input').val());
            });

            $('#cse-search-form-small form input.gsc-search-button').click(function(){
                googleSearch($('#cse-search-form-small form input').val());
            });

            function googleSearch(value){
                window.location = "/search-results/index.aspx?q=" + value;
            }


})(jQuery);