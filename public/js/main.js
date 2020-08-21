function modalAlert(type, errorText) {
    $("#requestModal .modal-body").append(`
        <div class="alert alert-${type}" role="alert">
            ${type == "danger" ? "An Error Occured:" : "Success!"}: ${errorText}
        </div>
    `);

    $(`#requestModal .modal-body>.alert-${type}`)
        .hide()
        .slideDown();

    setTimeout(function() {
        $(`#requestModal .modal-body>.alert-${type}`).slideUp(function() { this.remove(); });
    }, 3000);
};

function updateStats() {
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
        console.error(`Radio status GET failed: "${textStatus}".`);
    });
}

$(document).ready(function() {
    updateStats()
    setInterval(updateStats, 30000);

    var debounce = false

    $("#request-submit").click(function() {
        if (debounce) { return };
        debounce = true

        var request_type = $("#request-type").val(),
            request_name = $("#request-name").val(),
            request_message = $("#request-message").val();

        if (!["shoutout", "play"].includes(request_type)) {
            modalAlert("danger", "Please select a request type!");
        } else if (request_name.length < 3) {
            modalAlert("danger", "Please enter a longer name! (Atleast 3 characters.)");
        } else if (request_message.length < 10) {
            modalAlert("danger", "Please enter a longer message! (Atleast 10 characters.)");
        } else {
            $.ajax({
                type: "POST",
                url: "https://api.bappy0x.tk/jetradio/request",
                data: JSON.stringify({ type: request_type, name: request_name, message: request_message }),
                contentType: "application/json",
                dataType: "json"
            })
            .done(data => {
                if (data.success) {
                    modalAlert("success", "Successfully sent your request!");
                } else {
                    modalAlert("danger", data.error);
                };
            })
            .fail((_, textStatus) => {
                modalAlert("danger", textStatus);
            });
        };

        setTimeout(function() { debounce = false }, 3400);
    });
});