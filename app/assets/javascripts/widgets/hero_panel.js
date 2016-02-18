/*
* Cascade can't check managed links in select options, so this code gets the link from a hidden field when a program option is selected
* http://www.hannonhill.com/kb/Linking/ 
*/

$(document).ready(function(){
  var container = $('#program-select-links');
  var links     = container.children('input');
  var select    = container.children('select');
  
  select.on('change', function(){
  	var index = $(this).prop('selectedIndex');
    location.href = links.eq(index).attr('href');
  });
});