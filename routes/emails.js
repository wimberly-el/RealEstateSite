const express = require('express');
const router = express.Router()
const Email = require('./../models/emails');
router.use(express.static(__dirname + '/'));

router.route('/').get((req,res)=>{
  res.render('main/contactme')
}).post(async(req,res)=>{
  const email = new Email({
    name: req.body.name,
    comments: req.body.name,
    emailAddress: req.body.email
  });

  try {
    await email.save();
    res.redirect('contact/thankyou');
  } catch (e) {
    console.log("uh oh "+ e);
  }

});

router.route('/subscribe').get((req,res)=>{
  res.render('main/subscribe');
}).post(async (req,res)=>{
  const email = new Email({
    name: req.body.name,
    emailAddress: req.body.email
  });

  try {
    await email.save();
    res.redirect('/contact/thankyou');
  } catch (e) {
    console.log("uh oh "+ e);
  }
});

router.route('/thankyou').get((req,res)=>{
  res.render('main/thankyou');
}).post();
  
function saveEmail() {
    return async (req, res) => {
      let email = req.body.emails;
      email.emailAddress = req.body.address;
      try {
        email = await email.save();
        res.redirect(`/home/home`)
      } catch (e) {
        res.render(`home/home`, { emails: emails })
        console.log("the error was "+ e);
      }
    }
  }


module.exports = router;