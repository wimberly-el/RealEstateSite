const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({

    emailAddress:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    comments: {
        type:String
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});



module.exports = mongoose.model('Email', emailSchema);