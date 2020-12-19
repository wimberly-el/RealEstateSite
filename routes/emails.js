const express = require('express');
const router = express.Router()
const Email = require('./../models/emails');


/*
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
*/

router.route('/emails').get().post(async(req,res)=>{
  const email = new Email({
    emailAddress: req.body.email
  });

  try {
    await email.save();
    res.redirect('/home/home');
  } catch (e) {
    console.log("uh oh "+ e);
  }

});

/*
router.post('/', async (req,res)=>{

  req.email = new Email();
  next();    
}, saveEmail());
  /*
  try{
     await email.save();
    res.redirect('home/home')
  }catch(e){
    console.log("uh oh "+ e);
  }
*/


  
function saveEmail() {
    return async (req, res) => {
      let email = req.body.emails;
      email.emailAddress = req.body.address;
      try {
        email = await email.save();
        console.log("it worked");
        res.redirect(`/home/home`)
      } catch (e) {
        res.render(`home/home`, { emails: emails })
        console.log("the error was "+ e);
      }
    }
  }


module.exports = router;