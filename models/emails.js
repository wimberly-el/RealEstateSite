const mongoose = require('mongoose');
//const marked = require('marked');
//const slugify = require('slugify');

//const createDomPurify = require('dompurify');
//const { JSDOM } = require('jsdom');

//const dompurify = createDomPurify(new JSDOM().window);


const emailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
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