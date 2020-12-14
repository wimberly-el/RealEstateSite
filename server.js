const express = require('express');
const app = express();
const articleRouter = require('./routes/articles');
const emailRouter = require('./routes/emails');
const cors = require('cors');
const mongoose =require('mongoose');
const Article = require('./models/articles');
const Email = require('./models/emails');
const methodOverride = require('method-override');

console.log("this is working");

require('dotenv').config();

//const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

app.listen( process.env.PORT || 5000);

mongoose.connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
  });


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', async (req,res)=>{
    const articles = await Article.find().sort({createdAt:'desc'});
 
    
    res.render('articles/index', {articles:articles});
});


app.get('/home', async (req,res)=>{
  //const emails = await Email.find();

  res.render('home/home', {emails: new Email()});

});

app.use('/articles', articleRouter);
app.use('/emails', emailRouter);



