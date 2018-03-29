$(document).ready( function() {
  var trigger = $('.close-alert-trigger');
  var emergencyAlertDiv = $('div.emergency-alert');

  trigger.on('click', function() {
    emergencyAlertDiv.slideUp("slow");
  });
});
