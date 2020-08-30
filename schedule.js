/*
Taken from https://github.com/Orbiit/gunn-web-app/blob/master/js/schedule.js
*/

// Starts on Sunday
function generateSchedule(d) {
    return [
        null,
        [
            { name: '1', start: makeHMTM(10, 0), end: makeHMTM(10, 30) },
            { name: '2', start: makeHMTM(10, 40), end: makeHMTM(11, 10) },
            { name: '3', start: makeHMTM(11, 20), end: makeHMTM(11, 50) },
            { name: '4', start: makeHMTM(12, 0), end: makeHMTM(12, 35) },
            { name: 'Lunch', start: makeHMTM(12, 35), end: makeHMTM(13, 5) },
            { name: '5', start: makeHMTM(13, 15), end: makeHMTM(13, 45) },
            { name: '6', start: makeHMTM(13, 55), end: makeHMTM(14, 25) },
            { name: '7', start: makeHMTM(14, 35), end: makeHMTM(15, 5) }
        ],
        [
            { name: '1', start: makeHMTM(9, 0), end: makeHMTM(10, 15) },
            { name: '2', start: makeHMTM(10, 25), end: makeHMTM(11, 40) },
            { name: 'Lunch', start: makeHMTM(11, 40), end: makeHMTM(12, 10) },
            { name: '3', start: makeHMTM(12, 20), end: makeHMTM(13, 40) },
            { name: '4', start: makeHMTM(13, 50), end: makeHMTM(15, 5) },
            { name: 'Flex', start: makeHMTM(15, 10), end: makeHMTM(15, 40) }
        ],
        [
            { name: '5', start: makeHMTM(9, 40), end: makeHMTM(10, 55) },
            {
                name: getGunnTogetherPeriod(d), start: makeHMTM(11, 5),
                end: makeHMTM(11, 40), gunnTogether: true
            },
            { name: 'Lunch', start: makeHMTM(11, 40), end: makeHMTM(12, 10) },
            { name: '6', start: makeHMTM(12, 20), end: makeHMTM(13, 40) },
            { name: '7', start: makeHMTM(13, 50), end: makeHMTM(15, 5) },
            { name: 'Flex', start: makeHMTM(15, 10), end: makeHMTM(15, 40) }
        ],
        [
            { name: '1', start: makeHMTM(9, 0), end: makeHMTM(10, 15) },
            { name: '2', start: makeHMTM(10, 25), end: makeHMTM(11, 40) },
            { name: 'Lunch', start: makeHMTM(11, 40), end: makeHMTM(12, 10) },
            { name: '3', start: makeHMTM(12, 20), end: makeHMTM(13, 40) },
            { name: '4', start: makeHMTM(13, 50), end: makeHMTM(15, 5) },
            { name: 'Flex', start: makeHMTM(15, 10), end: makeHMTM(15, 40) }
        ],
        [
            { name: '5', start: makeHMTM(9, 40), end: makeHMTM(10, 55) },
            { name: 'SELF', start: makeHMTM(11, 5), end: makeHMTM(11, 40) },
            { name: 'Lunch', start: makeHMTM(11, 40), end: makeHMTM(12, 10) },
            { name: '6', start: makeHMTM(12, 20), end: makeHMTM(13, 40) },
            { name: '7', start: makeHMTM(13, 50), end: makeHMTM(15, 5) }
        ],
        null
    ];
}

function getGunnTogetherPeriod(date) {
    const week = Math.floor(
        (date - new Date(2020, 8 - 1, 17)) / 1000 / 60 / 60 / 24 / 7
    )
    if (week === 0) return '5'
    return '1234567'[(week + 3) % 7]
}

function makeHMTM(hour, minute = 0) {
    return { hour, minute, totalminutes: hour * 60 + minute }
}