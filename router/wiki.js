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

router.get('/search', function(req, res, next){
  res.render('tagsearch')
})

router.get('/tagSearch', function(req, res, next){//why :tag????? sooooo confused

  Page.findByTag(req.params.tagSearch)
    .then(function(pages){
      res.render('index',{ pages})
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

module.exports = router;