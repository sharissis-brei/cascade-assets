var EmergencyAlert = (function() {
  // Module Vars
  var emergencyAlertDiv,
      alertMessage,
      raveFeed,
      noEmergencyMessage,
      isEmergency = false;

  // Module Functions
  var initialize = function() {
    emergencyAlertDiv = $('div.emergency-alert');
    alertMessage = $('div.alert-message').text();
    // Imposter test feed: https://imposter.chapman.edu/rave.rss
    raveFeed = 'https://content.getrave.com/rss/chapman/channel2';
    noEmergencyMessage = "There is currently no emergency"; // current Rave message for no emergency

    // If there is already a message (comes from data def in Cascade),
    // don't override the HTML with Rave feed
    if (alertMessage.trim() != '') {
      displayEmergencyAlert();
    }
    else {
      $.ajax({
        url: raveFeed,
        type: 'GET',
        success: function(data) {
          $(data).find("item").each(function () {
            var title = $(this).find("title").text();
            // Looks for absence of the "no emergency" message
            isEmergency = title.indexOf(noEmergencyMessage) < 0;
          });

          if(isEmergency) {
            displayEmergencyAlert();
            fillRaveFeedData(data);
          }
        }
      });
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

  var fillRaveFeedData = function(data) {
    // There should really only be 1 item in the feed at any given time
    // See imposter.chapman.edu for sample feeds
    $(data).find("item").each(function () {
      var item = $(this);
      var raveFeedDescription = item.find("description").text();
      emergencyAlertDiv.find('div.alert-message').html(raveFeedDescription);
      var raveFeedTitle = item.find("title").text();
      emergencyAlertDiv.find('div.alert-title').html(raveFeedTitle);
    });
  };

  return {
    init: initialize
  };
})();

$(document).ready(function() {
  // Only load on homepage
  if($('.homepage').length) {
    EmergencyAlert.init();
  }
});
