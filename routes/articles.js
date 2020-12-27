const express = require('express');
const router = express.Router()
let cookieParser = require('cookie-parser');
router.use(cookieParser());
const Article = require('../models/articles');


const articleRouter = require('../routes/articles');
const { route } = require('./emails');

router.get('/new', (req,res)=>{
    res.render('../views/articles/new', {article: new Article()});
});

router.route('/').get(async(req,res)=>{
    const cookieName = await req.cookies.name;
    const articles = await Article.find().sort({createdAt:'desc'});
    res.render('main/blog', {articles:articles, cookieName});
});

router.get('/edit', (req,res)=>{
    res.render('../views/articles/edit');
});

router.post('/', async (req,res, next)=>{
    req.article = new Article();
    next();    
}, saveArticleAndRedirect('new'));

router.get('/:slug', async(req,res)=>{
   const article = await Article.findOne({slug: req.params.slug});
   const { userId} = req.session;
   if (article == null) {res.redirect('/')}
   res.render('articles/show', {article: article, userId});
})

router.delete('/:id', async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/blog');
})

router.put('/:id', async (req,res, next)=>{
    req.article = await Article.findById(req.params.id);

    next();
}, saveArticleAndRedirect('edit'));

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
  });

function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title;
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/blog/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }


module.exports = router;