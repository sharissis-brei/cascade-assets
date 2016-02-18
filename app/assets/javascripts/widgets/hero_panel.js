$(document).ready(function(){
  var nav = $('.program-select');
  var links = nav.children('input');
  var programSelector = nav.children('select');
  
  programSelector.on('change', function(){
  	var index = $(this).prop('selectedIndex');
    window.location.href = links.eq(index).val();
  });
});