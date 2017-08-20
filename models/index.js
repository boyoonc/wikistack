var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false})
	;



var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING
    },
    date: {
    	type: Sequelize.DATE, defaultValue: Sequelize.NOW
    },
    tags:{
        type: Sequelize.ARRAY(Sequelize.TEXT),
        set(val){ //this is one of two ways to make a setter! getter gets something that exists and makes a virtual, setter manipulates things before they are put in database
            console.log('got here!')
            console.log(val)
            console.log(typeof val)
            if (typeof val === 'string'){
                var splitTags = val.split(',').map(function(elem){
                    return elem.trim()
                })
                console.log(splitTags)
                this.setDataValue('tags', splitTags)
            } else{
                console.log(val)
                this.setDataValue('tags', val)
            }
        }
    }
},
{ getterMethods: {
	route (){
		return '/wiki/' + this.urlTitle
	}
    // route: function(){
    //     return '/wiki/' + this.urlTitle   
    // }
},
 hooks:{
	beforeValidate: function (page) {
  if (page.title) {
    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    page.urlTitle = Math.random().toString(36).substring(2, 7);
  }
}
	}

});

Page.findByTag = function(tag){
    return Page.findAll(//i didn't think to have a return here, im so confused
        {where: {
            tags: {$overlap: [tag]}
        }}
    ) 
}

// function generateUrlTitle (page) {
//   if (page.title) {
//     // Removes all non-alphanumeric characters from title
//     // And make whitespace underscore
//     page.urlTitle = title.replace(/\s+/g, '_').replace(/\W/g, '');
//   } else {
//     // Generates random 5 letter string
//     page.urlTitle = Math.random().toString(36).substring(2, 7);
//   }
// }

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User,
  db: db
};