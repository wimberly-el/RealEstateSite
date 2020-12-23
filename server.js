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
const Session = require('./models/sessions');
//This is used for overriding basic functions to allow delete
const methodOverride = require('method-override');
//setting up for cookies
const { Cookie } = require('express-session');
const session = require('express-session');
//For the user to deal with this app, and there's only one,
//leaving the code for the user seemed like a fast idea that
//can be repaired in the future
const TWO_HOURS = 1000 * 60 * 60 * 2;

//creating a regular cookie
let cookieParser = require('cookie-parser');
app.use(cookieParser());



//mongo connect docs recomend I do this
const MongoStore = require('connect-mongo')(session);

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
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    stringify: true,
    ttl: 60*60 //1 hour
  })
}));

app.listen( process.env.PORT || 5000);

mongoose.connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
  });


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', async (req,res)=>{
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip); // ip address of the user
    //req.session.leAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("My name is ="+req.cookies.name)
    const cookieName = await req.cookies.name;
    const articles = await Article.find().sort({createdAt:'desc'});
    const { userId} = req.session;
    const mySess = await Session.find();

   // let isIpFound = (theCookie) => {
    //  return theCookie.leAddress === ip;
    //}
    //const mCookie = await Session.find((x) => x);
    
    const { leAddress } = req.session;
    let randy = [];
    const sess = await  ( await Session.find().sort({expires: 'desc'})).forEach(y=> randy.push(JSON.parse(y.session)));
    //let thrawn = sess.forEach(x=> JSON.parse(x.session) );
    //console.log(JSON.parse(mySess[0].session));
    randy.forEach(x=> (x.userId == 2&& x.leAddress == '::1'?console.log(x.userId + "  " + x.leAddress):console.log("wow")));
    // //console.log(Object.values(randy));
    // //console.log(randy[0].userId);
    //let solitions = 
    //console.log(mCookie.keys(expires));

    //console.log("The address is " + leAddress + " the other result is " + " " + mCookie);
    //console.log( typeof mCookie);
    res.render('articles/index', {articles:articles, userId, leAddress, randy, ip, cookieName});
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
/*
app.route('/logout').delete((req,res)=>{
    let randy = [];
    const sess = await  ( await Session.find().sort({expires: 'desc'})).forEach(y=> randy.push(JSON.parse(y.session)));
    
    await Session.find() .findByIdAndDelete(req.params.id);
    
    
    res.redirect('/');
});*/

app.get('/users', async (req,res)=>{
 res.render('home/login', {usersHere: new User()});
  
});

app.use('/articles', articleRouter);
app.use('/home', emailRouter);
app.use('/users', userRouter);



