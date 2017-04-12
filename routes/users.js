var express=require('express');
var router = express.Router();
var app = express();
var passport=require('passport');

var passport=require('passport');

var LocalStrategy=require('passport-local').Strategy;
var socket=require('socket.io');
var User= require('../models/user');
var mysql=require('mysql');
var net =require('net');
var server = require("http").createServer(app);
var io= require('socket.io').listen(server);
var connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rdms',
    port: 3306
});



//Save userlist
router.post('/EditUserList',function(req,res){
    console.log(">>>>>Update page here<<<<<<");
    var userId=req.body.UserId
    var firstname = req.body.firstname;
    var lastname=req.body.lastname;
    var email = req.body.email;
    var contact=req.body.contact;
    var address=req.body.address;

    console.log(userId);
    console.log(firstname);
    console.log(lastname);
    console.log(email);
    console.log(contact);
    console.log(address);

    var post = {FirstName: firstname, Email: email,LastName:lastname,Contact:contact,Address:address};

    connection.query('UPDATE  user SET ? WHERE UserId=?',[post,userId], function (err, rows) {
        if (err) throw err;

        console.log('Data received in Db:\n');
        res.redirect('/users/userlist');
    });




});

router.get('/DeleteUserList:UserId',function (req,res){
    var userId=req.params.UserId
    console.log(userId);
    console.log(">>>>>>Delete the record<<<<<<<<<<<");
    connection.query("Delete  FROM `user` WHERE `UserId` = '" + userId + "'", function (err, rows) {
        console.log("function list");
        if(err)
            console.log("Error Selecting : %s ",err );

        res.redirect('userlist');


    });



});


router.get('/userlist',function (req,res){
    console.log("admin page started");


    connection.query("SELECT * FROM `user`", function (err, rows) {
        console.log("function list");
        if(err)
            console.log("Error Selecting : %s ",err );

        res.render('userlist',{rows:rows});


    });



});

router.get('/EditUserList:UserId',function(req,res){
    var userId=req.params.UserId;
    console.log(userId);
    connection.query("SELECT * FROM `user` WHERE `UserId` = '" + userId + "'", function (err, rows) {
        console.log("edit list");
        console.log(rows[0].FirstName);
        if(err)
            console.log("Error Selecting : %s ",err );

        res.render('EditUserList',{rows:rows});


    });

});

router.get('/Gallery',function(req,res)
{
    res.render('Gallery')


});



router.get('/message',function(req,res) {
    res.sendFile(__dirname + '/message.html');


router.get('/message',function(req,res)
{



router.get('/message',function(req,res) {
    res.sendFile(__dirname + '/message.html');

});





//router.get('/affected',function(req,res)
//{
    //  res.render('affected')


//});



});

//router.get('/affected',function(req,res)
//{
//  res.render('affected')




//router.get('/affected',function(req,res)
//{
//  res.render('affected')



//});


router.get('/contact', function (req, res) {
    res.render('contact')


});
router.get('/about', function (req, res) {
    res.render('about')


});


//register
router.get('/register', function (req, res) {
    res.render('register')


});

router.get('/search', function (req, res) {
    res.render('search');

});
//UserDashboard
router.get('/userdashboard', function (req, res) {
    res.render('userdashboard');
});

//login
router.get('/login', function (req, res) {
    res.render('login');
});
//Admin Dashboard

router.get('/Dashboard', function (req, res) {
    res.render('Dashboard');
});

    router.get('/Dashboard', function (req, res) {
        res.render('Dashboard');
    });


    router.get('/zone', function (req, res) {
        res.render('zone');
    });


router.get('/zone', function (req, res) {
    res.render('zone');
});


router.get('/service', function (req, res) {
    res.render('service');
});
    router.get('/zone', function (req, res) {
        res.render('zone');
    });



    router.get('/service', function (req, res) {
        res.render('service');
    })



// Register User
router.post('/register', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.username;
    var contact = req.body.contact;
    var address = req.body.address;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    }
    else {

        var newUser = new User(username, password, email, firstname, lastname, contact, address);

         res.redirect('/users/login');

    }


});


router.post('/login', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    // callback with username and password from our form
    console.log('Post started');
    console.log(username);


    connection.query("SELECT * FROM `user` WHERE `UserName` = '" + username + "'", function (err, rows) {
        if (err) {
            req.flash('Username not exist');
            res.redirect('/users/login');
        }

        connection.query("SELECT * FROM `user` WHERE `UserName` = '" + username + "'", function (err, rows) {
            if (err) {
                req.flash('error_msg','Username not exist');
                res.redirect('/users/login');
            }
            if(rows[0].UserType=='undefined'){

                console.log('error');
                req.flash('error_msg', 'Username and Password did not match');

                res.redirect('/users/login');
            }


        if ((rows[0].UserType == 1)) {

            if (rows[0].UserName == username && rows[0].Password == password) {
                res.redirect('/users/Dashboard');

            }

            else {
                res.redirect('/users/login');
            }


        }


        if (!(rows[0].UserType == 1)) {

            console.log('User logged in');


            if (rows[0].UserName == username && rows[0].Password == password) {
                console.log(rows[0].UserName);
                res.redirect('/users/userdashboard')
            }
            else {
                console.log('error');

                if (rows[0].UserName == username && rows[0].Password == password) {
                    console.log(rows[0].UserName);
                    req.flash('success_msg', 'You are logged in', rows[0].UserName);
                    res.redirect('/users/userdashboard')
                }
                else {
                    console.log('error')
                    req.flash('error_msg', 'Username and Password did not match');



                res.redirect('/users/login');

            }

        }



    }


})


        });




    })




//Search
router.post('/search', function (req, res) {


    var firstname = req.body.firstname;
    console.log(firstname);


        var firstname = req.body.firstname;
        console.log(firstname);


    /*passport.use('local', new LocalStrategy({
     // by default, local strategy uses username and password
     usernameField : 'username',
     passwordField : 'password',
     passReqToCallback : true // allows us to pass back the entire request to the callback
     },*/



    // callback with username and password from our form
    console.log('Search started');
    console.log(firstname);

        var firstname = req.body.firstname;
        console.log(firstname);


        // callback with username and password from our form
        console.log('Search started');
        console.log(firstname);


    connection.query("SELECT * FROM `user` WHERE `FirstName` = '" + firstname + "'", function (err, rows) {
        //console.log(rows[0].FirstName);
        if (err) {
            req.flash('error_msg', 'No search found of this usertype');
            res.redirect('/users/index')

        }

        res.render('search', {rows: rows});

            /*passport.use('local', new LocalStrategy({
             // by default, local strategy uses username and password
             usernameField : 'username',
             passwordField : 'password',
             passReqToCallback : true // allows us to pass back the entire request to the callback
             },*/


    });

            // callback with username and password from our form
            console.log('Search started');
            console.log(firstname);


            connection.query("SELECT * FROM `user` WHERE `FirstName` = '" + firstname + "'", function (err, rows) {
                //console.log(rows[0].FirstName);
                if (err) {
                    req.flash('error_msg', 'No search found of this usertype');
                    res.redirect('/users/index')


                }

                res.render('search', {rows: rows});


            });
        });
})
module.exports=router;


