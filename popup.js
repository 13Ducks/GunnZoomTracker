window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

$(function () {
    const allFields = $(".pinput").map(function () {
        return this.id;
    }).get();

    browser.storage.sync.get(allFields, function (items) {
        for (const key of Object.keys(items)) {
            $("#" + key).val(items[key]);
        }
    });


    $("#tabs").tabs();

    $(".pbutton").on("click", function (event) {
        saveInputs();

        const targetID = event.target.id;
        const linkID = "#" + targetID.substring(0, targetID.indexOf("button"));
        let link = $(linkID).val();

        if (!link.startsWith("https://")) link = "https://" + link;

        browser.tabs.create({
            url: link
        });
    });

    $("#savebutton").on("click", function () {
        saveInputs();
    });
});

function saveInputs() {
    const inputFields = $(".pinput");

    let linkSave = {};
    for (const i of inputFields) {
        linkSave[i.id] = $("#" + i.id).val();
    }

    browser.storage.sync.set(linkSave, function () {
        $("#savemessage").text("Saved!")
    });
}