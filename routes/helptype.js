var express=require('express');
var router = express.Router();
var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy;
var Helptype=require('../models/helptype');
var mysql=require('mysql');
var connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rdms',
    port: 3306
});
router.get('/service',function (req,res) {
    res.render('service');
});
router.get('/servicelist', function (req,res) {
    console.log("service list started");

    connection.query("SELECT * FROM servicetype", function (err, rows) {
        console.log("affected area list");
        if (err)
            console.log("Error Selecting : %s ", err);

        res.render('servicelist',{rows: rows});


    });
});
router.get('/userservicelist',function(req,res)
{
    connection.query("SELECT * FROM servicetype", function (err, rows) {
        console.log("service list");
        if (err)
            console.log("Error Selecting : %s ", err);

        res.render('userservicelist',{rows: rows});


    });

});
router.get('/servicedescription:Id', function (req,res) {
    var id = req.params.Id;
    console.log(id);
    connection.query("SELECT * FROM `servicetype` WHERE `Id` = '" + id + "'", function (err, rows) {
        console.log("Service Description");
        if(err)
            console.log("error selecting: %s", err);
        res.render('servicedescription',{rows: rows});
    });
});


router.get('/editservicelist:Id',function(req,res){
    var id=req.params.Id;
    console.log(id);
    connection.query("SELECT * FROM `servicetype` WHERE `Id` = '" + id + "'", function (err, rows) {
        console.log("edit list");
        if(err)
            console.log("Error Selecting : %s ",err );
        res.render('editservicelist',{rows:rows});
    });
});

router.get('/deleteservicelist:Id',function (req,res) {
    var id =req.params.Id;
    connection.query("DELETE FROM `servicetype` WHERE `Id` = '" + id + "'", function (err, rows) {
        console.log("delete list");
        if(err)
            console.log("Error deleting : %s ",err );
        res.redirect('servicelist');
    });
});


router.post('/editservicelist',function(req,res){
    var id=req.body.Id
    var servicename = req.body.servicename;
    var servicedescription=req.body.servicedescription;
    var servicetype = req.body.servicetype;
    var serviceprovider=req.body.serviceprovider;

    var post = {ServiceName:servicename,ServiceDescription:servicedescription,ServiceType:servicetype,ServiceProvider:serviceprovider};

    connection.query('UPDATE  servicetype SET ? WHERE Id=?',[post,id], function (err, rows) {
        if (err) throw err;

        console.log('Data received in Db:\n');
        res.redirect('/helptype/servicelist');
    });
});
//Zone
router.post('/service', function(req, res){

    var helpname = req.body.servicename;
    var helpdescription = req.body.servicedescription;
    var helptypes = req.body.servicetype;
    var helpprovider = req.body.serviceprovider;

    // Validation
    req.checkBody('servicename', 'Service Name is required').notEmpty();
    req.checkBody('servicedescription', 'Service Description is required').notEmpty();
    req.checkBody('servicetype', 'Service type is required').notEmpty();
    req.checkBody('serviceprovider', 'Service provider is required').notEmpty();
    var errors = req.validationErrors();

    if(errors){
        res.render('service',{
            errors:errors
        });
    } else {

        var helptype=new Helptype(helpname,helpdescription,helptypes,helpprovider);


        req.flash('success_msg', 'New service is Registered');
        res.redirect('/');



    }


});


module.exports=router;


