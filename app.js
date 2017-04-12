var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var net =require('net');
var server = require("http").createServer(app);
var io= require('socket.io').listen(server);
var app = require('express')();
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql=require('mysql');
var connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rdms',
    port: 3306
});

var routes = require('./routes');
var place=require('./routes/place');
var users = require('./routes/users');
var helptype=require('./routes/helptype');


// Init App
//var app=express();



// View Engine
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

chatusers=[];
connections=[];
io.on('connection', function(socket){
    connections.push(socket);
    console.log('connected=%s sockets connected',connections.length);
    //disconnect
    socket.on('disconnect',function(data){
        // if(!socket.username)return;
        chatusers.splice(chatusers.indexOf(socket.username),1)
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log('disconnected=%s sockets connected',connections.length);
    });
//send message
    socket.on('send message',function(data){
        console.log(data);
        io.sockets.emit('new message',{msg:data,user:socket.username});
    });

    socket.on('new user',function(data,callback){
        callback(true);
        socket.username=data;
        chatusers.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users',chatusers);
    }

});

server.listen(4000, function () {
    console.log('listening on *:4000');
});

app.use('/', routes);
app.use('/users', users);
app.use('/place',place);
app.use('/helptype', helptype);


// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));

});


