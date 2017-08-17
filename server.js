// var express = require('express')
// var nunjucks = require('nunjucks')
// var morgan = require('morgan')//logging middleware
// var bodyParser = require('body-parser')
// var path = require('path')

// var models = require('./models');

// var app = express() //think of as a pipeline

// app.use(morgan('dev'))

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.set('view engine', 'html')
// app.engine('html', nunjucks.render)
// app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
// app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

// nunjucks.configure('views', {noCache: true});

// app.get('/', function(req, res, next){
// 	res.render('index')
// })

// // models.User.sync({})
// // .then(function () {
// //     return models.Page.sync({})
// // })
// models.db.sync({force:true})
// .then(function () {
//     // make sure to replace the name below with your express app
//     app.listen(3000, function () {
//         console.log('Server is listening on port 3000!');
//     });
// })
// .catch(console.error);

// app.use('/', require('./router'))



var express = require('express');
var nunjucks = require('nunjucks');
var morgan = require('morgan');
var bodyParser = require('body-parser');
// var bluebird = require('bluebird')
var app = express();
var wikiRouter = require('./router/wiki');
var usersRouter = require('./router/user');

var env = nunjucks.configure('views', { noCache: true });
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

// var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
// env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

app.use(morgan('dev'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);

app.get('/', function (req, res) {
    res.redirect('/wiki');
});

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});

module.exports = app;

var models = require('./models');
var Page = models.Page;
var User = models.User;
// var app = require('./app');

User.sync({force:true})
    .then(function () {
        return Page.sync({force:true});
    })
    .then(function () {
        app.listen(3000, function () {
            console.log('Server is listening on port 3000!');
        });
    });

// models are required into server, synced, then start listening to server