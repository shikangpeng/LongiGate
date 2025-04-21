// Function included in JavaScript to allow for timestamp data being stored into the subject DataFrame
// Then you can extract the timestamps from subjects csv file using the python code


const currentTimestamp = getFormattedDateTime(0);  // Current time
const futureTimestamp = getFormattedDateTime(24); // Time + 24 hours

// End Screen with TimeStamp creation
const end_screen = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="text-align: center; font-size: 22px;">
            <p><i>(Current time: <b>${currentTimestamp}</b>)</i></p>
            <p><i>(Please return at: <b>${futureTimestamp}</b>)</i></p>
            <p>(Please Press <b>SPACE</b> when you are done)</p>
        </div>
    `,
    // <p style="font-size: 24px; font-weight: bold; color: blue;">${prolificID}</p>
    choices: " ",
    trial_duration: 10000,
    data: { phase: "End",
            timestamp_ses1: currentTimestamp,
            timestamp_ses2: futureTimestamp
    }
};
