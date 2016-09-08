$(document).ready(function(){
	var slider = $("#sponsor-bar .carousel-container"),
		  listItems = slider.find('.sponsor-list').children(),
			numItems = listItems.length,
			itemWidth = numItems > 0 ? 134 : 0,
			itemLimit = 6,
			slideControls = $();

	slider.jcarousel({
		buttonNextHTML: "<div class='control next'><a class='jcarousel-next'>&rsaquo;</a></div>",
		buttonPrevHTML: "<div class='control prev'><a class='jcarousel-prev'>&lsaquo;</a></div>",
		scroll: 1,
		wrap: "both",
		visible: getVisibleItems(),
		itemFallbackDimension: 95,
		initCallback: function (carousel) {
			slideControls = slider.find('.control');
			carousel.options.visible == numItems? slideControls.hide() : slideControls.show();
		},
		reloadCallback: (function(carousel){
			carousel.options.visible = getVisibleItems();
			carousel.options.visible == numItems? slideControls.hide() : slideControls.show();
		})
	});

	function getVisibleItems() {
		var maxItems = Math.floor(((slider.width() - 100) / itemWidth)); //subtracting width of control buttons

		if(maxItems < 1) maxItems = 1;
		if(maxItems > numItems) maxItems = numItems;
		if(maxItems > itemLimit) maxItems = itemLimit;

		return maxItems;
	}
});