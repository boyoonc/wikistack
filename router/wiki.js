var router = require('express').Router();
router.use(require('body-parser').urlencoded( { extended: false } ))

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
    } 
  })
  .then(function(foundPage){
    // res.json(foundPage);
    res.render('wikipage', {
    	page: foundPage})
  })
  .catch(next);

})

module.exports = router;