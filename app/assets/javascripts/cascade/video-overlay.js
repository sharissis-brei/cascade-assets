$(function () {

	/* Video overlay
    ------------------------------------------------------------------------------------------------*/

    $(".videoLink").live("click", function (event) {
        event.preventDefault();
        var src = $(this).attr("data-video");
        $("#videoContainer .video").attr('src', src);


        $(".overlay").show(0).animate({ top: 0 }, 1e3, function () { g_mySlider.manualPause = true; g_mySlider.pause(); });
    });

    $(".closeButton").live("click", function () {
        $(".overlay").animate({ top: "700px" }, 1e3, function () { }).hide(0);
        var videoClone = $('#videoContainer').html();
        $('#videoContainer div').remove();
        $("#videoContainer").html(videoClone);
        g_mySlider.resume();
    });

});