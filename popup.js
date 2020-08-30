window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

$(function () {
    var allFields = $(".pinput").map(function () {
        return this.id;
    }).get();

    const createItem = function (div, period) {
        const actualClass = allFields.includes("p" + period['name']);
        periodDiv = div.append($('<div>', { id: div.id + period['name'] }))
        periodDiv.append($('<p>', {
            class: "periodtext", text: period['name'] +
                (period.gunnTogether ? " (Gunn Together)" : "") + (actualClass ? ":" : "")
        }))
        if (!actualClass) return;
        periodDiv.append($('<button>', { id: "p" + period['name'] + "buttonschedule", class: "schedulebutton", text: "Open" }))
    };

    generateClassList = function () {
        const now = Date.now();
        const normalSchedule = generateSchedule(now);
        const d = new Date();

        const day = 3//d.getDay();
        const r = Math.floor(Math.random() * 6) + 9;
        const totalMinutes = r * 60 + d.getMinutes();

        const daySchedule = normalSchedule[day];

        const upcomingDiv = $('#upcomingdiv');
        const currentDiv = $('#currentdiv')
        const passedDiv = $('#passeddiv');

        upcomingDiv.empty();
        currentDiv.empty();
        passedDiv.empty();

        if (daySchedule) {
            for (const key of Object.keys(daySchedule)) {
                const period = daySchedule[key];
                if (totalMinutes < period['start']['totalminutes']) {
                    createItem(upcomingDiv, period);
                } else if (totalMinutes >= period['start']['totalminutes'] && totalMinutes < period['end']['totalminutes']) {
                    createItem(currentDiv, period);
                } else if (totalMinutes >= period['end']['totalminutes']) {
                    createItem(passedDiv, period);
                }
            }

            $(".periodtext").css({ "display": "inline-block", "margin": "5px", "padding": "0px", "margin-right": "40px" });
            $(".schedulebutton").css({ "cursor": "pointer" });
        } else {
            $("#currenttext").text("No");
            $("#upcomingtext").text("Class");
            $("#passedtext").text("Today!");
        }
    }

    generateClassList();
    setInterval(generateClassList, 1000 * 60);

    browser.storage.sync.get(allFields, function (items) {
        for (const key of Object.keys(items)) {
            $("#" + key).val(items[key]);
        }
    });

    $("#tabs").tabs();

    $(".pbutton, .schedulebutton").on("click", function (event) {
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
            url: "https://gunn.pausd.org/campus-life/bell-schedule/"
        });
    });

    $("#ugwalink").on("click", function () {
        browser.tabs.create({
            url: "https://orbiit.github.io/gunn-web-app/"
        });
    });
});