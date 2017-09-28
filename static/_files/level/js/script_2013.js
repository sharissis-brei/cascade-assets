$(function () {

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

    /* starting tab for level pages with newsEventsNav li */

    // Validate Data
    if ((urlParams["startingtab"] != undefined) && (urlParams["startingtab"] == parseInt(urlParams["startingtab"])) && (urlParams["startingtab"] - 1 < $(".main .newsEventsNav li").length)) {

        // Offset for zero based arrays
        if (urlParams["startingtab"] != 0)
            urlParams["startingtab"] = urlParams["startingtab"] - 1;
        
        var $activeElementRegion = $(".main .newsEventsNav li").eq(urlParams["startingtab"]);

        // Set active class
        $activeElementRegion.addClass("active").siblings().removeClass("active");
        // Update the content section - set active content to display
        $activeElementRegion.parent(".newsEventsNav").siblings(".newsEventsContent").children("li:eq(" + urlParams["startingtab"] + ")").addClass("active").siblings().removeClass("active");
        
        // Scroll to the active element
        setTimeout(function(){
            $('html, body').stop().animate({
                scrollTop:$activeElementRegion.offset().top
            },1000) ;
        },350);
    }

    /* starting tab for level pages with <div> Q/A style elements */

    // Validate Data
    if ((urlParams["openregion"] != undefined) && (urlParams["openregion"] == parseInt(urlParams["openregion"])) && urlParams["openregion"] - 1 < $(".main .accordion").length) {

        // Offset for zero based arrays
        if (urlParams["openregion"] != 0) 
            urlParams["openregion"] = urlParams["openregion"] - 1;
        
        var $activeElementRegion = $(".main .accordion").eq(urlParams["openregion"]);

        // Add the active class to nth accordion and remove all other active classes
        $activeElementRegion.addClass("active").siblings().removeClass("active");

        // Display the current region
        $activeElementRegion.find("div.content").show();

        // Hide the other regions
        $activeElementRegion.siblings().find("div.accordion div.content").hide();
        
        // Scroll to the active element
        setTimeout(function(){
            $('html, body').stop().animate({
                scrollTop:$activeElementRegion.offset().top
            },1000) ;
        },350);
    }

    /* End starting tab code */

    $(".accordion .content").not(".accordion.active .content").css("display", "none");

    $(".accordion .header").click(function () {
        $(this).parent(".accordion").toggleClass("active").children(".content").slideToggle('fast');
    });
    

    /* Masthead Class
    ------------------------------------------------------------------------------------------------*/
    if ($(".masthead").length && $(".masthead img").length) {
        $("#container").addClass("bigMasthead").removeClass("smallMasthead");
    }

     /* Rotator
    ------------------------------------------------------------------------------------------------*/

    if ($(".rotatorContainer").parent(".mosaic").length > 0) {
        $('.flexslider').flexslider({
            animation: "slide",
            touchSwipe: true,
            controlNav: false,
            pauseOnHover: true,
            pauseOnAction: true,
            pausePlay: true,
            randomize: false,
            slideshowSpeed: (function () {


                var setting = $(".slideOptions .speed").text(),
                    speed = 10000;

                if (setting > 0) {
                    speed = 1000 * setting;
                }

                return speed;
            })(),
            slideToStart: (function () {
                var number = $(".slideOptions .startingSlideNumber").text();

                if (number > 0) {
                    return (number - 1);
                }
                else {
                    return 0;
                }

            })(),
            slideshow: (function () {
                var isAuto = $(".slideOptions .autoRotate").text() ? true : false;

                return isAuto;

            })(),
            animationLoop: true,
            start: function (slider) {
                g_mySlider = slider;
                var currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide);

            },
            before: function (slider) {

            },
            after: function (slider) {
                var currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide);
            }
        });

        // Initialize tipsy for info rollovers
        $(".mosaic .info").each(function (index) {
            if (!$(this).attr("title")) {
                $(this).remove();
            }
        });

        $(".info").tipsy({
            fade: true,
            gravity: $.fn.tipsy.autoWE
        });

        $(".nameBar .slideDescription").remove();
    }
    else if ($(".rotatorContainer").parent(".rounded-slider").length > 0) {

        $('.rounded-slider').find('.red').html('<p>' + $(".rounded-slider .slide:first-child").attr('data-red') + '</p>');        
        
        if($(".rounded-slider .slide:first-child").attr('data-link')){
           $('.rounded-slider').find('.red').append(
                $("<a>").attr({
                    'href': $(".rounded-slider .slide:first-child").attr('data-link'),
                    'title': 'Learn More'
                }).html("Learn More &raquo;")

            );
        }
        else{
            $('.rounded-slider').find('.red').addClass("no-link");
        }
        
        if (!$(".rounded-slider .info-container .red p").text()) {
            $(".rounded-slider .info-container .red").hide();
        }

        $('.flexslider').flexslider({
            animation: "slide",
            touchSwipe: true,
            directionNav: false,
            pauseOnHover: true,
            pauseOnAction: true,
            pausePlay: true,
            randomize: false,
            slideshowSpeed: (function () {

                var setting = $(".slideOptions .speed").text(),
                    speed = 10000;

                if (setting > 0) {
                    speed = 1000 * setting;
                }

                return speed;
            })(),
            slideToStart: (function () {
                var number = $(".slideOptions .startingSlideNumber").text();

                if (number > 0) {
                    return (number - 1);
                }
                else {
                    return 0;
                }

            })(),
            slideshow: (function () {
                var isAuto = $(".slideOptions .autoRotate").text() ? true : false;

                return isAuto;

            })(),
            animationLoop: true,
            start: function (slider) {
                g_mySlider = slider;
                var currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide),
                    red = $('.rounded-slider').find('.red');
                //blue = $('.rounded-slider').find('.blue');

                var caption = $currentSlide.attr('data-red');
                //var title = $currentSlide.attr('data-blue');
                var link = $currentSlide.attr('data-link');

                red.removeClass('no-link');
                
                if (caption) {
                    red.html("<p>" + caption + "</p>");
                }
                else {
                    red.hide();
                }
                //blue.html("<p>"+title+"</p>");

                if (link) {
                    red.append(
                        $("<a>").attr({
                            'href': link,
                            'title': 'Learn More'
                        }).html("Learn More &raquo;")
                    )
                } else {
                    red.addClass('no-link');
                }

            },
            before: function (slider) {

                var red = $('.rounded-slider').find('.red');
                //    blue = $('.rounded-slider').find('.blue');

                red.find('a').remove();
                red.find('p').animate({
                    opacity: 0
                }, 500);
                //    blue.find('p').animate({
                //        opacity: 0
                //    }, 500);

            },
            after: function (slider) {
                g_mySlider = slider;
                var currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide),
                    red = $('.rounded-slider').find('.red');
                //blue = $('.rounded-slider').find('.blue');

                var caption = $currentSlide.attr('data-red');
                //var title = $currentSlide.attr('data-blue');
                var link = $currentSlide.attr('data-link');

                red.removeClass('no-link');

                if (caption) {
                    red.find('p').html(caption);
                    red.show('');
                }
                else {
                    red.hide('');
                }
                //blue.find('p').html(title);

                if (link) {
                    red.append(
                        $("<a>").attr({
                            'href': link,
                            'title': 'Learn More'
                        }).css('opacity', 0).html("Learn More &raquo;")
                    )
                } else {
                    red.addClass('no-link');
                }

                red.find('p, a').animate({
                    opacity: 1
                }, 500);
                //blue.find('p').animate({
                //    opacity: 1
                //}, 500);
            }
        });

        // Keep the slide arrows on the edge of the browser window

        // $(".flex-direction-nav li .next").offset({ left: $("#container").outerWidth() - 43 });
        // $(".flex-direction-nav li .prev").offset({ left: $("#container").offset().left });

        // $(window).bind("resize", function () {

        //     $(".flex-direction-nav li a.next").offset({ left: $("#container").outerWidth() - 43 });
        //     $(".flex-direction-nav li a.prev").offset({ left: $("#container").offset().left });

        // });

    }
    else {

        $('.flexslider').flexslider({
            animation: "slide",
            touchSwipe: true,
            controlNav: false,
            pauseOnHover: true,
            pauseOnAction: true,
            pausePlay: true,
            randomize: false,
            slideshowSpeed: (function () {

                var setting = $(".slideOptions .speed").text(),
                    speed = 10000;

                if (setting > 0) {
                    speed = 1000 * setting;
                }

                return speed;
            })(),
            slideToStart: (function () {
                var number = $(".slideOptions .startingSlideNumber").text();

                if (number > 0) {
                    return (number - 1);
                }
                else {
                    return 0;
                }

            })(),
            slideshow: (function () {
                var isAuto = $(".slideOptions .autoRotate").text() ? true : false;

                return isAuto;

            })(),
            animationLoop: true,
            start: function (slider) {
                g_mySlider = slider;
                var currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide);

                $(".flexslider .slides .slide").removeClass("active");
                $currentSlide.addClass("active");

                $(".blockOut").fadeOut();

                $(".slideDescription .centeredContent").html($currentSlide.children(".dataDescription").html());
                if (!$(".slideDescription .centeredContent").html()) {
                    $(".slideDescription").addClass("visuallyhidden");
                }
                else {
                    $(".slideDescription").removeClass("visuallyhidden");
                }
            },
            before: function (slider) {

                $(".blockOut").stop().fadeIn();
                $(".slide").stop().fadeTo(250, .2, function () { });

            },
            after: function (slider) {
                var currentSlide = slider.slides[slider.currentSlide],
                    $currentSlide = $(currentSlide);

                $(".blockOut").stop().fadeOut("slow");
                $(".slide").stop().fadeTo(500, 1, function () { });


                $(".flexslider .slides .slide").removeClass("active");
                $currentSlide.addClass("active");

                $(".slideDescription .centeredContent").html($currentSlide.children(".dataDescription").html());
                if (!$(".slideDescription .centeredContent").html()) {
                    $(".slideDescription").addClass("visuallyhidden");
                }
                else {
                    $(".slideDescription").removeClass("visuallyhidden");
                }
            }
        });

        // Keep the slide arrows on the edge of the browser window

        $(".flex-direction-nav li .next").offset({ left: $("#container").outerWidth() - 43 });
        $(".flex-direction-nav li .prev").offset({ left: $("#container").offset().left });

        $(window).bind("resize", function () {

            $(".flex-direction-nav li a.next").offset({ left: $("#container").outerWidth() - 43 });
            $(".flex-direction-nav li a.prev").offset({ left: $("#container").offset().left });

        });

    }    





    /* New Masthead Template Stuff */
    /*
    $("#short-form").submit(function (e) {
        var form = $(this);
        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: form.serialize(), // data to be submitted
            success: function (response) {
                $(".short-form").html("<p>Form submitted. Thank you.</p>");
            }
        });
        return false;
    });
    */

    // Placeholder text
    if (!Modernizr.input.placeholder) { ph(); }

    function ph() {
        $("input[placeholder]:not(.ph)").each(function () {
            var place = $(this).attr('placeholder');

            $(this).attr('value', place);

            $(this).bind('focus', function () {
                if ($.trim($(this).attr('value')) == place) {
                    $(this).attr('value', "");
                }
            });
            $(this).bind('blur', function () {
                if ($.trim($(this).attr('value')) == '') {
                    $(this).attr('value', place);
                }
            });

            $(this).addClass('ph');
        })
        $("textarea[placeholder]:not(.ph)").each(function () {
            var place = $(this).attr('placeholder');

            $(this).val(place);

            $(this).bind('focus', function () {
                if ($.trim($(this).val()) == place) {
                    $(this).val("");
                }
            });
            $(this).bind('blur', function () {
                if ($.trim($(this).val()) == '') {
                    $(this).val(place);
                }
            });

            $(this).addClass('ph');
        })
    }

    $('#big-sponsor ul').jcarousel({
        buttonNextHTML: "<div>&raquo;</div>",
        buttonPrevHTML: "<div>&laquo;</div>",
        auto: 5,
        wrap: "circular",
        scroll: 1
    });

    $('#big-sponsor ul').touchwipe({
      wipeLeft: function() {
        $('#big-sponsor ul').jcarousel('next');
      },
      wipeRight: function() {
        $('#big-sponsor ul').jcarousel('prev');
      },
      min_move_x: 20,
      min_move_y: 20,
      preventDefaultEvents: false
    });

    $('#small-sponsor ul').jcarousel({
        buttonNextHTML: "<div>&raquo;</div>",
        buttonPrevHTML: "<div>&laquo;</div>",
        auto: 5,
        wrap: "circular",
        scroll: 1
    });
    
    $('#small-sponsor ul').touchwipe({
      wipeLeft: function() {
        $('#small-sponsor ul').jcarousel('next');
      },
      wipeRight: function() {
        $('#small-sponsor ul').jcarousel('prev');
      },
      min_move_x: 20,
      min_move_y: 20,
      preventDefaultEvents: false
    });

    
    // Flickr
    (function ($) {

        var $flickr = $('.flickr-gallery'),
            $flul = $flickr.find('ul');

        if ($flickr.length > 0) {

            var feed = "http://www.chapman.edu/getFeed.ashx?name=" + $flickr.attr('data-feed'),
                yqlFeed = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'" + feed + "'&format=json&diagnostics=true&callback=?";

            $.getJSON(yqlFeed, function (data) {

                var items = data.query.results.feed.entry;

                if (items.length > 0) {

                    for (var i = 0; i < 4; i += 1) {
                        var $item = $("<li>").append(
                            $("<a>").attr({
                                "href": items[i].link[0].href,
                                "title": items[i].title,
                                "target": "_blank"
                            }).append(
                                $("<img>").attr({
                                    'src': items[i].link[items[i].link.length - 1].href,
                                    'alt': items[i].title
                                })
                            )
                        ).appendTo($flul);

                        if ($item.find('img').width() >= 77) {
                            $item.find('img').css({
                                'width': '100%'
                            })
                        } else {
                            $item.find('img').css({
                                'height': '100%'
                            })
                        }
                    }
                    var apiLink = data.query.results.feed.link[0].href,
                        userId = apiLink.split('userid=')[1].split('&')[0];
                    $flickr.find(".more-link").attr("href", 'http://www.flickr.com/groups/' + userId);
                }
            });

        }

    })(jQuery);

    // Picasa
    (function ($) {

        $picasa = $('.picasa-gallery');
        $pcul = $picasa.find('ul');

        if ($picasa.length > 0) {

            var feed = "http://www.chapman.edu/getFeed.ashx?name=" + $picasa.attr('data-feed'),
            yqlFeed = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'" + feed + "'&format=json&diagnostics=true&callback=?";

            $.getJSON(yqlFeed, function (data) {

                var items = data.query.results.feed.entry;

                if (items.length > 0) {

                    for (var i = 0; i < 4; i += 1) {
                        var $item = $("<li>").append(
                            $("<a>").attr({
                                "href": items[i].link[1].href,
                                "title": items[i].title.content,
                                "target": "_blank"
                            }).append(
                                $("<img>").attr({
                                    'src': items[i].content.src
                                })
                            )
                        ).appendTo($pcul);

                        if ($item.find('img').width() >= 77) {
                            $item.find('img').css({
                                'width': '100%'
                            })
                        } else {
                            $item.find('img').css({
                                'height': '100%'
                            })
                        }
                    }

                    //$picasa.find(".more-link").attr("href", data.query.results.feed.author.uri);
                    $picasa.find(".more-link").attr("href", data.query.results.feed.id);
                }
            });
        }

    })(jQuery);


    //Remove slide caption in ie because of z-index issue
    if ($.browser.msie) {
        //$(".slideDescription").hide();
    }

    // Sync height of name bar buttons (only on desktop)
    $(window).resize(function () {
        sizeNameLinks();
    });
    $(function () {
        sizeNameLinks();
    })

    function sizeNameLinks() {

        nameLinks = $('.nameBarButtons li a');
        hasLong = false;

        nameLinks.each(function (index) {
            if ($(this).hasClass('long')) {
                hasLong = true;
            }
        });

        if (hasLong) {
            nameLinks.addClass('long');
        }

        if (nameLinks.length) {

            var nLheight = 0,
                tmp = 0;
            nameLinks.each(function (index) {

                if (!$(this).hasClass('stuck')) {
                    tmp = 0;
                    // console.log($(this), $(this).height());
                    tmp = $(this).height() // + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom'));
                    // console.log(tmp);
                    if (tmp > nLheight) {
                        nLheight = tmp;
                    }
                } else {

                    nLheight = $(this).css('height');
                }
            });

            nameLinks.addClass('stuck').css('height', nLheight);


        }

    }

    if ($(".scrollGallery").length) {
        $(".nameBar .slideDescription").remove();
    }

    // Remove :focus outline from rotator nav arrows
    $(".flex-direction-nav li a").each(function () {
        $(this).attr("hideFocus", "true").css("outline", "none");
    });

    // Pause the slider once the user interacts with the slider
    $(".flex-direction-nav li a").live("click", function (event) {
        g_mySlider.pause();
        g_mySlider.resume = function () {};
    });


    /* Mosaic border fix if only one slide
    ------------------------------------------------------------------------------------------------*/
    if ($(".mosaic .slide").length < 2) {
        $(".mosaic .block1 .border").css("border-width", "5px 5px 5px 5px");
        $(".mosaic .block2 .border").css("border-width", "0 5px 5px 5px");
    }

    /* Custom Scroll Bar
    ------------------------------------------------------------------------------------------------*/
    $('.scrollGallery').each(

    function () {
        $(this).jScrollPane({

            showArrows: $(this).is('.arrow'),
            horizontalDragMinWidth: 65,
            horizontalDragMaxWidth: 65


        });
        var api = $(this).data('jsp');
        var throttleTimeout;
        $(window).bind('resize',


        function () {
            if ($.browser.msie) {
                // IE fires multiple resize events while you are dragging the browser window which
                // causes it to crash if you try to update the scrollpane on every one. So we need
                // to throttle it to fire a maximum of once every 50 milliseconds...
                if (!throttleTimeout) {
                    throttleTimeout = setTimeout(

                    function () {
                        api.reinitialise();
                        throttleTimeout = null;
                    },


                    50);
                }
            } else {
                api.reinitialise();
            }




        });
    });

    /* Mini-Rotator Code
    ------------------------------------------------------------------------------------------------*/
    if ($(".miniRotator").length) {

        $(".miniRotatorContainer").jcarousel({
            start: (function () {
                var number = $(".slideOptions .startingSlideNumber").text();
                //mst added to default to slide 1, otherwise when blank, in old/new mini rotators pushing slide1 to position 2:
    			if (number == "") {
					number = 1;
				}
                return (number * 1);

            })(),
            auto: (function () {
                var speed = 10,
                    speedSetting = $(".slideOptions .speed").text(),
                    isAuto = $(".slideOptions .autoRotate").text() ? true : false;

                if (isAuto) {
                    if (speedSetting > 0) {
                        speed = speedSetting;
                    }
                }
                else {
                    speed = 0;
                }

                return speed;

            })(),
            scroll: 1,
            wrap: "circular",
            buttonNextHTML: null,
            buttonPrevHTML: null,
            initCallback: function (carousel) {
                carousel.clip.hover(function () {
                    carousel.stopAuto();
                }, function () {
                    carousel.startAuto();
                });

                $('.miniRotatorNav .next').bind('click', function () {
                    carousel.next();
                    return false;
                });

                $('.miniRotatorNav .prev').bind('click', function () {
                    carousel.prev();
                    return false;
                });
            }
        });
    }


    /* Funnel Toggle More Links
    ------------------------------------------------------------------------------------------------*/
    $(".funnel .funnelBlock .moreLinks, .funnel .funnelBlock .more").toggle();
    $(".funnel .funnelBlock .more").click(function () {
        $(this).prev(".moreLinks").slideToggle();
        if ($(this).html() === "+ More") {
            $(this).html("- Less");


        } else {
            $(this).html("+ More");
        }
    });

    /* social icon hover styles */
    $('#social_follow_us li').hover(function () {

        $(this).find('span.inactive_state').stop().animate({
            opacity: 0
        }, 75);
    }, function () {

        $(this).find('span.inactive_state').stop().animate({
            opacity: 1
        }, 75);
    });
    /* end social icon hover styles */

    /* Popluate featured item from xml generated from Cacade 
    ------------------------------------------------------------------------------------------------*/
    $.ajax({
        url: $(".featureFeed").text(),
        success: function (xml) {
            var image = $(xml).find("xml>system-data-structure>image>path").text(),
                date = $(xml).find("xml>system-data-structure>date").text(),
                month = date.split('-')[0],
                day = date.split('-')[1],
                year = date.split('-')[2],
                title = $(xml).find("xml>system-data-structure>title").text(),
                description = $(xml).find("xml>system-data-structure>description").text(),
                link = $(xml).find("xml>system-data-structure>link>link").text(),
                fileLink = $(xml).find("xml>system-data-structure>link>fileLink>path").text(),
                internalLink = $(xml).find("xml>system-data-structure>link>internalLink>path").text();

            if (internalLink !== '/') {
                link = internalLink+".aspx";
            }
            else if (fileLink !== '/') {
                link = fileLink;
            }

            // Image
            $(".newsEvents .featured .image").attr("src", image);
            $(".newsEvents .featured .image").attr("alt", title);

            // Date
            $(".newsEventsContent .featured .date .day").html(day);
            $(".newsEventsContent .featured .date .month").html(toShortMonthName(month));
            $(".newsEventsContent .featured .date .year").html(year);

            // Title
            $(".newsEventsContent .featured .title").html('<a href="' + link + '">' + title + '</a>');

            // Description
            $(".newsEventsContent .featured .description").html(description);

            // Read More Link
            if (link != '') {
                $(".newsEventsContent .featured .readMore").html('<a href="' + link + '">Read More<span class="bullet"> &raquo;</span></a>');
            }
        },
        dataType: 'xml'
    });


    /* Populate news from Wordpress RSS feed (converted to JSON with YQL)
    ------------------------------------------------------------------------------------------------*/
    if ($(".news").length) {

        var newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsHappenings",

            newsYqlUrl = function () {
                return ("//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss(3)%20where%20url%3D'" + newsFeedUrl + "'&format=json&diagnostics=true&callback=?")
            },
            newsFeedOptions = $(".newsFeed").text();

        switch (newsFeedOptions) {
            case "Admissions":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsAdmissions";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/cu-students");
                break;
            case "ASBE":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsBusiness";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/business");
                break;
            case "CES":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsCES";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/ces");
                break;
            case "Commencement":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsCommencement";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/commencement");
                break;
            case "COPA":

                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsCOPA";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/copa");
                break;
            case "Crean":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsCrean";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/crean");
                break;
            case "Dodge":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsDodge";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/dodge");
                break;
            case "Happenings":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsHappenings";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/happenings");
                break;
            case "Information Systems":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsIST";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/information-systems");
                break;
            case "Law":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsLaw";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/law");
                break;
            case "Pharmacy":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsPharmacy";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/pharmacy");
                break;
            case "Schmid":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsSCHMID";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/scst");
                break;
            case "Students":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsStudents";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/happenings");
                break;
            case "Thompson Policy Institute":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsThompsonInstitute";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/tpi/");
                break;
            case "Wilkinson":
                newsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=newsWilkinson";
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/wilkinson");
                break;
            default:
                $(".allNews")
                    .attr("href", "http://blogs.chapman.edu/happenings");
                break;
        }

        $(".news .loading").siblings(".story").css("visibility", "hidden");
        $.getJSON(newsYqlUrl(), function (data) {
            var newsData = data.query.results;

            if (newsData) {
                $(".newsEvents").each(function () {
                    $(this).find(".news .story").each(function (i) {
                        var $this = $(this);

                        if(newsData.item[i].pubDate){
                        //Month
                        $this.find(".date .month").html(newsData.item[i].pubDate.split(' ')[2].toUpperCase());
                        //Day
                        $this.find(".date .day").html(pad2(parseInt((newsData.item[i].pubDate.split(' ')[1]), 10)));
                        //Year
                        $this.find(".date .year").html(newsData.item[i].pubDate.split(' ')[3]);
                        }
                        //Title
                        $this.find("h3>a").html(newsData.item[i].title);
                        //Links

                        $this.find("h3>a, .readMore").each(function () {
                            $(this).attr('href', newsData.item[i].link);
                        });
                        //Copy
                        //$this.find(".copy").html($(newsData.item[i].description).text().substring(0, 175)).ellipsis();
                        //Show today/tomorrow label if appropriate
                        //todayLabel();                        


                        //Show News
                        $(".news .loading").hide().siblings(".story").css("visibility", "visible");
                    });
                });


            } else {
                $(".news").html("<p>Oops, <a href='" + newsFeedUrl + "'>" + newsFeedUrl + "</a> appears to be unresponsive or is not returning anything to display at the moment.</p>");
            }

        });
    }

    /* 
     Populate events from RSS feeds (converted to JSON with YQL)
    ------------------------------------------------------------------------------------------------ */
    if ($(".events")
        .length) {
        //var eventsFeedUrl = "https://25livepub.collegenet.com/calendars/calendar.7285.rss",


        var eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=events",
            eventsYqlUrl = function () {
                return ("//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss(3)%20where%20url%3D'" + eventsFeedUrl + "'&format=json&diagnostics=true&callback=?")
            },
            eventsFeedOptions = $(".eventsFeed")
                .text();
        $(".allEvents")
            .attr("href", "https://events.chapman.edu/");

        switch (eventsFeedOptions) {
            case "ASBE":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventBusiness";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=11,73,29,92,31,163,10");
                break;
            case "CES":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventCES";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=61,20");
                break;
            case "COPA":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventCOPA";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=21,56,105,75,89");
                break;
            case "CREAN":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventCREAN";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=44,108,103,155,152,27,37,114,38");
                break;
            case "DANCE":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventDANCE";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=105");
                break;
            case "DODGE":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventDODGE";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=23");
                break;
            case "Information Systems":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventIST";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=133");
                break;
            case "LAW":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventLAW";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=28");
                break;
            case "MUSIC":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventMUSIC";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=56,89");
                break;
            case "PHARMACY":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventPHARMACY";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=141");
                break;
            case "SCHMID":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventSCHMID";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=36,101,120,22,123,129,112");
                break;
            case "STUDENTS":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventSTUDENTS";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=53,135,58,70,137,49,99,88,131,14,144,50,126,64,74,71,102,142,41,153,116,15,94,164,19,26,34,30,114,38,117");
                break;
            case "THEATRE":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventTHEATRE";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=75");
                break;
            case "Thompson Policy Institute":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventTHOMPSONPOLICY";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=191");
                break;
            case "WILKINSON":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventWILKINSON";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=84,115,60,86,146,87,134,115,128,160,110,82,132,45,43,40");
                break;
            case "ESI":
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=eventESI";
                $(".allEvents")
                    .attr("href", "https://events.chapman.edu/?group_id=83");
                break;
            default:
                eventsFeedUrl = "http://www.chapman.edu/getFeed.ashx?name=events";
                break;
        }

        $(".events .loading").siblings(".story").css("visibility", "hidden");
        $.getJSON(eventsYqlUrl(), function (data) {

            var eventsData = data.query.results;
            if (eventsData) {
                $(".newsEvents").each(function () {
                    $(this).find(".events .story").each(function (i) {
                        var $this = $(this);


                        var rssitem;
                        var maxloop;
                        if (typeof eventsData.item.length == 'undefined') {
                            rssitem = eventsData.item;
                            maxloop = 0;


                        } else {
                            rssitem = eventsData.item[i];
                            maxloop = eventsData.item.length;
                        }

                        if(rssitem){

                            //pubdate sometimes contained original but not current event date; use category field instead (has yyyy/mm/dd format):
                            //Month
                            //$this.find(".date .month").html(rssitem.pubDate.split(' ')[1].toUpperCase());
                            $this.find(".date .month").html(toShortMonthName_fromstring(rssitem.category.split('/')[1].toUpperCase()));
                            //Day
                            //$this.find(".date .day").html(pad2(parseInt((rssitem.pubDate.split(' ')[0]), 10)));
                            $this.find(".date .day").html(pad2(parseInt((rssitem.category.split('/')[2]), 10)));
                            //Year
                            //$this.find(".date .year").html(rssitem.pubDate.split(' ')[2]);
                            $this.find(".date .year").html(rssitem.category.split('/')[0]);
                            //Title
                            $this.find("h3>a").html(rssitem.title);
                            //Links

                            $this.find("h3>a, .readMore").each(function () {
                                $(this).attr('href', rssitem.link);
                            });
                        }
                        else{
                            $(this).hide();
                        }

                        //Copy
                        //$this.find(".copy").html(rssitem.description.substring(0, 175)).ellipsis();
                        //Show today/tomorrow label if appropritae
                        //todayLabel();
                        //Set href of all events link
                        //move this into cases above and manually set for each school: $(".allEvents").attr("href", eventsFeedUrl.slice(0, -4));
                        //Show Events
                        $(".events .loading").hide().siblings(".story").css("visibility", "visible");

                        if (maxloop == i) {
                            return false;
                        }
                    });
                });


            } else {
                $(".events").html("<p>There are no events found (or <a href='" + eventsFeedUrl + "'>" + eventsFeedUrl + "</a> is temporarily down).</p>");
                //$(".events").html("<p>No events found at this time.</p>");
            }

        });
    }

    /* Populate events from Chapman events json feed 
    Comment this section out and comment in the section above when 25 live is ready
    ------------------------------------------------------------------------------------------------*/
    /* if ($(".events").length) {
        var eventsFeedUrl = "http://web.chapman.edu/eventscalendar/jsonp.ashx?method=?";
        eventsFeedOptions = $(".eventsFeed").text();

        switch (eventsFeedOptions) {
            case "ASBE":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Argyros+School+of+Business+and+Economics%09Economic+Science+Institute%09Leatherby+Center+for+Entrepreneurship+and+Business+Ethics";
                break;
            case "CES":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=College+of+Educational+Studies";
                break;
            case "COPA":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=College+of+Performing+Arts%09Conservatory+of+Music%09Dance%2c+Department+of%09Theatre%2c+Department+of";
                break;
            case "DANCE":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Dance%2c+Department+of";
                break;
            case "DODGE":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Dodge+College+of+Film+and+Media+Arts";
                break;
            case "LAW":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Law%2c+School+of";
                break;
            case "MUSIC":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Conservatory+of+Music";
                break;
            case "SCHMID":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Computational+Sciences%2c+School+of%09Earth+%26+Environmental+Sciences%2c+School+of%09Food+Science+Program%09Health+%26+Life+Sciences%2c+School+of%09Physical+Therapy%2c+Dept+of%09Schmid+College+of+Science";
                break;
            //case "STUDENTS":
            //eventsFeedUrl = "";
            //break;  
            case "THEATRE":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Theatree%2c+Department+of";
                break;
            case "WILKINSON":
                eventsFeedUrl = "http://web.chapman.edu/eventscalendar/filterjsonp.ashx?method=?&sponsor=Communication+Studies%2c+Department+of%09Rodgers+Center+for+Holocaust+Education%09Wilkinson+College";
                break;
            default:
                break;
        }

        $(".events .loading").siblings(".story").css("visibility", "hidden");
        $.getJSON(eventsFeedUrl, function (data) {

            var eventsData = data;
            if (eventsData) {
                $(".newsEvents").each(function () {
                    $(this).find(".events .story").each(function (i) {
                        var $this = $(this);

                        //Month
                        $this.find(".date .month").html(toShortMonthName(eventsData.item[i].pubDate.split('/')[0]));
                        //Day
                        $this.find(".date .day").html(pad2(parseInt(eventsData.item[i].pubDate.split('/')[1], 10)));
                        //Year
                        $this.find(".date .year").html(eventsData.item[i].pubDate.split('/')[2].split(' ')[0]);
                        //Title
                        $this.find("h3>a").html(eventsData.item[i].title);
                        //Links
                        $this.find("h3>a, .readMore").each(function () { $(this).attr('href', eventsData.item[i].link); });
                        //Copy
                        $this.find(".copy").html(eventsData.item[i].description.substring(0, 175)).ellipsis();
                        //Show today/tomorrow label if appropritae
                        //todayLabel();
                        //Set href of all events link
                        $(".allEvents").attr("href", "http://web.chapman.edu/eventsCalendar/calendar.aspx");
                        //Show Events
                        $(".events .loading").hide().siblings(".story").css("visibility", "visible");
                    });
                });
            }
            else {
                $(".events").html("<p>Oops, <a href='" + eventsFeedUrl + "'>" + eventsFeedUrl + "</a> appears to be unresponsive or is not returning anything to display at the moment.</p>");
            }

        });
    } */



    /* Switch news events tabs
    ------------------------------------------------------------------------------------------------*/

    $(".newsEventsNav li").click(function () {
        var $this = $(this),
            i = $this.index();
        $this.addClass("active").siblings().removeClass("active");
        $this.parent(".newsEventsNav").siblings(".newsEventsContent").children("li:eq(" + i + ")").addClass("active").siblings().removeClass("active");
        $(".ellipsis").ellipsis();
    });

    $(".tabNav li").click(function () {
        var $this = $(this),
            i = $this.index();
        $this.addClass("active").siblings().removeClass("active");
        $this.parent(".tabNav").siblings(".tabContent").children("li:eq(" + i + ")").addClass("active").siblings().removeClass("active");
        $(".ellipsis").ellipsis();
    });

    // Apply user selected options
    (function () {
        var newsEventsOptions = [$(".newsEventsOptions").html(), $(".leftColumnNewsEventsOptions").html()],
            $featureTab = [$(".main .newsEventsNav li:first-child"), $(".leftNav .newsEventsNav li:first-child")],
            $newsTab = [$(".main .newsEventsNav li:nth-child(2)"), $(".leftNav .newsEventsNav li:nth-child(2)")],
            $eventsTab = [$(".main .newsEventsNav li:nth-child(3)"), $(".leftNav .newsEventsNav li:nth-child(3)")],
            $featureContent = [$(".main .featured"), $(".leftNav .featured")],
            $newsContent = [$(".main .news"), $(".leftNav .news")],
            $eventsContent = [$(".main .events"), $(".leftNav .events")],
            $newsEvents = [$(".main .newsEvents"), $(".leftNav .newsEvents")];

        for (var i = 0; i < newsEventsOptions.length; i++) {
            switch (newsEventsOptions[i]) {
                case "Featured - News - Events (Featured active)":
                    break;
                case "Featured - News - Events (News active)":
                    $featureTab[i].removeClass("active");
                    $newsTab[i].addClass("active");
                    $newsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "Featured - News - Events (Events active)":
                    $featureTab[i].removeClass("active");
                    $eventsTab[i].addClass("active");
                    $eventsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "Featured - News (Featured active)":
                    $eventsTab[i].hide();
                    break;
                case "Featured - News (News active)":
                    $featureTab[i].removeClass("active");
                    $newsTab[i].addClass("active");
                    $eventsTab[i].hide();
                    $newsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "Featured - Events (Featured active)":
                    $newsTab[i].hide();
                    break;
                case "Featured - Events (Events active)":
                    $featureTab[i].removeClass("active");
                    $eventsTab[i].addClass("active");
                    $newsTab[i].hide();
                    $eventsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "News - Events (News active)":
                    $featureTab[i].hide();
                    $newsTab[i].addClass("active");
                    $newsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "News - Events (Events active)":
                    $featureTab[i].hide();
                    $eventsTab[i].addClass("active");
                    $eventsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "Featured Only":
                    $newsTab[i].hide();
                    $eventsTab[i].hide();
                    break;
                case "News Only":
                    $featureTab[i].hide();
                    $eventsTab[i].hide();
                    $newsTab[i].addClass("active");
                    $newsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "Events Only":
                    $featureTab[i].hide();
                    $newsTab[i].hide();
                    $eventsTab[i].addClass("active");
                    $eventsContent[i].parent("li").addClass("active");
                    $featureContent[i].parent("li").removeClass("active");
                    break;
                case "Do Not Show":
                    $newsEvents[i].hide();
                    break;
                default:
                    break;
            }
        }
    })();

    // Show today label if appropriate
    var todayLabel = function () {
        var today = new Date(),
            tomorrow = new Date(),
            month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "DEC"];

        tomorrow.setDate(tomorrow.getDate() + 1);

        // Today
        $(".newsEvents .date").each(function (index) {
            if (today.getFullYear() === parseInt($(this).children(".year").html(), 10)) {
                if (month[today.getMonth()].toUpperCase() === $(this).children(".month").html()) {
                    if (today.getDate() === parseInt($(this).children(".day").html(), 10)) {
                        $(this).siblings(".todayTomorrow").children(".today").css("visibility", "visible");
                    }
                }
            }
        });

        // Tomorrow
        $(".newsEvents .date").each(function (index) {
            if (tomorrow.getFullYear() === parseInt($(this).children(".year").html(), 10)) {
                if (month[tomorrow.getMonth()].toUpperCase() === $(this).children(".month").html()) {
                    if (tomorrow.getDate() === parseInt($(this).children(".day").html(), 10)) {
                        $(this).siblings(".todayTomorrow").children(".tomorrow").css("visibility", "visible");
                    }
                }
            }
        });
    };
    // todayLabel();



    /* Degrees Program Nav Conditional Styling
    ------------------------------------------------------------------------------------------------*/
    $(".anchorLinks a").each(function (index) {
        if ($('.letter[name=' + $(this).text() + ']').length) {
            $(this).css("text-decoration", "underline");
        }
    });

    /* Faculty List Old IE styling 
    ------------------------------------------------------------------------------------------------*/
    if ($(".facultyList .facultyMember").length && $("html").hasClass("oldie")) {
        $(".facultyList .facultyMember:nth-child(odd)").css("margin-right", "45px");
        $(".facultyList .facultyMember:nth-child(even)").css("margin-right", "0");
    }


    /* Faculty Video Fancybox
    ------------------------------------------------------------------------------------------------*/
    if ($(".facultySpotlight>.video[href]").length) {
        if ($("html").outerWidth() >= 780) {
            $(".facultySpotlight>.video").fancybox({
                type: 'iframe'
            });

            $(window).resize(function () {
                if ($("html").outerWidth() < 780) {
                    $.fancybox.close();
                    $(".facultySpotlight>.video").unbind();


                } else {
                    $(".facultySpotlight>.video").fancybox({
                        type: 'iframe'
                    });
                }
            });
        }

    } else {
        $(".facultySpotlight>.video").click(function (event) {
            event.preventDefault();
        });
    }

    /* Ellipsis
    ------------------------------------------------------------------------------------------------*/
    $(".events .copy").each(function (index) {
        $(this).html($(this).text());
    });

    $(".ellipsis").ellipsis();

    // Need to add this after the ellipsis takes effect
    $(".newsEventsContent>li, .tabContent>li").css("display", "none");

    /* Left Nav 
    ------------------------------------------------------------------------------------------------*/

    $(".leftNav>ul>li:not(.active)>ul")
        .prev("a")
        .children(".plus")
        .css("visibility", "visible");


    $(".leftNav .plus").click(function (e) {
        e.preventDefault();
        $(this).toggleClass("open").parent("a").toggleClass("is-open").siblings("ul").slideToggle().toggleClass("is-open");
    });


    /* Name Bar
    ------------------------------------------------------------------------------------------------*/
    if ($(".nameBar").length) {
        $(".nameBar").removeClass("active");
        $(".toggleExpanded .button").click(function () {
            $(".expandedNameBar").slideToggle().parent(".nameBar").toggleClass("active");
        });


        verticallyAlignNamebarText = (function () {
            $(".nameBarButtons li a .text").each(function () {
                var maxCharacters = $(".oldie").length ? 28 : 29;
                if ($(this).text().length > maxCharacters) {
                    $(this).parent('a').addClass("long");
                }
            });
        })();

    }

    /* Left Nav + - 
    ------------------------------------------------------------------------------------------------*/
    $(".leftNav ul li .show, .leftNav ul li .hide").click(function () {
        $(this).parent("li").toggleClass("active");
    });


    /* Open external links in a new window
    ------------------------------------------------------------------------------------------------*/

    /* REMOVE THIS: 
   //$('a').each(function () {
        //var a = new RegExp('/' + window.location.host + '/');
       // if (!a.test(this.href)) {
            //$(this).attr("target", "_blank");
        //}
    //}); 
    */

    /*
    (function () {
        if (window.location.pathname.split('/')[1] !== "landing-pages") {
            $.getScript("/_files/level/js/welcome.js");
        }
        $('.mainNavExpand').bind('click', function() {
            $('.mainNav').toggleClass('open');
            if ($('.mainNav').hasClass('open')) {
                $('.mainNavExpand .arrow').html('&#8963;');
            } else {
                $('.mainNavExpand .arrow').html('&#8964;');
            }
        });
    })();
    */

    // Apply video class to iframes in editableContent regions (BCole altered to not apply to div with id=novideo) 
    //old:$(".editableContent iframe").wrap('<div class="video"/>');
    $(".editableContent iframe").not('#no-video').wrap('<div class="video"/>');
    //if youTube video on page convert link to https (pages viewed in https with video using http will cause video to not show)
    $('.editableContent iframe').each(function(){
        this.src = this.src.replace('http://www.youtube.com','https://www.youtube.com');
	});
    
    /* Tracking Code
    ------------------------------------------------------------------------------------------------*/

    $(".leftNav").on("click", ".newbutton a", function () {
        recordOutboundLink($(this)[0], "Outbound-link_" + document.title.replace(" | Chapman University", ''), $(this).attr("href"), $(this).text());     
    });
    
    /* added for links (really calls to action) in right col callouts: */
    $(".rightColumn").on("click", ".newbutton a", function () {
        recordOutboundLink($(this)[0], "Outbound-link_" + document.title.replace(" | Chapman University", ''), $(this).attr("href"), $(this).text());     
    });


});