$(function () {
	/* button in Left Column Callout area's Contact Widget. Used to hide/show additional contact info */
	$(".view-more-button").click(function () {
		//Note toggleClass removes if class exists on element and adds if missing so can list both and will toggle between show and hide:		
		$(this).siblings(".contact-widget").toggleClass("show-more").children(".more-content").slideToggle('slow');			
		$(this).children(".view-more").toggleClass("show-more hide-more").children(".view-more").slideToggle('fast');
		$(this).children(".view-less").toggleClass("hide-more show-more").children(".view-less").slideToggle('fast');
	});	
});	