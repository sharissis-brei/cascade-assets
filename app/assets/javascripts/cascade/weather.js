$(function () {
  /* Populate weather from json feed; default on page is 65 until modified by this routine
  ------------------------------------------------------------------------------------------------*/
  //sample data: {"weather":{"icon_path":"\/images\/icons\/weather\/2cloud_norain.png","temp_f":"66","temp_c":"19"}}
  $.getJSON("https://forecast.chapman.edu/chapman/banner-json.php?callback=orange", function (data) {	
    var iconPath = data.weather.icon_path,
      tempF = data.weather.temp_f,
      tempC = data.weather.temp_c,
      url = "//www.chapman.edu",
      $weather = $(".weather");
    //find weather class in html and substitute placeholders with current temp
    $weather.find("img").attr("src", url + iconPath);
    $weather.find(".temp .f").html(tempF + "&deg; F");
    $weather.find(".temp .c").html(tempC + "&deg; C");
  });
});