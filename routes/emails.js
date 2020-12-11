const express = require('express');
//const articles = require('./../models/articles');
const router = express.Router()
//const { resolveInclude } = require('ejs');
const Email = require('./../models/emails');


/*router.get('/new', (req,res)=>{
    
    res.render('../views/articles/new', {article: new Article()});
});

router.get('/edit', (req,res)=>{
    res.render('../views/articles/edit');
});*/

router.post('/', async (req,res, next)=>{
    req.email = new Email();
    next();    
}, saveEmail('new'));

/*
router.get('/:slug', async(req,res)=>{
   const article = await Article.findOne({slug: req.params.slug});
   if (article == null) {res.redirect('/')}
   res.render('articles/show', {article: article});
})

router.delete('/:id', async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

router.put('/:id', async (req,res, next)=>{
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
  });*/

function saveEmail(path) {
    return async (req, res) => {
      let email = req.Email;
      email.name = req.body.name;
      email.emailAddress = req.body.emailAddress;
      try {
        article = await email.save()
        //res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        //res.render(`articles/${path}`, { article: article })
        console.log("the error was "+ e);
      }
    }
  }


module.exports = router;