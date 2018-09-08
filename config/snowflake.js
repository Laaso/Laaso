/* FlakeID configuration
 * 
 * FlakeID is responsible for ID generation and parsing.
 * Changing values here may create issues with existing IDs, so avoid changing values
 * here after creating any users or apps.
 */

module.exports = {
    // Machine ID. If Laaso is being sharded, make sure this is unique per process.
    mid: 1,

    // Epoch for Laaso. Make sure this is IDENTICAL per process on sharded instances.
    // Changing this will *destroy* how Laaso perceives creation dates of users and apps.
    // This is the epoch for Laaso, and by default is midnight on January 1, 2018.
    // Set this higher if you want smaller IDs and Laaso
    // hasn't faded into obscurity by 2019, I guess /shrug. 
    timeOffset: (2018-1970)*31557600000
}