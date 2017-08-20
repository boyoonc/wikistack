var router = require('express').Router()
var Promise = require('bluebird');
module.exports = router

var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.get('/', function(req, res, next){
	User.findAll({})
		.then(function(users){
			res.render('users',{
				users
			})
		})
		.catch(function(err){
			next(err)
		})
})

router.get('/:userId', function(req, res, next){
	
	var _user = User.findById(req.params.userId) //another thing I get from sequelize!
	// console.log('*****_user', _user)
	var _pages = Page.findAll(
		{where:{authorId: req.params.userId }}
		)
	// console.log('*****_pages', _pages) 
	Promise.all([_user, _pages]) //enables mutiple queries at once
		.then(function(userAndPage){
			// console.log('*****userAndPage', userAndPage)
			var user = userAndPage[0]
			var pages = userAndPage[1]
			// console.log('*****user,', user)
			// console.log('*****pages,', pages)
			
			res.render('test',{
				user, pages
			})
		})
		.catch(function(err){
			next(err)
		})
})