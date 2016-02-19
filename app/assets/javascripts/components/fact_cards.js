var FactCard = function($el) {
  this.$root  = $el;
  this.$front = $el.find('.fact-front');
  this.$back  = $el.find('.fact-back');
};

FactCard.prototype.initialize = function() {
  var self = this;

  // Hover Listeners
  if (!utils.ios()) { // iOS translates mouseleave to clicks, lame :(
    this.$root.on('mouseenter', function(e) { $(this).addClass('flipped'); });
    this.$root.on('mouseleave', function(e) { $(this).removeClass('flipped'); });
  }

  // Tap listeners
  this.$front.hammer().bind('tap', function(e) { 
    self.$root.addClass('flipped'); 
  });

  this.$back.hammer().bind('tap', function(e) {
    if (!$(event.target).closest('a').length) // Ensure that a link wasn't tapped
      self.$root.removeClass('flipped');
  });
};

$(document).ready(function() {
  $('.fact-card').each(function() { new FactCard($(this)).initialize(); });
});
