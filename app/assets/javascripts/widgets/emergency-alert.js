var EmergencyAlert = (function() {
  // Module Vars
  var emergencyAlertDiv,
      alertMessage,
      raveFeed,
      noEmergencyMessage;

  // Module Functions
  var initialize = function() {
    emergencyAlertDiv = $('div.emergency-alert');
    alertMessage = $('div.alert-message')[0];
    raveFeed = 'https://content.getrave.com/rss/chapman/channel1';
    noEmergencyMessage = "There is no emergency"; // current Rave message for no emergency
    var isEmergency = checkEmergencyFeed();

    // If there is already a message (comes from data def in Cascade),
    // don't override the HTML with Rave feed
    if (alertMessage.innerHTML != '') {
      displayEmergencyAlert();
    }
    else if(isEmergency) {
      displayEmergencyAlert();
      getRaveFeedData();
    }
  };

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
        return $(this).find("title").text().includes(noEmergencyMessage);
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

  return {
    init: initialize
  };
})();

$(document).ready(function() {
  EmergencyAlert.init();
});
