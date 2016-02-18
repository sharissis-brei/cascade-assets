$(document).ready(function(){
  var programNav = $('.program-select');
  var links = programNav.children('input');
  var programSelector = programNav.children('#program-select-links');
  
  programSelector.on('change', function(){
  	var index = $(this).prop('selectedIndex');
    window.location.href = links.eq(index).val();
  });
});