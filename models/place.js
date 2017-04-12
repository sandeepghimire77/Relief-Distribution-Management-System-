var mysql=require('mysql');
//var bcrypt=require('bcryptjs');

var connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rdms',
    port: 3306
});

connection.connect(
    function (err) {
        // in case of error
        if (err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

var place;
var zones;
var district;
var posted;
var detail;
var contact;
var email;




var PlaceSchema = function (place,zones,district,posted,detail,contact,email){
    this.place=place;
    this.zones=zones;
    this.district=district;
    this.posted=posted;
    this.detail=detail;
    this.contact=contact;
    this.email=email;


    var post={PlaceName:place,ZoneName:zones,DistrictName:district,PostedByName:posted,DetailDescription:detail,PhoneNumber:contact,Email:email};

    connection.query('INSERT INTO place SET ?',post,function(err,results){
        if(err) throw err;

        console.log('Data received in Db:\n');


    });
}

var Place=module.exports=('Place',PlaceSchema);

