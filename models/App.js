const db = require('../controllers/database');

class App {
    constructor(id) {
        this.id = id;
        
    }


    static async getOne(id) {
    }
}

module.exports.App = App;
module.exports.flags = {
    SHOW_ADDRESSES      : 1,
    
};