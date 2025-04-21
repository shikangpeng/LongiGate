
// Function below is used to create a cookie stored in subject's local browser
// Cookie is used for preventing subjects opening the study multiple times once they have started the experiment
// Thus, no matter how many multiple sessions you allowed, once they started the experiment, they will not be
// permitted to re-start the study. This will help make sure your data not be contaminated by unexpected repetition

// Utility to read a cookie by name
// These should be placed on the top of your Experiment.js script
function getCookie(name) {
    // escape any special regex characters in the cookie name
    const safeName = name.replace(/([.*+?^${}()|\[\]\\/])/g, '\\$1');
    const regex = new RegExp('(?:^|; )' + safeName + '=([^;]*)');
    const match = document.cookie.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
  }

// Set up your own cookie key, change the name as you want
const cookieName = 'ses2_done';

// If participant has already completed, immediately show “already done”
if (getCookie('ses2_done') === 'true') {
    document.body.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;
                  height:100vh;font-family:sans-serif;">
        <div style="text-align:center;padding:2em;max-width:400px;">
          <h1> You have already completed Session2.</h1>
          <p>Thank you!</p>
        </div>
      </div>`;
    // Then abort everything else:
    throw new Error('Aborting rest of script');
  }


// Basic function to create a cookie, you can choose where you want to leave it
// The duration of the existence of the cookie is set for 5 days, you can adjust based on your needs
// 60x60x24x5 = 432000 s = 5 days
document.cookie = `${cookieName}=true; path=/; max-age=${60*60*24*5}`;

// This function can also be integrated into your experiment code, for example:
const test_instructions = {
    stimulus: `
        <div style="width: 80%; margin: auto; text-align: center;">
            <p>Press Space once your are ready</p>
        </div>
    `,
    choices: [" "],
    // INSERT cookie‑lock here:
    on_start: function() {
        // lock them out of any future runs
        document.cookie = `${cookieName}=true; path=/; max-age=${60*60*24*5}`;
        console.log('ses2_done cookie has been set up now');
    }
};
