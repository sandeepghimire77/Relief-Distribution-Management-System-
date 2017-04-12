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


var username;
var password;
var email;
var firstname;
var lastname;
var address;
var contact;

var UserSchema=function (username,password,email,firstname,lastname,contact,address) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.firstname = firstname;
    this.lastname=lastname;
    this.contact=contact;
    this.address=address;

    var post = {UserName: username, Password: password, FirstName: firstname, Email: email,LastName:lastname,Contact:contact,Address:address};

    connection.query('INSERT INTO user SET ?', post, function (err, results) {
        if (err) throw err;

        console.log('Data received in Db:\n');
    });
}
var User=module.exports=('User',UserSchema);

/*module.exports.createUser=function(newUser, callback){
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
         newUser.save(callback);

        });
});
}*/

/*module.exports.getUserByUsername=function(username,password,callback){
var query="select UserName,Password from user where UserName=?";
    connection.query(query,[username],function (err,result) {


    });




    //  var query="select  UserName from user WHERE Username=UserName AND Password=Password";
    //connection.query(query,function (err,row) {
      //         console.log(row[0].Username);

//});
}

/*module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}
*/

/*module.exports.comparePassword= function(password, hash,callback) {
            bcrypt.compare(password, hash, function (err, isMatch) {
            if (err) throw err;
           callback(null, isMatch);
           User(password);



        });


}*/