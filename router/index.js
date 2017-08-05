var router = require('express').Router()

const wikiRouter = require('./wiki');
const userRouter = require('./user');

var models = require('../models');
var Page = models.Page; 
var User = models.User; 


router.use('/wiki', wikiRouter);



module.exports = router