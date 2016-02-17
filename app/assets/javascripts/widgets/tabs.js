var TabsWidget = {};

TabsWidget.onTabClicked = function() {
  var $widget      = $(this).closest('.tabs-widget');
  var $navItem     = $(this);
  var $contentItem = $widget.find('.tabs-content li:eq(' + $navItem.index() + ')');

  $navItem.addClass('active');
  $navItem.siblings().removeClass('active');
  
  $contentItem.addClass('active');
  $contentItem.siblings().removeClass('active');
};

$(document).on('click', '.tabs-widget .tabs-nav li', TabsWidget.onTabClicked);