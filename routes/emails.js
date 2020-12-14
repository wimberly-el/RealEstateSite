const express = require('express');
const router = express.Router()
const Email = require('./../models/emails');



router.post('/', async (req,res, next)=>{
  const email = new Email({
    emailAddress: req.body.address
  });
  
  try{
     await email.save();
   //  res.redirect('home/home')
  }catch(e){
    console.log("uh oh "+ e);
  }

});


  
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