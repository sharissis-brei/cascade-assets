var omni_nav_v2 = {

  initialize: function() {
    this.$container = $('#omni-nav-v2');
    this.$utility_nav = this.$container.find('.utility-nav');
    this.$primary_nav = this.$container.find('#primary-nav');


    $('.utility-nav-trigger').on('click', omni_nav_v2.onUtilityNavClick);
    this.$utility_nav.find('li.utility-has-dropdown').on('click', omni_nav_v2.onUtilityNavDropdownClick);

  },

  onUtilityNavClick : function() {
    if($(window).width() >= 768 ){
      omni_nav_v2.$utility_nav.toggleClass('utility-nav-open');
      $('html.omni-nav-v2').toggleClass('utility-nav-open');
    } else {
      omni_nav_v2.$primary_nav.toggleClass('search-open');
    }
  },

  onUtilityNavDropdownClick : function(e) {
    e.stopPropagation();
    $(this).siblings('.utility-has-dropdown').removeClass('dropdown-open');
    $(this).toggleClass('dropdown-open');
    $(document).on("click", omni_nav_v2.onDocumentClick);
  },

  onDocumentClick : function(e){
    $('li.utility-has-dropdown').removeClass('dropdown-open');
    $(document).off("click", omni_nav_v2.onDocumentClick);
  }

}

var off_canvas_nav_v2 = {
  initialize: function() {
    off_canvas_nav_v2.syncLinkWidths();

    $('#js-off-canvas-trigger, #js-close-off-canvas-nav, #js-off-canvas-overlay').on('click', function(event) {
      event.preventDefault();
      $('#js-off-canvas-nav-container').toggleClass('open');
      $('#js-off-canvas-overlay').toggleClass('active');
      $('body').toggleClass('no-scroll');
    });

    $('#js-off-canvas-nav-container .toggle').on('click', function() {
      $(this).parent().toggleClass('open'); // Targets li
      $(this).parent().find('ul').slideToggle();
    });

    $(window).on('resize', function() {
      off_canvas_nav_v2.syncLinkWidths();
    });
  },

  syncLinkWidths: function() {
    var width = $('#js-off-canvas-nav > ul').width();
    $('#js-off-canvas-nav > ul > li > a').css('width', width);
  }
}

$(document).ready(function () {
  omni_nav_v2.initialize();
  off_canvas_nav_v2.initialize();
});
