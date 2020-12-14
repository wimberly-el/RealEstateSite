const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({

    emailAddress:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});



module.exports = mongoose.model('Email', emailSchema);