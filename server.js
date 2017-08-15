var express = require('express')
var nunjucks = require('nunjucks')
var morgan = require('morgan')//logging middleware
var bodyParser = require('body-parser')
var path = require('path')

var models = require('./models');

var app = express() //think of as a pipeline

app.use(morgan('dev'))

app.set('view engine', 'html')
app.engine('html', nunjucks.render)
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

nunjucks.configure('views', {noCache: true});

app.get('/', function(req, res, next){
	res.render('index')
})

// models.User.sync({})
// .then(function () {
//     return models.Page.sync({})
// })
models.db.sync({force:true})
.then(function () {
    // make sure to replace the name below with your express app
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error);

app.use('/', require('./router'))