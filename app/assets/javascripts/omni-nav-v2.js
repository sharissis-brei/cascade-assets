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
    }else {
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

$(document).ready(function () {
  omni_nav_v2.initialize();
});