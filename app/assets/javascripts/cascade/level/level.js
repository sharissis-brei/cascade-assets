$(function () {

	// Apply video class to iframes in editableContent regions (BCole altered to not apply to div with id=novideo) 
  //old:$(".editableContent iframe").wrap('<div class="video"/>');
  $(".editableContent iframe").not('#no-video').wrap('<div class="video"/>');

   //if youTube video on page convert link to https (pages viewed in https with video using http will cause video to not show)
    $('.editableContent iframe').each(function(){
        this.src = this.src.replace('http://www.youtube.com','https://www.youtube.com');
	});
	
  /* added for links (really calls to action) in right col callouts: */
  $(".rightColumn").on("click", ".newbutton a", function () {
    recordOutboundLink($(this)[0], "Outbound-link_" + document.title.replace(" | Chapman University", ''), $(this).attr("href"), $(this).text());     
  });

});