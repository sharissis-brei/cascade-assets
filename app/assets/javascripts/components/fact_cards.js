var FactCard = function($el) {
  this.$root  = $el;
  this.$front = $el.find('.fact-front');
  this.$back  = $el.find('.fact-back');
};

FactCard.prototype.initialize = function() {
  if (!utils.ios()) { // iOS translates mouseleave to clicks, lame :(
    this.$front.on('mouseenter', this.flipToBack.bind(this));
    this.$back.on('mouseleave', this.flipToFront.bind(this));
  }
  this.$front.hammer().bind('tap', this.flipToBack.bind(this));
  this.$back .hammer().bind('tap', this.flipToFront.bind(this));
};

FactCard.prototype.flipToBack = function(event) {
  this.$root.addClass('flipped');
};

FactCard.prototype.flipToFront = function (event) {
  if (!$(event.target).hasClass('fact-link')) {
    this.$root.removeClass('flipped');
  }
};

$(document).ready(function() {
  $('.fact-card').each(function() { new FactCard($(this)).initialize(); });
});
