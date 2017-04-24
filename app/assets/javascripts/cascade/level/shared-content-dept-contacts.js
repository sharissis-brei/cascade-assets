$(function () {
	/* button in Left Column Callout area's Contact Widget. Used to hide/show additional contact info */
	$(".view-more-expander").click(function () {
		//Note toggleClass removes if class exists on element and adds if missing so can list both active and hidden and will toggle one on and other off:		
		$(this).siblings(".editableContent").toggleClass("active inactive").children(".more-content").slideToggle('slow');			
		$(this).children(".view-more").toggleClass("active inactive").children(".view-more").slideToggle('fast');
		$(this).children(".view-less").toggleClass("inactive active").children(".view-less").slideToggle('fast');
	});	
});	