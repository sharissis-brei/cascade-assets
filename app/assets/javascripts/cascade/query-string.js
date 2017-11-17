$(function () {

    if ( $('html').find('#omni-nav-v2').length === 0 ) {
        /* evaluate query string to see if param to set an open collapsible or tab 
        ---------------------------------------------------------------------------*/
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

        /* Used with Collapsibles widget. 
        ----------------------------------*/
        if ((urlParams["openregion"] != undefined) && (urlParams["openregion"] == parseInt(urlParams["openregion"])) && urlParams["openregion"] - 1 < $(".collapsibles-widget .accordion").length) {

            // Offset for zero based arrays
            if (urlParams["openregion"] != 0) 
                urlParams["openregion"] = urlParams["openregion"] - 1;
            
            var $activeElementRegion = $(".collapsibles-widget .accordion").eq(urlParams["openregion"]);

            // Add the active class to nth accordion and remove all other active classes
            $activeElementRegion.addClass("active").siblings().removeClass("active");

            // Display the current region
            $activeElementRegion.find("div.collapsibles-widget").show();

            // Hide the other regions
            $activeElementRegion.siblings().find("div.content").hide();
            
            // Scroll to the active element (offset by 50 because behind omni-nav)
            setTimeout(function(){
               $('html, body').stop().animate({
                    scrollTop:$activeElementRegion.offset().top -50 
                },1000) ;
            },250);
        }
        /* End open collapsible */
        
        /* Used with Tabs widget.
        -------------------------*/ 
        if ((urlParams["startingtab"] != undefined) && (urlParams["startingtab"] == parseInt(urlParams["startingtab"])) && (urlParams["startingtab"] - 1 < $(".main .tabs-nav li").length)) {
            // Offset for zero based arrays
            if (urlParams["startingtab"] != 0)
                urlParams["startingtab"] = urlParams["startingtab"] - 1;
            
            var $activeElementTab = $(".main .tabs-nav li").eq(urlParams["startingtab"]);

            // Set active class
            $activeElementTab.addClass("active").siblings().removeClass("active");
            // Update the content section - set active content to display
            //$activeElementTab.siblings().find("div.content").hide();
            $activeElementTab.parent().siblings().children("li:eq(" + urlParams["startingtab"] + ")").addClass("active").siblings().removeClass("active");

            // Scroll to the active element (offset by 50 because behind omni-nav)
            setTimeout(function(){
                $('html, body').stop().animate({
                    scrollTop:$activeElementTab.offset().top -50
                },1000) ;
            },250);
        }
        /* end open tab */
    }

});