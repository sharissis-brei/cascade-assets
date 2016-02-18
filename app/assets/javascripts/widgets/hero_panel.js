/*
* Cascade can't check managed links in select options, so this code gets the link from a hidden field when a program option is selected
* http://www.hannonhill.com/kb/Linking/ 
*/

$(document).ready(function(){
  var programNav = $('#program-select-links');
  var links = programNav.children('input');
  var programSelector = programNav.children('select');
  
  programSelector.on('change', function(){
  	var index = $(this).prop('selectedIndex');
    window.location.href = links.eq(index).val();
  });
});