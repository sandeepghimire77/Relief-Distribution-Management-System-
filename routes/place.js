var express=require('express');
var router = express.Router();
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var Place=require('../models/place');
var mysql=require('mysql');
var connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rdms',
    port: 3306
});
router.get('/zone',function (req,res) {

    res.render('zone');
});
router.get('/affectedarea', function (req,res) {
    console.log("affected area list started");

    connection.query("SELECT * FROM place", function (err, rows) {
        console.log("affected area list");
        if (err)
            console.log("Error Selecting : %s ", err);

            res.render('affectedarea',{rows: rows});


    });
});
router.get('/affected',function(req,res)
{
    connection.query("SELECT * FROM place", function (err, rows) {
        console.log("affected area list");
        if (err)
            console.log("Error Selecting : %s ", err);

        res.render('affected',{rows: rows});


    });

});
router.get('/placedetaildescription:Id',function(req,res)
{
    var id = req.params.Id;
    console.log(id);
    connection.query("SELECT  * FROM `place` WHERE `Id` = '" + id + "'", function (err, rows) {

        console.log(rows[0].DetailDescription);
        if (err)
            console.log("Error Selecting : %s ", err);

        res.render('placedetaildescription',{rows: rows});


    });

});

router.get('/deleteaffectedarea:Id',function (req,res) {
    var id =req.params.Id;
    connection.query("DELETE FROM `place` WHERE `Id` = '" + id + "'", function (err, rows) {
        console.log("delete list");
        if(err)
            console.log("Error deleting : %s ",err );
        res.redirect('affectedarea');
    });
});
/*router.get('Editaffectedarea', function (req, res) {
    res.render('Editaffectedarea');
})*/
router.get('/Editaffectedarea:Id',function(req,res){
    var id=req.params.Id;
    console.log(id);
    connection.query("SELECT * FROM `place` WHERE `Id` = '" + id + "'", function (err, rows) {
        console.log("edit list");
        if(err)
            console.log("Error Selecting : %s ",err );
        res.render('Editaffectedarea',{rows:rows});
    });
});

//
//router.get('/searcharea',function(req,res)
//{
    //res.render('Searcharea')
//});

//Search
router.post('/search', function(req, res) {
    var placename=req.body.placename;
    console.log(placename);
    console.log('Search started');
    console.log(placename);

    connection.query("SELECT * FROM `place` WHERE `PlaceName` = '" + placename + "'", function (err, rows) {
        console.log(rows[0].PlaceName);
        if (err)
            console.log(err);
        else if(!rows[0].UserType==1)
        {
            if (!(rows[0].PlaceName == placename)) {
                console.log(rows[0].PlaceName)
                req.flash('No match found', 'Search not found ');
            }
            res.redirect('/place/Searcharea')
        }
        else {
            if (!(rows[0].PlaceName == placename)) {
                console.log(rows[0].PlaceName)
                req.flash('Username not matched', 'You are not registered');
                // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            res.redirect('/')
        }
    });
})
//
router.post('/zone', function(req, res){
    var areaname= req.body.placename;
    var zonearea= req.body.zonename;
    var district = req.body.districtname;
    var postedBy = req.body.postedbyname;
    var details = req.body.detaildescription;
    var contact= req.body.contactnumber;
    var email=req.body.email;

    // Validation
    req.checkBody('placename', 'Place Name is required').notEmpty();
    req.checkBody('zonename', 'Zone Name is required').notEmpty();
    req.checkBody('districtname', 'District Name is required').notEmpty();
    req.checkBody('postedbyname', 'Posted Name is not valid').notEmpty();
    req.checkBody('detaildescription', 'Detail is required').notEmpty();
    req.checkBody('contactnumber', 'Phone Number is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    var errors = req.validationErrors();

    if(errors){
        res.render('zone',{
            errors:errors
        });
    } else {
        var place=new Place(areaname,zonearea,district,postedBy,details,contact,email);
        req.flash('success_msg', 'New place is Registered');
        res.redirect('/');
    }
});

router.post('/Editaffectedarea', function(req, res) {

          var id = req.body.Id;
          var placename = req.body.placename;
          var zonearea = req.body.zonearea;
          var districtname = req.body.districtname;
          var postedBy = req.body.postedBy;
          var detailsdescription = req.body.detaildescription;
          var contactnumber = req.body.contactnumber;
          var email = req.body.email;

          var post = {Placename: placename, ZoneName: zonearea, DistrictName:districtname, PostedByName:postedBy, DetailDescription:detailsdescription,
              PhoneNumber:contactnumber,Email:email};
        console.log("retsrerrjk");
        console.log(id);
        connection.query('UPDATE place set ? WHERE Id = ? ', [post, id], function (err, rows) {

            if (err) throw err;
                console.log("Updating : %s ", err);

            res.redirect('/place/affectedarea');

        });

    });

module.exports=router;

