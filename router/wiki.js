var router = require('express').Router();

var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.get('/', function(req, res, next) {
  Page.findAll({})
    .then(function(pages){
      res.render('index', {
        pages
      })
    })
    .catch(function(err){
      next(err)
    })
});



router.post('/', function(req, res, next) {
  // console.log(req.body)

  User.findOrCreate({
    where:{
      email: req.body.authorEmail,
      name: req.body.authorName
    }
  })
  .spread(function(user, wasCreatedBool){
    // var splitTags = req.body.tags.split(',').map(function(elem){
    //   return elem.trim()
    // }) //I think this works because using .split() returns an array; this worked.

    return Page.create({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      // tags: splitTags
      tags: req.body.tags

    })//an alias for build and save
    .then(function(createdPage){
      return createdPage.setAuthor(user)//what does it just know what setAuthor is from the model?! //*relationship method* //this is async becuse it touched the database
    })
  })
  .then(function(createdPage){
    res.redirect(createdPage.route)
  })
  .catch(next)
});


router.get('/add', function(req, res, next) {
  res.render('addpage')
});

router.get('/search/:tag', function(req, res, next){
  console.log('this works')
  console.log(req.params.tag)
  Page.findByTag(req.params.tag)
    .then(function(pages){
      res.render('index', {pages})
    })
}) //this works according to video

router.get('/search', function(req, res, next){
  res.render('tagsearch')
})

router.post('/tagSearch', function(req, res, next){
  res.json('lalaaaaaa!!')
})

router.get('/tagSearch', function(req, res, next){//why :tag????? sooooo confused WHY DOESNT THIS WORK//
  // console.log('this should work now?')
  // console.log(req.query)//NICE
  Page.findByTag(req.query.tagSearch)//idk where this becomes a query tho!! before the find by it's nothing no? is it because get with form input, not post?
    .then(function(pages){
      // console.log(req.query.tagSearch)
      // console.log(pages)
      // res.json(pages)
      res.render('index',{ pages })
    })
    .catch(next)
  // res.render('tagsearch') // why don't I come in here and do findAll where: input tag is in tag array? why class method?
})

router.get('/:urlTitle', function(req, res, next){

  Page.findOne({ 
    where: { 
      urlTitle: req.params.urlTitle
    },
    include:[
        {model:User, as:'author'}//so does this smartly grab the user info of the author, thanks to the belongs to?
    ] // i think instead of this, can do getAuthor. yep yep
  })
  .then(function(foundPage){
    // res.json(foundPage);
    // console.log('*****foundPage', foundPage)
    res.render('wikipage', {
        page: foundPage})
  })
  .catch(next);

})

router.get('/:urlTitle/similar', function(req, res, next){
  Page.findOne(
    {where: {urlTitle: req.params.urlTitle}}
    )
    .then(function(page){
      return page.findSimilar()
    })
    .then(function(similarPages){
      res.render('index', {pages: similarPages})
    })
})

module.exports = router;