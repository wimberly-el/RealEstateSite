const express = require('express');
const app = express();
//required routes
const articleRouter = require('./routes/articles');
const emailRouter = require('./routes/emails');
const userRouter = require('./routes/user');
//required tools
const cors = require('cors');
const mongoose =require('mongoose');
//gather the model schemas
const Article = require('./models/articles');
const Email = require('./models/emails');
const User = require('./models/user');
//This is used for overriding basic functions to allow delete
const methodOverride = require('method-override');
//setting up for cookies
const { Cookie } = require('express-session');
const session = require('express-session');
//For the user to deal with this app, and there's only one,
//leaving the code for the user seemed like a fast idea that
//can be repaired in the future
const TWO_HOURS = 1000 * 60 * 60 * 2;

//memory store docs recomend I do this
const MemoryStore = require('memorystore')(session);

const { 
    PORT = 3000, 
    NODE_ENV = 'development', 
    SESS_NAME= 'sid',
    SESS_SECRET = "it is a secret",
    SESS_LIFETIME = TWO_HOURS } = process.env;

const IN_PROD = NODE_ENV === 'production';

const users = [
    {id: 1, name: 'Ronald', email: 'ronaldwimberlyel@gmail.com', password: 'asecretFORnoOne' },
    {id: 2, name: 'Aaron', email: 'creatorsEmail@gmail.com', password: 'esotericKnowledge' }
];

console.log("this is working");

require('dotenv').config();

//const port = process.env.PORT || 5000;
let x = "howdy";
app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
//attempt to connect the cookie store
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
     maxAge: SESS_LIFETIME,
     sameSite: true,
     secure: IN_PROD
 },
 store: new MemoryStore({
   checkPeriod: 86400000
 })
}));

app.listen( process.env.PORT || 5000);

mongoose.connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
  });


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', async (req,res)=>{
    const articles = await Article.find().sort({createdAt:'desc'});
    const { userId} = req.session;

    
    res.render('articles/index', {articles:articles, userId});
});




app.get('/home', async (req,res)=>{
  //const emails = await Email.find();
  console.log(req.session);

  res.render('home/home', {emails: new Email()});

});

app.post('/home', async (req,res)=>{
  const email = new Email({
    emailAddress: req.body.email
  });

  try {
    await email.save();
    res.redirect('/users/login');
  }catch(e){
    console.log("uh oh "+ e);
  }


});

app.route('/logout').get().post((req,res)=>{
  req.session.destroy(err => {
      if (err) {
          return res.redirect('/home');
      }

      res.clearCookie(SESS_NAME);
      res.redirect('/');
  })
});

app.get('/users', async (req,res)=>{
 res.render('home/login', {usersHere: new User()});
  
});

app.use('/articles', articleRouter);
app.use('/home', emailRouter);
app.use('/users', userRouter);



