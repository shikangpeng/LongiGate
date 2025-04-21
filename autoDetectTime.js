
// Below shows the functions that are required to build up the time auto detection helper
// Basically, if session 2 stimuli is dependent upon the stimuli used in session 1, this auto detection system is designed for you!
// Here's the workflow if you want to use this system
// 1) Participants have completed session 1
// 2) Git pull their data
// 3) Use python script to extract their subject ID and create a timestamp for their session 2 and save it in /resources
// 4) Push back to git.
// 5) Now your experiment script will auto detect subjects ID and inform the time they are supposed to be back
// This function should be coupled with the cookie approach as both are used with the assumption that participants may randomly open your study link
// Thus multiple submission should be enabled.



function getFormattedDateTime(offsetHours = 0) {
    const now = new Date();
    now.setHours(now.getHours() + offsetHours);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');

    return `[${year}-${month}-${day}-${hour}]`;
}

async function checkSessionTime() {
    const prolificID = getProlificID();
    const currentTime = getFormattedDateTime(0); // e.g., "[2025-03-05-14]"
    console.log("Checking session time for:", prolificID);

    // Construct the fixed file path for the subject time CSV.
    const subjectTimePath = `resources/subject_time/sub-${prolificID}_time.csv`;
    console.log("Using subject time file:", subjectTimePath);

    try {
        const response = await fetch(subjectTimePath);
        if (!response.ok) {
            console.log("⚠️ Subject time file not found.");
            pre_timeline.unshift(createTimeErrorScreen("UNKNOWN TIME"));
            return false;
        }
        const csvText = await response.text();

        // Parse the CSV using PapaParse
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        if (parsed.errors.length > 0) {
            console.error("Error parsing CSV:", parsed.errors);
            pre_timeline.unshift(createTimeErrorScreen("PARSE ERROR"));
            return false;
        }

        if (!parsed.data || parsed.data.length === 0 || !parsed.data[0].time_ses2) {
            console.log("⚠️ No valid session time found in CSV.");
            pre_timeline.unshift(createTimeErrorScreen("UNKNOWN TIME"));
            return false;
        }

        let expectedTime = parsed.data[0].time_ses2.replace(/[\[\]]/g, '').trim();
        console.log("Expected session time from CSV:", expectedTime);

        const timeParts = expectedTime.split('-').map(Number);
        if (timeParts.length !== 4) {
            console.log("Invalid time format in CSV.");
            pre_timeline.unshift(createTimeErrorScreen("INVALID TIME FORMAT"));
            return false;
        }

        const [expYear, expMonth, expDay, expHour] = timeParts;
        const expectedDateTime = `${expYear}-${String(expMonth).padStart(2, '0')}-${String(expDay).padStart(2, '0')} at ${String(expHour).padStart(2, '0')}:00`;

        const currentTimeClean = currentTime.replace(/[\[\]]/g, '').trim();
        const [curYear, curMonth, curDay, curHour] = currentTimeClean.split('-').map(Number);
        const currentDateTime = `${curYear}-${String(curMonth).padStart(2, '0')}-${String(curDay).padStart(2, '0')} at ${String(curHour).padStart(2, '0')}:00`;

        if (`${expYear}-${expMonth}-${expDay}` !== `${curYear}-${curMonth}-${curDay}`) {
            console.log(`Date mismatch. Expected ${expectedDateTime}, but today is ${currentDateTime}.`);
            pre_timeline.unshift(createTimeErrorScreen(expectedDateTime));
            return false;
        }

        if (Math.abs(curHour - expHour) <= 2) {
            console.log("Time is within range. Proceeding...");
            return true;
        } else {
            console.log(`Time mismatch. Expected ${expectedDateTime}, but current time is ${currentDateTime}.`);
            pre_timeline.unshift(createTimeErrorScreen(expectedDateTime));
            return false;
        }
    } catch (error) {
        console.error("Error checking session file:", error);
        pre_timeline.unshift(createTimeErrorScreen("UNKNOWN TIME"));
        return false;
    }
}

function createTimeErrorScreen(expectedTime) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="text-align: center; font-size: 22px;">
                <h1>It's not time yet.</h1>
                <p>Please come back at: <b>${expectedTime}</b></p>
                <p>You are able to start 2 hours before or after the above time. But if possible, please adhere to the above time.</p>
                <p>This window will close in 10 seconds...</p>
            </div>
        `,
        choices: "NO_KEYS",
        trial_duration: 10000, // 10 seconds
        on_finish: function () {
            window.close();
        }
    };
}
