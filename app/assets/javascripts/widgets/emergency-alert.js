$(document).ready( function() {
  var trigger = $('.close-alert-trigger');
  var emergencyAlertDiv = $('div.emergency-alert');

  trigger.on('click', function() {
    emergencyAlertDiv.slideUp("slow");
  });

  $.get('https://content.getrave.com/rss/chapman/channel1', function (data) {
    $(data).find("item").each(function () {
      var item = $(this);
      var description = item.find("description").text();
      emergencyAlertDiv.find("p.alert-message").html(description);
    });
  });
});
