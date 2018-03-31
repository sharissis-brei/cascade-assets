$(document).ready( function() {
  var emergencyAlertDiv = $('div.emergency-alert');
  var alertMessage = $('p.alert-message')[0];
  var raveFeed = 'https://content.getrave.com/rss/chapman/channel1';

  var displayEmergencyAlert = function() {
    emergencyAlertDiv.show();
    var trigger = $('.close-alert-trigger');
    addCloseTrigger(trigger);
  };

  var addCloseTrigger = function(trigger) {
    trigger.on('click', function() {
      emergencyAlertDiv.slideUp("slow");
    });
  };

  // Looks for key phrase in Rave feed to indicate no emergency
  var checkEmergencyFeed = function() {
    $.get(raveFeed, function (data) {
      $(data).find("item").each(function () {
        return $(this).find("title").text().includes("There is no emergency");
      });
    });
  };

  var getRaveFeedData = function() {
    $.get(raveFeed, function (data) {
      // There should really only be 1 item in the feed at any given time
      $(data).find("item").each(function () {
        var item = $(this);
        var raveFeedDescription = item.find("description").text();
        emergencyAlertDiv.find('p.alert-message').html(raveFeedDescription);
        var raveFeedTitle = item.find("title").text();
        emergencyAlertDiv.find('p.alert-title').html(raveFeedTitle);
      });
    });
  };

  // If there is already a message (comes from data def in Cascade),
  // don't override the HTML with Rave feed
  var isEmergency = checkEmergencyFeed();
  if (alertMessage.innerHTML != '') {
    displayEmergencyAlert();
  }
  else if(isEmergency) {
    displayEmergencyAlert();
    getRaveFeedData();
  }
});
