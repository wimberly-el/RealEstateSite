const express = require('express');
//const emails = require('../models/emails');
const router = express.Router();
const User = require('./../models/user');
const { Cookie } = require('express-session');
const session= require('express-session');
//trying out cookies
//const cookieParser = require('cookie-parser');

//router.use(express.cookieParser());

router.route('/register').get((req,res)=>{
    //when creating a new item, you only need the new function
    res.render('../views/home/register', {users: new User()});
}).post(async (req,res)=>{
    //when posting to the collection, you need to refer to the body and make sure the form items are
    //named correctly because this refers to the names.
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    //after that information is saved to a constant using the User schema
    //it tries to save the user to the requisite collection
    
      try{
         await user.save();
        res.redirect('/users/login');
      }catch(e){
        console.log("uh oh "+ e);
      }
});


/*

username:"amaze"
email:"dude@gmail.com"
password:"asdf"

*/


const TWO_HOURS = 1000 * 60 * 60 * 2;

const { 
    PORT = 3000, 
    NODE_ENV = 'development', 
    SESS_NAME= 'sid',
    SESS_SECRET = "it is a secret",
    SESS_LIFETIME = TWO_HOURS } = process.env;

const IN_PROD = NODE_ENV === 'production';

router.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
       maxAge: SESS_LIFETIME,
       sameSite: true,
       secure: IN_PROD
   }
}));

router.use((req,res, next)=>{
    const { userId} = req.session;
    if (userId) {
        res.locals.user = users.find(user => user.id === userId )
    }
    next();
});


const users = [
    {id: 1, name: 'Ronald', email: 'ronaldwimberlyel@gmail.com', password: 'asecretFORnoOne' },
    {id: 2, name: 'Aaron', email: 'creatorsEmail@gmail.com', password: 'esotericKnowledge' }
];

router.route('/login').get(async (req,res)=>{
    const { userId} = req.session;
    
    console.log(req.session);
    console.log(userId);
    
    res.render('../views/home/login',  {email:User.email, password: User.password});
}).post((req,res)=>{
    const {email, password} = req.body;
        console.log("step 1")
    if (email && password) {
        const user = users.find(
            user => user.email === email && user.password === password
        )
        console.log("step 2")
        if (user) {
            req.session.userId = user.id;
            console.log("step 3");
            //alert('bub');
            //console.log(req.session.email)
            console.log(user.password);
            return res.redirect('/home');

        }
    } 
    res.redirect('/login');
    //res.send("It is indeed working on the post of login");
});

module.exports = router;