$(document).ready(function(){
  var trigger = $('.hero-select-button');
  var list    = $('.hero-select-list');
  var highlighted;

  var highlight = function(i) {
    highlighted = $(i);
    highlighted.addClass('selected').siblings('.selected').removeClass('selected');
  };

  trigger.on('click', function() {
    trigger.toggleClass('active');
    list.slideToggle(200);
  });

  $('.hero-select-list li').on('hover', function() {
    highlight(this);
  });

  $(document).on('click', function(event) {
    if(trigger[0] !== event.target && !list.has(event.target).length) {
      list.slideUp(200);
    }
  });

  $(window).keydown(function(event) {
    switch(event.keyCode) {
      case 38:
        highlight((highlighted && highlighted.prev().length > 0) ? highlighted.prev() : list.children().last());
        list.scrollTo('.selected');
        break;
      case 40:
        highlight((highlighted && highlighted.next().length > 0) ? highlighted.next() : list.children().first());
        list.scrollTo('.selected');
        break;
    }
  });
});