var router = require('express').Router();
// router.use(require('body-parser').urlencoded( { extended: false } )) //not in given code

var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.get('/', function(req, res, next) {
  // res.send('got to GET /wiki/');
  // res.redirect('/')
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
  // res.send('got to POST /wiki/');
  // res.send(req.body)
  console.log(req.body)//logs to morgan

  /* getting rid of so we can do find or create to avoid making the same user twice
  var author = User.build({
    name: req.body.authorName,
    email: req.body.authorEmail
  });

  author.save()
    .then(function(savedAuthor){
      console.log(savedAuthor)
    })
    .catch(next)
    */

  User.findOrCreate({
    where:{
      email: req.body.authorEmail,
      name: req.body.authorName
    }//this will access our email and return a promise
  })
  // .then(function(){
    // var user = values[0]
  // }) //this is resolving into two things: 1. pageThatWasFoundorCreated 2.True - created, False- found in an array
  .spread(function(user, wasCreatedBool){//spreads out the [] into multiple parameters
    return Page.create({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status

    })//an alias for build and save
    .then(function(createdPage){
      return createdPage.setAuthor(user)//what does it just know what setAuthor is from the model?! //*relationship method* //this is async becuse it touched the database
    })
  })
  .then(function(createdPage){
    res.redirect(createdPage.route)
  })
  .catch(next)

  /* before users integration
  var page = Page.build({
  	title: req.body.title,
  	content: req.body.content
  })
  page.save()
  	.then(function(savedPage){
  		// res.json(page)
  		res.redirect(savedPage.route)
  	})
  	.catch(function(err){
  		next(err)
  	})
  // res.redirect('/')
*/
});


router.get('/add', function(req, res, next) {
  // res.send('got to GET /wiki/add');
  res.render('addpage')
});

router.get('/:urlTitle', function(req, res, next){
	// var urlTitleOfAPage = req.params.urlTitle
	// res.send('hit dynamic route at ' + urlTitleOfAPage);

	Page.findOne({ 
    where: { 
      urlTitle: req.params.urlTitle
    },
    include:[
        {model:User, as:'author'}//do does this smartly grab the user info of the author, thanks to the belongs to?
    ]
  })
  .then(function(foundPage){
    // res.json(foundPage);
    console.log('*****foundPage', foundPage)
    res.render('wikipage', {
        page: foundPage})
  })
  .catch(next);

})

module.exports = router;