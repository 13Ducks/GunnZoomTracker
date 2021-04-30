window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

$(async function () {
    let allFields = $(".pinput").map(function () {
        return this.id;
    }).get();

    $("#tabs").tabs();

    let daySchedule;
    const normalSchedule = generateSchedule();

    try {
        throw "Schedule API Is Broken"
        if (!config['apiKey']) throw "No API key!";

        const d = new Date();
        const dt = d.toLocaleString('sv').split(" ")[0];
        const schedule = new GunnSchedule(config['apiKey']);
        const year = schedule.year('2020-08-17', '2021-06-03', {
            normalSchedule: GunnSchedule.schedule2021,
            calendarId: 'fg978mo762lqm6get2ubiab0mk0f6m2c@import.calendar.google.com',
            defaultSelf: 0b1111
        })
        await year.update()

        periods = year.get(dt).periods

        newPeriodNames = {
            'A': '1',
            'B': '2',
            'C': '3',
            'D': '4',
            'E': '5',
            'F': '6',
            'G': '7',
            'l': 'Lunch',
            's': 'SELF',
            'f': 'FLEX'
        }


        for (let i = 0; i < periods.length; i++) {
            let curr = periods[i];
            if (curr['period'] == 'g') {
                curr['period'] = getGunnTogetherPeriod();
                curr['gunnTogether'] = true
            } else {
                if (!Object.keys(newPeriodNames).includes(curr['period'])) {
                    periods.splice(i, 1);
                    i--;
                } else {
                    curr['period'] = newPeriodNames[curr['period']]
                }
            }
        }

        daySchedule = periods;
    } catch (e) {
        const options = {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }

        const formatter = new Intl.DateTimeFormat([], options);

        const d = new Date(Date.parse(formatter.format(new Date())))

        const day = d.getDay();

        $("#timetext").text("Time: " + formatHM(d.getHours(), d.getMinutes()));

        daySchedule = normalSchedule[day];
    }

    const createItem = function (div, period) {
        const actualClass = allFields.includes("p" + period['period']);

        periodDiv = $("<div>", { id: div.id + period['period'] });
        div.append(periodDiv);

        periodDivTop = $("<div>", { id: div.id + period['period'] + "top" });
        periodDiv.append(periodDivTop);

        periodDivTop.css({ "display": "flex" });
        periodDivTop.append($("<p>", {
            class: "periodtext", text: period["period"] +
                (period.gunnTogether ? " (Gunn Together)" : "") + (actualClass ? ":" : "")
        }))
        if (actualClass)
            periodDivTop.append($('<button>', { id: "p" + period['period'] + "buttonschedule", class: "schedulebutton", text: "Open" }))

        const startStr = formatHM(period['start']['hour'], period['start']['minute']);
        const endStr = formatHM(period['end']['hour'], period['end']['minute']);

        periodDivBottom = $("<div>", { id: div.id + period['period'] + "bottom" });
        periodDiv.append(periodDivBottom);
        periodDivBottom.append($('<p>', { class: "periodtimetext", text: startStr + " - " + endStr }));
    };

    generateClassList = function () {
        const d = new Date();
        $("#timetext").text("Time: " + formatHM(d.getHours(), d.getMinutes()));
        const totalMinutes = d.getHours() * 60 + d.getMinutes();

        const upcomingDiv = $('#upcomingdiv');
        const currentDiv = $('#currentdiv')
        const passedDiv = $('#passeddiv');

        upcomingDiv.empty();
        currentDiv.empty();
        passedDiv.empty();

        if (daySchedule) {
            for (const key of Object.keys(daySchedule)) {
                const period = daySchedule[key];
                if (totalMinutes < period['start']['totalMinutes']) {
                    createItem(upcomingDiv, period);
                } else if (totalMinutes >= period['start']['totalMinutes'] && totalMinutes < period['end']['totalMinutes']) {
                    createItem(currentDiv, period);
                } else if (totalMinutes >= period['end']['totalMinutes']) {
                    createItem(passedDiv, period);
                }
            }

            $(".periodtext").css({ "flex": "auto", "margin": "0px", "padding": "0px" });
            $(".periodtimetext").css({ "margin": "0px", "padding": "0px", "margin-bottom": "20px", "margin-top": "5px" });
            $(".schedulebutton").css({ "cursor": "pointer" });
        } else {
            $("#currenttext").text("No");
            $("#upcomingtext").text("Class");
            $("#passedtext").text("Today!");
        }
    }

    generateClassList();
    setInterval(generateClassList, 1000 * 30);

    browser.storage.sync.get(allFields, function (items) {
        for (const key of Object.keys(items)) {
            $("#" + key).val(items[key]);
        }
    });

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

function formatHM(h, m) {
    const period = h >= 12 ? 'PM' : 'AM';
    const hours = ((h + 11) % 12 + 1).toString();
    const minutes = zfill(m, 2);
    return hours + ":" + minutes + " " + period;
}

function zfill(number, size) {
    number = number.toString();
    while (number.length < size) number = "0" + number;
    return number;
}