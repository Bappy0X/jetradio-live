$(document).ready(function() {
    $.ajax("https://listen.jetradio.live/status-json.xsl")
    .done(data => {
        console.log(data);
        if (!data.icestats.source || data.icestats.source.length <= 0) {
            $("#live-status")
                .html("OFFLINE.")
                .css("color", "gray");
        } else {
            $("#live-status")
                .html("WE'RE LIVE!")
                .css("color", "red");
        }
    })
    .fail((_, textStatus) => {
        console.error(`Notifications GET failed: "${textStatus}".`);
    });
});