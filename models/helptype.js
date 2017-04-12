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

var name;
var description;
var type;
var provider;



var HelptypeSchema = function (name,description,type,provider){
    this.name=name;
    this.description=description;
    this.type=type;
    this.provider=provider;

    var post={ServiceName:name,ServiceDescription:description,ServiceType:type,ServiceProvider:provider};

    connection.query('INSERT INTO servicetype SET ?',post,function(err,results){
        if(err) throw err;

        console.log('Data received in Db:\n');


    });
}

var Helptype=module.exports=('Helptype',HelptypeSchema);


