const util = require('util');

// To non-busily wait later on
const sleep = util.promisify(setTimeout);
const cfg = require('../config/snowflake');

let SEQ = 0;
let LAST_TIME = 0;
const BINARY_MID = cfg.mid.toString(2);

function convertBases(n,f,t) {
    return parseInt(n,f).toString(t);
}

exports.gen = async function() {
    let ctime = Date.now();
    let binary_time;
    let binary_seq;
    let binary_id;

    // If there has been more than 1 ID generated this ms.
    if(LAST_TIME == ctime) {
        SEQ++;

        // To prevent the SEQ bit overflowing and causing identical IDs being given, we must stall for 1ms.
        if(SEQ > 4095) {
            SEQ = 0;

            // Non-busy 1ms wait, then get the new time
            await sleep(1);
            ctime = Date.now();
        }
    } else {
        // No more IDs this ms, reset SEQ and update last time.
        SEQ = 0;
        LAST_TIME = ctime;
    }

    // Now that our time is accurate, convert it and the SEQ to binary.
    binary_time = (ctime - cfg.timeOffset).toString(2);
    binary_seq = SEQ.toString(2);

    // Note time should be the only dynamic-length portion of the ID.
    binary_id = binary_time + BINARY_MID.padStart(6,'0') + binary_seq.padStart(12,'0');

    // Convert it to base10 and return result.
    return convertBases(binary_id,2,10);
}

exports.getDate = function(id) {
    let binary_id = convertBases(id,10,2);

    // The time portion of the snowflake will change in time,
    // Use the static portions to determine its length.
    let time_len = binary_id.length-(18);

    // Time in base2
    let binary_time = binary_id.substring(0,time_len);

    // Time in base10
    let time = parseInt(binary_time,2) + cfg.timeOffset;

    return new Date(time);
}
