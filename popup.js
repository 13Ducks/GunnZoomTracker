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
        const targetID = event.target.id;
        const linkID = "#" + targetID.substring(0, targetID.indexOf("button"));
        let link = $(linkID).val();

        if (!link.startsWith("https://")) link = "https://" + link;

        browser.tabs.create({
            url: link
        });
    });

    $('.pinput').each(function () {
        $(this).blur(function () {
            browser.storage.sync.set({ [this.id]: $("#" + this.id).val() });
        });
    })

    $("#fullschedule").on("click", function () {
        browser.tabs.create({
            url: "https://gunn.pausd.org/campus-life/bell-schedule"
        });
    });
});