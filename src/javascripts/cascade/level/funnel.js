
$( document ).ready(function() {

	/* Funnel Toggle More Links
	 * 
	 * If the funnel boxes contain a list of links longer than 3 links, hide the rest and create a Show/Hide toggle
	------------------------------------------------------------------------------------------------*/
	$(".funnelBlock").each(function() {

		// CONFIGURABLE:
		var number_of_links_to_show = 3;

		// Find the link list
		var $list = $(this).find('.linkList');
		var $extraLinks = $list.find('li').slice(number_of_links_to_show);

		// Don't do anything if there aren't extra links
		if ($list.length == 0 || $extraLinks.length == 0) return;

		// Hide the extra links
		$extraLinks.hide();

		// Create the toggle button
		$toggleButton = $('<a href="javascript:void(0);" class="more">+ More</a>');
		$list.after($toggleButton);

		// Bind action to show/hide on toggle button click
		$toggleButton.on('click', function() {
			if ($(this).html() === "+ More") {
				$extraLinks.slideDown();
				$(this).html("- Less");
			} else {
				$extraLinks.slideUp();
				$(this).html("+ More");
			}
		});

	});

});