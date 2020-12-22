const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    session: {
        type: String
        }

});

module.exports = mongoose.model('Session', sessionSchema);